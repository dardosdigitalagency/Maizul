import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';
import { DEFAULT_LANGUAGE } from '../config/constants';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('maizul_language');
    if (saved && (saved === 'es' || saved === 'en')) {
      return saved;
    }
    
    // Check URL path
    const path = window.location.pathname;
    if (path.startsWith('/en')) return 'en';
    if (path.startsWith('/es')) return 'es';
    
    // Default
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = (lang) => {
    if (lang !== 'es' && lang !== 'en') return;
    setLanguageState(lang);
    localStorage.setItem('maizul_language', lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return value || key;
  };

  // Get nested translation object
  const tObj = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return null;
      }
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tObj }}>
      {children}
    </LanguageContext.Provider>
  );
};
