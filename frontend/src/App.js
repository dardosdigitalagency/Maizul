import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from './components/ui/sonner';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { DEFAULT_LANGUAGE } from './config/constants';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';

// Language redirect component
const LanguageRedirect = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  useEffect(() => {
    navigate(`/${language}`, { replace: true });
  }, [language, navigate]);
  
  return null;
};

// App component wrapped with providers
function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect to default language */}
        <Route path="/" element={<LanguageRedirect />} />
        
        {/* Language-specific routes */}
        <Route path="/:lang" element={<Home />} />
        <Route path="/:lang/menu" element={<Menu />} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to={`/${DEFAULT_LANGUAGE}`} replace />} />
      </Routes>
      
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
