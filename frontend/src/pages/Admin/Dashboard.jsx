import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu, Users, LogOut, Plus, Edit2, Trash2, Save, X,
  Coffee, Utensils, Moon, GripVertical, Check, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { API_URL, RESTAURANT_NAME, CATEGORIES } from '../../config/constants';

const categoryIcons = {
  breakfast: Coffee,
  lunch: Utensils,
  dinner: Moon,
};

const AdminDashboard = () => {
  const { user, logout, isAuthenticated, loading: authLoading, isAdmin } = useAuth();
  const { t, language } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('menu');
  const [menuItems, setMenuItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  // Form states
  const [menuForm, setMenuForm] = useState({
    category: 'breakfast',
    name_es: '',
    name_en: '',
    description_es: '',
    description_en: '',
    price: '',
    image: '',
    is_featured: false,
    is_available: true,
    sort_order: 0,
    tags: [],
  });
  
  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    role: 'editor',
  });

  // Fetch data
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [menuRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/menu?available_only=false`),
        isAdmin ? axios.get(`${API_URL}/users`) : Promise.resolve({ data: [] }),
      ]);
      setMenuItems(menuRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B56B0]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Menu CRUD handlers
  const handleOpenMenuModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setMenuForm({
        category: item.category,
        name_es: item.name_es,
        name_en: item.name_en,
        description_es: item.description_es,
        description_en: item.description_en,
        price: item.price.toString(),
        image: item.image || '',
        is_featured: item.is_featured,
        is_available: item.is_available,
        sort_order: item.sort_order,
        tags: item.tags || [],
      });
    } else {
      setEditingItem(null);
      setMenuForm({
        category: 'breakfast',
        name_es: '',
        name_en: '',
        description_es: '',
        description_en: '',
        price: '',
        image: '',
        is_featured: false,
        is_available: true,
        sort_order: menuItems.length,
        tags: [],
      });
    }
    setIsMenuModalOpen(true);
  };

  const handleSaveMenuItem = async () => {
    try {
      const data = {
        ...menuForm,
        price: parseFloat(menuForm.price),
        sort_order: parseInt(menuForm.sort_order),
      };

      if (editingItem) {
        await axios.put(`${API_URL}/menu/${editingItem.id}`, data);
        toast.success('Item updated successfully');
      } else {
        await axios.post(`${API_URL}/menu`, data);
        toast.success('Item created successfully');
      }
      
      setIsMenuModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving menu item:', err);
      toast.error('Error saving item');
    }
  };

  const handleDeleteMenuItem = async () => {
    if (!deleteTarget) return;
    
    try {
      await axios.delete(`${API_URL}/menu/${deleteTarget.id}`);
      toast.success('Item deleted successfully');
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      console.error('Error deleting menu item:', err);
      toast.error('Error deleting item');
    }
  };

  // User CRUD handlers
  const handleOpenUserModal = (userData = null) => {
    if (userData) {
      setEditingUser(userData);
      setUserForm({
        username: userData.username,
        password: '',
        role: userData.role,
      });
    } else {
      setEditingUser(null);
      setUserForm({
        username: '',
        password: '',
        role: 'editor',
      });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        const updateData = { role: userForm.role };
        if (userForm.password) updateData.password = userForm.password;
        if (userForm.username !== editingUser.username) updateData.username = userForm.username;
        
        await axios.put(`${API_URL}/users/${editingUser.id}`, updateData);
        toast.success('User updated successfully');
      } else {
        await axios.post(`${API_URL}/users`, userForm);
        toast.success('User created successfully');
      }
      
      setIsUserModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving user:', err);
      toast.error(err.response?.data?.detail || 'Error saving user');
    }
  };

  const handleToggleUserActive = async (userData) => {
    try {
      await axios.put(`${API_URL}/users/${userData.id}`, { is_active: !userData.is_active });
      toast.success(`User ${userData.is_active ? 'deactivated' : 'activated'}`);
      fetchData();
    } catch (err) {
      console.error('Error toggling user:', err);
      toast.error('Error updating user');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    
    try {
      await axios.delete(`${API_URL}/users/${deleteTarget.id}`);
      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(err.response?.data?.detail || 'Error deleting user');
    }
  };

  const toggleTag = (tag) => {
    setMenuForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="admin-dashboard">
      {/* Header */}
      <header className="bg-[#3B56B0] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>
              {RESTAURANT_NAME}
            </h1>
            <span className="text-white/60 text-sm">Admin</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80">
              {user?.username} ({user?.role})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-white hover:bg-white/20"
              data-testid="logout-btn"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('admin.logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="menu" className="flex items-center gap-2" data-testid="tab-menu">
              <Menu className="h-4 w-4" />
              {t('admin.menu_management')}
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="users" className="flex items-center gap-2" data-testid="tab-users">
                <Users className="h-4 w-4" />
                {t('admin.user_management')}
              </TabsTrigger>
            )}
          </TabsList>

          {/* Menu Management Tab */}
          <TabsContent value="menu">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-800" style={{ fontFamily: 'Fraunces, serif' }}>
                {t('admin.menu_management')}
              </h2>
              <Button onClick={() => handleOpenMenuModal()} className="btn-primary" data-testid="add-menu-item-btn">
                <Plus className="h-4 w-4 mr-2" />
                {t('admin.add_item')}
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B56B0] mx-auto" />
              </div>
            ) : (
              <div className="space-y-6">
                {Object.keys(CATEGORIES).map((category) => {
                  const Icon = categoryIcons[category];
                  const categoryItems = menuItems.filter(item => item.category === category);
                  
                  return (
                    <div key={category} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
                        <Icon className="h-5 w-5 text-[#3B56B0]" />
                        <h3 className="font-semibold text-slate-800">
                          {CATEGORIES[category][language]} ({categoryItems.length})
                        </h3>
                      </div>
                      
                      <div className="divide-y divide-slate-100">
                        {categoryItems.length === 0 ? (
                          <p className="px-6 py-4 text-slate-500 text-sm">No items in this category</p>
                        ) : (
                          categoryItems.map((item) => (
                            <div
                              key={item.id}
                              className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                              data-testid={`menu-row-${item.id}`}
                            >
                              <GripVertical className="h-5 w-5 text-slate-300 cursor-grab" />
                              
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name_es}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-slate-800 truncate">
                                    {language === 'es' ? item.name_es : item.name_en}
                                  </span>
                                  {item.is_featured && (
                                    <span className="px-2 py-0.5 bg-[#FFEC76] text-[#3B56B0] text-xs font-medium rounded">
                                      Featured
                                    </span>
                                  )}
                                  {!item.is_available && (
                                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                                      Unavailable
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-500 truncate">
                                  {language === 'es' ? item.description_es : item.description_en}
                                </p>
                              </div>
                              
                              <span className="font-semibold text-[#3B56B0]">
                                ${item.price.toFixed(0)}
                              </span>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenMenuModal(item)}
                                  data-testid={`edit-item-${item.id}`}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => {
                                    setDeleteTarget({ type: 'menu', ...item });
                                    setIsDeleteModalOpen(true);
                                  }}
                                  data-testid={`delete-item-${item.id}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* User Management Tab */}
          {isAdmin && (
            <TabsContent value="users">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-800" style={{ fontFamily: 'Fraunces, serif' }}>
                  {t('admin.user_management')}
                </h2>
                <Button onClick={() => handleOpenUserModal()} className="btn-primary" data-testid="add-user-btn">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('admin.add_user')}
                </Button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {users.map((userData) => (
                    <div
                      key={userData.id}
                      className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                      data-testid={`user-row-${userData.id}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#3B56B0]/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-[#3B56B0]" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{userData.username}</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            userData.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {userData.role}
                          </span>
                          {!userData.is_active && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={userData.is_active}
                          onCheckedChange={() => handleToggleUserActive(userData)}
                          disabled={userData.id === user?.id}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenUserModal(userData)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setDeleteTarget({ type: 'user', ...userData });
                            setIsDeleteModalOpen(true);
                          }}
                          disabled={userData.id === user?.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Menu Item Modal */}
      <Dialog open={isMenuModalOpen} onOpenChange={setIsMenuModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? t('admin.edit_item') : t('admin.add_item')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Category</Label>
                <Select value={menuForm.category} onValueChange={(v) => setMenuForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger data-testid="menu-category-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORIES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>{value.es} / {value.en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Nombre (ES)</Label>
                <Input
                  value={menuForm.name_es}
                  onChange={(e) => setMenuForm(p => ({ ...p, name_es: e.target.value }))}
                  data-testid="menu-name-es"
                />
              </div>
              <div>
                <Label>Name (EN)</Label>
                <Input
                  value={menuForm.name_en}
                  onChange={(e) => setMenuForm(p => ({ ...p, name_en: e.target.value }))}
                  data-testid="menu-name-en"
                />
              </div>
              
              <div>
                <Label>Descripción (ES)</Label>
                <Textarea
                  value={menuForm.description_es}
                  onChange={(e) => setMenuForm(p => ({ ...p, description_es: e.target.value }))}
                  rows={2}
                  data-testid="menu-desc-es"
                />
              </div>
              <div>
                <Label>Description (EN)</Label>
                <Textarea
                  value={menuForm.description_en}
                  onChange={(e) => setMenuForm(p => ({ ...p, description_en: e.target.value }))}
                  rows={2}
                  data-testid="menu-desc-en"
                />
              </div>
              
              <div>
                <Label>Precio (MXN)</Label>
                <Input
                  type="number"
                  value={menuForm.price}
                  onChange={(e) => setMenuForm(p => ({ ...p, price: e.target.value }))}
                  data-testid="menu-price"
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={menuForm.image}
                  onChange={(e) => setMenuForm(p => ({ ...p, image: e.target.value }))}
                  placeholder="https://..."
                  data-testid="menu-image"
                />
              </div>
              
              <div className="col-span-2">
                <Label className="mb-2 block">Tags</Label>
                <div className="flex gap-2 flex-wrap">
                  {['popular', 'vegetarian', 'specialty', 'new'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        menuForm.tags.includes(tag)
                          ? 'bg-[#3B56B0] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={menuForm.is_featured}
                    onCheckedChange={(v) => setMenuForm(p => ({ ...p, is_featured: v }))}
                    data-testid="menu-featured"
                  />
                  <Label>Featured</Label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={menuForm.is_available}
                  onCheckedChange={(v) => setMenuForm(p => ({ ...p, is_available: v }))}
                  data-testid="menu-available"
                />
                <Label>Available</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMenuModalOpen(false)}>
              {t('admin.cancel')}
            </Button>
            <Button onClick={handleSaveMenuItem} className="btn-primary" data-testid="save-menu-item">
              <Save className="h-4 w-4 mr-2" />
              {t('admin.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Modal */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Edit User' : t('admin.add_user')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Username</Label>
              <Input
                value={userForm.username}
                onChange={(e) => setUserForm(p => ({ ...p, username: e.target.value }))}
                data-testid="user-username"
              />
            </div>
            <div>
              <Label>Password {editingUser && '(leave blank to keep current)'}</Label>
              <Input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm(p => ({ ...p, password: e.target.value }))}
                placeholder={editingUser ? '••••••••' : ''}
                data-testid="user-password"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={userForm.role} onValueChange={(v) => setUserForm(p => ({ ...p, role: v }))}>
                <SelectTrigger data-testid="user-role-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t('admin.role_admin')}</SelectItem>
                  <SelectItem value="editor">{t('admin.role_editor')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserModalOpen(false)}>
              {t('admin.cancel')}
            </Button>
            <Button onClick={handleSaveUser} className="btn-primary" data-testid="save-user">
              <Save className="h-4 w-4 mr-2" />
              {t('admin.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              {t('admin.confirm_delete')}
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              {t('admin.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={deleteTarget?.type === 'menu' ? handleDeleteMenuItem : handleDeleteUser}
              data-testid="confirm-delete"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('admin.delete_item')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
