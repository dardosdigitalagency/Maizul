import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  RESTAURANT_NAME,
  ADDRESS,
  WHATSAPP_NUMBER,
  INSTAGRAM_URL,
  HOURS_FULL,
} from '../config/constants';

export const Footer = () => {
  const { language, t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#3B56B0] text-white" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              {RESTAURANT_NAME}
            </h3>
            <p className="text-white/80 text-sm">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#FFEC76]" />
              {t('footer.hours_title')}
            </h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>
                <span className="font-medium text-white">{language === 'es' ? 'Desayuno' : 'Breakfast'}:</span> 9:00 AM – 12:00 PM
              </li>
              <li>
                <span className="font-medium text-white">{language === 'es' ? 'Comida' : 'Lunch'}:</span> 12:00 PM – 5:00 PM
              </li>
              <li>
                <span className="font-medium text-white">{language === 'es' ? 'Cena' : 'Dinner'}:</span> 5:00 PM – 10:00 PM
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-[#FFEC76]" />
              {t('footer.contact_title')}
            </h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{ADDRESS}</span>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFEC76] transition-colors"
                  data-testid="footer-whatsapp"
                >
                  WhatsApp: +52 322 139 3087
                </a>
              </li>
            </ul>
          </div>

          {/* Social / Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Instagram className="h-5 w-5 text-[#FFEC76]" />
              {t('footer.follow_title')}
            </h4>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/80 hover:text-[#FFEC76] transition-colors text-sm"
              data-testid="footer-instagram"
            >
              <Instagram className="h-5 w-5" />
              @maizul.restaurant
            </a>

            <div className="mt-6 space-y-2">
              <Link
                to={`/${language}/menu`}
                className="block text-white/80 hover:text-[#FFEC76] transition-colors text-sm"
                data-testid="footer-menu-link"
              >
                {t('nav.menu')}
              </Link>
              <Link
                to={`/${language}`}
                className="block text-white/80 hover:text-[#FFEC76] transition-colors text-sm"
              >
                {t('nav.home')}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>© {currentYear} {RESTAURANT_NAME}. {t('footer.rights')}</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="text-xs">
              Restaurante en Nuevo Vallarta | Restaurant in Nuevo Vallarta
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
