from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection - lazy initialization
mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME', 'maizul')

# Initialize client with connection timeout settings for better reliability
client = None
db = None

async def init_db():
    global client, db
    if client is None:
        if not mongo_url:
            raise Exception("MONGO_URL not configured")
        client = AsyncIOMotorClient(
            mongo_url,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
            socketTimeoutMS=10000
        )
        db = client[db_name]
        # Test connection
        await client.admin.command('ping')
        logging.info("MongoDB connected successfully")
    return db

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'maizul-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Security
security = HTTPBearer()

# Create the main app
app = FastAPI(title="Maizul Restaurant API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ================== MODELS ==================

class UserBase(BaseModel):
    username: str
    role: str = "editor"  # admin or editor

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

class User(UserBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    is_active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserResponse(BaseModel):
    id: str
    username: str
    role: str
    is_active: bool
    created_at: str

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    token: str
    user: UserResponse

class MenuItemBase(BaseModel):
    category: str  # breakfast, lunch, dinner
    name_es: str
    name_en: str
    description_es: str
    description_en: str
    price: float
    image: Optional[str] = None
    is_featured: bool = False
    is_available: bool = True
    sort_order: int = 0
    tags: List[str] = []  # popular, vegetarian, specialty, new

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(BaseModel):
    category: Optional[str] = None
    name_es: Optional[str] = None
    name_en: Optional[str] = None
    description_es: Optional[str] = None
    description_en: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    is_featured: Optional[bool] = None
    is_available: Optional[bool] = None
    sort_order: Optional[int] = None
    tags: Optional[List[str]] = None

class MenuItem(MenuItemBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# ================== AUTH HELPERS ==================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, username: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "username": username,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    payload = decode_token(credentials.credentials)
    user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user or not user.get("is_active"):
        raise HTTPException(status_code=401, detail="User not found or inactive")
    return user

async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# ================== AUTH ROUTES ==================

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    user = await db.users.find_one({"username": request.username}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.get("is_active", True):
        raise HTTPException(status_code=401, detail="User account is disabled")
    
    token = create_token(user["id"], user["username"], user["role"])
    return TokenResponse(
        token=token,
        user=UserResponse(
            id=user["id"],
            username=user["username"],
            role=user["role"],
            is_active=user["is_active"],
            created_at=user["created_at"]
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        username=current_user["username"],
        role=current_user["role"],
        is_active=current_user["is_active"],
        created_at=current_user["created_at"]
    )

# ================== USER MANAGEMENT ROUTES (Admin only) ==================

@api_router.get("/users", response_model=List[UserResponse])
async def get_users(admin: dict = Depends(require_admin)):
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(100)
    return [UserResponse(**u) for u in users]

@api_router.post("/users", response_model=UserResponse, status_code=201)
async def create_user(user_data: UserCreate, admin: dict = Depends(require_admin)):
    existing = await db.users.find_one({"username": user_data.username})
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    user = User(username=user_data.username, role=user_data.role)
    doc = user.model_dump()
    doc["password_hash"] = hash_password(user_data.password)
    
    await db.users.insert_one(doc)
    return UserResponse(**doc)

@api_router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user_data: UserUpdate, admin: dict = Depends(require_admin)):
    existing = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = {k: v for k, v in user_data.model_dump().items() if v is not None}
    if "password" in update_data:
        update_data["password_hash"] = hash_password(update_data.pop("password"))
    
    if update_data:
        await db.users.update_one({"id": user_id}, {"$set": update_data})
    
    updated = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    return UserResponse(**updated)

@api_router.delete("/users/{user_id}", status_code=204)
async def delete_user(user_id: str, admin: dict = Depends(require_admin)):
    if admin["id"] == user_id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

# ================== MENU ROUTES ==================

@api_router.get("/menu", response_model=List[MenuItem])
async def get_menu(category: Optional[str] = None, available_only: bool = True):
    query = {}
    if category:
        query["category"] = category
    if available_only:
        query["is_available"] = True
    
    items = await db.menu_items.find(query, {"_id": 0}).sort("sort_order", 1).to_list(500)
    return [MenuItem(**item) for item in items]

@api_router.get("/menu/{item_id}", response_model=MenuItem)
async def get_menu_item(item_id: str):
    item = await db.menu_items.find_one({"id": item_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return MenuItem(**item)

@api_router.post("/menu", response_model=MenuItem, status_code=201)
async def create_menu_item(item_data: MenuItemCreate, current_user: dict = Depends(get_current_user)):
    item = MenuItem(**item_data.model_dump())
    doc = item.model_dump()
    await db.menu_items.insert_one(doc)
    return item

@api_router.put("/menu/{item_id}", response_model=MenuItem)
async def update_menu_item(item_id: str, item_data: MenuItemUpdate, current_user: dict = Depends(get_current_user)):
    existing = await db.menu_items.find_one({"id": item_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    update_data = {k: v for k, v in item_data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    if update_data:
        await db.menu_items.update_one({"id": item_id}, {"$set": update_data})
    
    updated = await db.menu_items.find_one({"id": item_id}, {"_id": 0})
    return MenuItem(**updated)

@api_router.delete("/menu/{item_id}", status_code=204)
async def delete_menu_item(item_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.menu_items.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Menu item not found")

@api_router.put("/menu/reorder", response_model=dict)
async def reorder_menu_items(items: List[dict], current_user: dict = Depends(get_current_user)):
    """Update sort order for multiple items. Expects [{id: str, sort_order: int}]"""
    for item in items:
        await db.menu_items.update_one(
            {"id": item["id"]},
            {"$set": {"sort_order": item["sort_order"], "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    return {"message": "Order updated successfully"}

# ================== SEED DATA ==================

@api_router.post("/seed", response_model=dict)
async def seed_database():
    """Seed initial data - creates admin if not exists"""
    existing_admin = await db.users.find_one({"username": "admin"})
    
    if existing_admin:
        return {"message": "Admin user already exists", "admin_username": "admin"}
    
    # Create admin user: admin / Damian.01
    admin_doc = {
        "id": str(uuid.uuid4()),
        "username": "admin",
        "password_hash": hash_password("Damian.01"),
        "role": "admin",
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(admin_doc)
    
    # Check if menu items exist
    menu_count = await db.menu_items.count_documents({})
    if menu_count == 0:
        # Create sample menu items
        sample_items = [
            # Breakfast
            {"category": "breakfast", "name_es": "Chilaquiles Verdes", "name_en": "Green Chilaquiles", 
             "description_es": "Tortilla frita con salsa verde, crema, queso y huevo", "description_en": "Fried tortilla with green salsa, cream, cheese and egg",
             "price": 145, "is_featured": True, "sort_order": 1, "tags": ["popular"], "image": "https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=400"},
            {"category": "breakfast", "name_es": "Huevos Rancheros", "name_en": "Ranch-Style Eggs",
             "description_es": "Huevos fritos sobre tortilla con salsa ranchera", "description_en": "Fried eggs on tortilla with ranchera sauce",
             "price": 125, "sort_order": 2, "tags": [], "image": "https://images.unsplash.com/photo-1528712306091-ed0763094c98?w=400"},
            {"category": "breakfast", "name_es": "Molletes Maizul", "name_en": "Maizul Molletes",
             "description_es": "Pan con frijoles, queso gratinado y pico de gallo", "description_en": "Bread with beans, melted cheese and pico de gallo",
             "price": 115, "sort_order": 3, "tags": ["vegetarian"], "image": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400"},
            {"category": "breakfast", "name_es": "Hot Cakes con Frutas", "name_en": "Pancakes with Fruits",
             "description_es": "Torre de hot cakes con frutas frescas y miel de maple", "description_en": "Stack of pancakes with fresh fruits and maple syrup",
             "price": 135, "sort_order": 4, "tags": ["vegetarian"], "image": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400"},
            # Lunch
            {"category": "lunch", "name_es": "Tacos de Pescado", "name_en": "Fish Tacos",
             "description_es": "Tacos de pescado fresco con pico de gallo y chipotle", "description_en": "Fresh fish tacos with pico de gallo and chipotle",
             "price": 185, "is_featured": True, "sort_order": 1, "tags": ["popular", "specialty"], "image": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400"},
            {"category": "lunch", "name_es": "Aguachile Maizul", "name_en": "Maizul Aguachile",
             "description_es": "Camarón fresco en jugo de limón con pepino y chile serrano", "description_en": "Fresh shrimp in lime juice with cucumber and serrano pepper",
             "price": 225, "is_featured": True, "sort_order": 2, "tags": ["popular", "specialty"], "image": "https://images.unsplash.com/photo-1681394421550-83cc9341b9f8?w=400"},
            {"category": "lunch", "name_es": "Bowl de Pollo Mediterráneo", "name_en": "Mediterranean Chicken Bowl",
             "description_es": "Pollo a las hierbas con quinoa, verduras y hummus", "description_en": "Herb chicken with quinoa, vegetables and hummus",
             "price": 195, "sort_order": 3, "tags": [], "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"},
            {"category": "lunch", "name_es": "Ensalada Tropical", "name_en": "Tropical Salad",
             "description_es": "Mix de lechugas, mango, aguacate y vinagreta de limón", "description_en": "Mixed greens, mango, avocado and lime vinaigrette",
             "price": 155, "sort_order": 4, "tags": ["vegetarian"], "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400"},
            # Dinner
            {"category": "dinner", "name_es": "Rib Eye al Carbón", "name_en": "Charcoal Rib Eye",
             "description_es": "Corte premium de 400g con guarnición", "description_en": "Premium 400g cut with sides",
             "price": 485, "is_featured": True, "sort_order": 1, "tags": ["specialty"], "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=400"},
            {"category": "dinner", "name_es": "Pulpo a las Brasas", "name_en": "Grilled Octopus",
             "description_es": "Pulpo perfectamente asado con papas y chimichurri", "description_en": "Perfectly grilled octopus with potatoes and chimichurri",
             "price": 395, "is_featured": True, "sort_order": 2, "tags": ["specialty"], "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400"},
            {"category": "dinner", "name_es": "Salmón Glaseado", "name_en": "Glazed Salmon",
             "description_es": "Salmón con glaseado de miel y soya, vegetales al vapor", "description_en": "Salmon with honey soy glaze, steamed vegetables",
             "price": 345, "sort_order": 3, "tags": [], "image": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400"},
            {"category": "dinner", "name_es": "Pasta Mariscos", "name_en": "Seafood Pasta",
             "description_es": "Linguini con camarones, pulpo y mejillones en salsa blanca", "description_en": "Linguini with shrimp, octopus and mussels in white sauce",
             "price": 295, "sort_order": 4, "tags": ["popular"], "image": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400"},
        ]
        
        for item_data in sample_items:
            item = MenuItem(**item_data)
            await db.menu_items.insert_one(item.model_dump())
    
    return {"message": "Database seeded successfully", "admin_username": "admin", "admin_password": "Damian.01"}

# ================== HEALTH CHECK ==================

@app.get("/")
async def root():
    return {"status": "ok", "app": "Maizul Restaurant API", "version": "1.0"}

@api_router.get("/health")
async def health_check():
    db_status = "connected"
    try:
        if client:
            await client.admin.command('ping')
        else:
            db_status = "not_initialized"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy", 
        "database": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    try:
        await init_db()
        # Auto-seed on startup
        existing_admin = await db.users.find_one({"role": "admin"})
        if not existing_admin:
            logger.info("No admin found, seeding database...")
            await seed_database()
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        logger.warning("Server starting without database - /api/seed will initialize when DB is available")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
