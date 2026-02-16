import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { WHATSAPP_NUMBER, WHATSAPP_PREFILL_ES, WHATSAPP_PREFILL_EN } from '../config/constants';

export const WhatsAppButton = ({ variant = 'floating' }) => {
  const { language, t } = useLanguage();

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    language === 'es' ? WHATSAPP_PREFILL_ES : WHATSAPP_PREFILL_EN
  )}`;

  if (variant === 'sticky') {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 md:hidden"
        data-testid="sticky-whatsapp-bar"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full flex items-center justify-center gap-2 text-base"
          data-testid="sticky-whatsapp-cta"
        >
          <MessageCircle className="h-5 w-5" />
          {t('menu_page.whatsapp_cta')}
        </a>
      </div>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 whatsapp-pulse"
      data-testid="floating-whatsapp-button"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
};
