import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
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
      setIsScrolled(window.scrollY > 20);
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
    // Update URL to reflect language
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
      // If not on home page, go to home first
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-header shadow-sm' : 'bg-transparent'
      }`}
      data-testid="main-header"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to={`/${language}`}
            className="flex items-center space-x-2"
            data-testid="logo-link"
          >
            <span className="text-2xl md:text-3xl font-bold text-[#3B56B0]" style={{ fontFamily: 'Fraunces, serif' }}>
              {RESTAURANT_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.isAnchor ? `/${language}` : link.href}
                onClick={(e) => handleNavClick(link, e)}
                className="text-slate-700 hover:text-[#3B56B0] font-medium transition-colors"
                data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Language + WhatsApp CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1"
                  data-testid="language-selector"
                >
                  <Globe className="h-4 w-4" />
                  <span className="uppercase font-medium">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2 px-6"
              data-testid="header-whatsapp-cta"
            >
              {t('hero.cta_whatsapp')}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile Language */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" data-testid="mobile-language-selector">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
              data-testid="mobile-menu-button"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-4" data-testid="mobile-menu">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.isAnchor ? `/${language}` : link.href}
                  onClick={(e) => handleNavClick(link, e)}
                  className="text-slate-700 hover:text-[#3B56B0] font-medium px-4 py-2"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-center mx-4"
                data-testid="mobile-whatsapp-cta"
              >
                {t('hero.cta_whatsapp')}
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
