#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime
from typing import Optional

class MaizulAPITester:
    def __init__(self, base_url="https://maizul-resto.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.admin_user = None
        self.menu_items = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        default_headers = {'Content-Type': 'application/json'}
        if self.token:
            default_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            default_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=default_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=default_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"   ✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                print(f"   ❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"   ❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'error': str(e)
            })
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "health",
            200
        )
        return success and 'status' in response

    def test_admin_login(self):
        """Test admin login with provided credentials"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"username": "admin", "password": "Damian.01"}
        )
        if success and 'token' in response:
            self.token = response['token']
            self.admin_user = response.get('user', {})
            print(f"   🔑 Token acquired for user: {self.admin_user.get('username')} ({self.admin_user.get('role')})")
            return True
        return False

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        success, response = self.run_test(
            "Invalid Login",
            "POST", 
            "auth/login",
            401,
            data={"username": "invalid", "password": "wrong"}
        )
        return success

    def test_auth_me(self):
        """Test get current user info"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        return success and response.get('username') == 'admin'

    def test_get_menu_all_categories(self):
        """Test getting menu items for all categories"""
        categories = ['breakfast', 'lunch', 'dinner']
        all_success = True
        
        # Test all menu items
        success, response = self.run_test(
            "Get All Menu Items",
            "GET",
            "menu?available_only=false",
            200
        )
        if success:
            self.menu_items = response
            print(f"   📋 Found {len(self.menu_items)} total menu items")
        else:
            all_success = False

        # Test each category
        for category in categories:
            success, response = self.run_test(
                f"Get {category.title()} Menu",
                "GET",
                f"menu?category={category}",
                200
            )
            if success:
                print(f"   🍽️  {category.title()}: {len(response)} items")
            else:
                all_success = False

        return all_success

    def test_menu_item_crud(self):
        """Test creating, reading, updating, and deleting menu items"""
        # Test creating a new menu item
        test_item = {
            "category": "breakfast",
            "name_es": "Test Desayuno",
            "name_en": "Test Breakfast",
            "description_es": "Descripción de prueba",
            "description_en": "Test description",
            "price": 99.99,
            "is_featured": False,
            "is_available": True,
            "sort_order": 999,
            "tags": ["test"]
        }

        success, response = self.run_test(
            "Create Menu Item",
            "POST",
            "menu",
            201,
            data=test_item
        )
        
        if not success:
            return False
            
        created_id = response.get('id')
        if not created_id:
            print("   ❌ No ID returned from create")
            return False

        # Test reading the created item
        success, response = self.run_test(
            "Read Menu Item",
            "GET",
            f"menu/{created_id}",
            200
        )
        
        if not success:
            return False

        # Test updating the item
        update_data = {"price": 88.88, "is_featured": True}
        success, response = self.run_test(
            "Update Menu Item",
            "PUT",
            f"menu/{created_id}",
            200,
            data=update_data
        )
        
        if not success:
            return False

        # Test deleting the item
        success, response = self.run_test(
            "Delete Menu Item",
            "DELETE",
            f"menu/{created_id}",
            204
        )
        
        return success

    def test_user_management(self):
        """Test user management endpoints (admin only)"""
        if not self.admin_user or self.admin_user.get('role') != 'admin':
            print("   ⚠️  Skipping user management tests - not admin")
            return True

        # Get all users
        success, response = self.run_test(
            "Get All Users",
            "GET",
            "users",
            200
        )
        
        if not success:
            return False
            
        print(f"   👥 Found {len(response)} users")

        # Test creating a new user
        test_user = {
            "username": f"test_user_{int(datetime.now().timestamp())}",
            "password": "TestPass123!",
            "role": "editor"
        }

        success, response = self.run_test(
            "Create User",
            "POST",
            "users",
            201,
            data=test_user
        )
        
        if not success:
            return False
            
        created_user_id = response.get('id')

        # Update the user
        success, response = self.run_test(
            "Update User",
            "PUT",
            f"users/{created_user_id}",
            200,
            data={"role": "admin", "is_active": False}
        )
        
        if not success:
            return False

        # Delete the user
        success, response = self.run_test(
            "Delete User",
            "DELETE",
            f"users/{created_user_id}",
            204
        )
        
        return success

    def test_unauthorized_access(self):
        """Test accessing protected endpoints without token"""
        old_token = self.token
        self.token = None
        
        success, response = self.run_test(
            "Unauthorized Access to Users",
            "GET",
            "users",
            401
        )
        
        self.token = old_token
        return success

    def test_menu_search_scenarios(self):
        """Test different menu filtering scenarios"""
        all_success = True
        
        # Test available only filter
        success, response = self.run_test(
            "Get Available Menu Items",
            "GET",
            "menu?available_only=true",
            200
        )
        if success:
            available_count = len(response)
            print(f"   ✅ Available items: {available_count}")
        else:
            all_success = False

        # Test category filter
        success, response = self.run_test(
            "Get Breakfast Items",
            "GET",
            "menu?category=breakfast&available_only=false",
            200
        )
        if success:
            breakfast_count = len(response)
            print(f"   🥞 Breakfast items: {breakfast_count}")
        else:
            all_success = False

        return all_success

    def run_all_tests(self):
        """Run comprehensive API tests"""
        print("=" * 60)
        print("🧪 Starting Maizul Restaurant API Tests")
        print("=" * 60)
        
        # Basic connectivity
        if not self.test_health_check():
            print("❌ Health check failed - API may be down")
            return False

        # Authentication tests
        if not self.test_admin_login():
            print("❌ Admin login failed - cannot continue with authenticated tests")
            return False
            
        self.test_invalid_login()
        self.test_auth_me()
        self.test_unauthorized_access()

        # Menu tests
        self.test_get_menu_all_categories()
        self.test_menu_search_scenarios()
        self.test_menu_item_crud()

        # User management (admin only)
        self.test_user_management()

        # Print results
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS")
        print("=" * 60)
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Success rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed tests ({len(self.failed_tests)}):")
            for failed in self.failed_tests:
                print(f"  - {failed['test']}: {failed.get('error', f\"Expected {failed.get('expected')}, got {failed.get('actual')}\")}")
        
        print("\n🎯 Menu Items Summary:")
        if self.menu_items:
            categories = {}
            for item in self.menu_items:
                cat = item.get('category', 'unknown')
                if cat not in categories:
                    categories[cat] = 0
                categories[cat] += 1
            for category, count in categories.items():
                print(f"  - {category.title()}: {count} items")
        
        return self.tests_passed == self.tests_run

def main():
    tester = MaizulAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())