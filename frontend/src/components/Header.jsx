import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { RESTAURANT_NAME, WHATSAPP_NUMBER, WHATSAPP_PREFILL_ES, WHATSAPP_PREFILL_EN } from '../config/constants';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    language === 'es' ? WHATSAPP_PREFILL_ES : WHATSAPP_PREFILL_EN
  )}`;

  const navLinks = [
    { href: `/${language}`, label: t('nav.home') },
    { href: `/${language}/menu`, label: t('nav.menu') },
    { href: '#instagram', label: t('nav.instagram'), isAnchor: true },
    { href: '#location', label: t('nav.location'), isAnchor: true },
  ];

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    const currentPath = location.pathname;
    let newPath = currentPath;
    
    if (currentPath.startsWith('/es')) {
      newPath = currentPath.replace('/es', `/${lang}`);
    } else if (currentPath.startsWith('/en')) {
      newPath = currentPath.replace('/en', `/${lang}`);
    } else if (currentPath === '/' || currentPath === '') {
      newPath = `/${lang}`;
    } else {
      newPath = `/${lang}${currentPath}`;
    }
    
    navigate(newPath);
  };

  const handleNavClick = (link, e) => {
    if (link.isAnchor) {
      e.preventDefault();
      if (!location.pathname.includes('/menu') && !location.pathname.includes('/admin')) {
        const element = document.querySelector(link.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(`/${language}${link.href}`);
      }
    }
    setIsMobileMenuOpen(false);
  };

  // Determine if we're on a page with hero (transparent header needed)
  const isHeroPage = location.pathname === `/${language}` || 
                     location.pathname === '/es' || 
                     location.pathname === '/en' || 
                     location.pathname === '/' ||
                     location.pathname === `/${language}/`;
  const showTransparent = isHeroPage && !isScrolled;

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showTransparent 
          ? 'bg-transparent' 
          : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      data-testid="main-header"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-18 md:h-22 py-4">
          {/* Logo */}
          <Link
            to={`/${language}`}
            className="flex items-center space-x-2 group"
            data-testid="logo-link"
          >
            <motion.span 
              className={`text-2xl md:text-3xl font-bold transition-colors duration-300 ${
                showTransparent ? 'text-white drop-shadow-lg' : 'text-[#3B56B0]'
              }`}
              style={{ fontFamily: 'Fraunces, serif' }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {RESTAURANT_NAME}
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10" data-testid="desktop-nav">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Link
                  to={link.isAnchor ? `/${language}` : link.href}
                  onClick={(e) => handleNavClick(link, e)}
                  className={`font-medium transition-all duration-300 hover:scale-105 inline-block ${
                    showTransparent 
                      ? 'text-white hover:text-[#FFEC76] drop-shadow-md' 
                      : 'text-slate-700 hover:text-[#3B56B0]'
                  }`}
                  data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right side: Language + WhatsApp CTA */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center space-x-1 transition-colors duration-300 ${
                    showTransparent 
                      ? 'text-white hover:bg-white/20' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  data-testid="language-selector"
                >
                  <Globe className="h-4 w-4" />
                  <span className="uppercase font-medium">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem
                  onClick={() => handleLanguageChange('es')}
                  className={language === 'es' ? 'bg-slate-100' : ''}
                  data-testid="lang-es"
                >
                  🇲🇽 Español
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleLanguageChange('en')}
                  className={language === 'en' ? 'bg-slate-100' : ''}
                  data-testid="lang-en"
                >
                  🇺🇸 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* WhatsApp CTA */}
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2.5 px-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="header-whatsapp-cta"
            >
              {t('hero.cta_whatsapp')}
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Mobile Language */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={showTransparent ? 'text-white' : 'text-slate-700'}
                  data-testid="mobile-language-selector"
                >
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem onClick={() => handleLanguageChange('es')}>
                  🇲🇽 Español
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                  🇺🇸 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={showTransparent ? 'text-white' : 'text-slate-700'}
              data-testid="mobile-menu-button"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden bg-white border-t border-slate-100 py-4 rounded-b-2xl shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              data-testid="mobile-menu"
            >
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.isAnchor ? `/${language}` : link.href}
                      onClick={(e) => handleNavClick(link, e)}
                      className="text-slate-700 hover:text-[#3B56B0] hover:bg-slate-50 font-medium px-4 py-3 rounded-lg block transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-center mx-4 mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  data-testid="mobile-whatsapp-cta"
                >
                  {t('hero.cta_whatsapp')}
                </motion.a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
