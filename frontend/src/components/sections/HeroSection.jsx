import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { IMAGES, WHATSAPP_NUMBER, WHATSAPP_PREFILL_ES, WHATSAPP_PREFILL_EN, GOOGLE_MAPS_LINK } from '../../config/constants';

export const HeroSection = () => {
  const { language, t, tObj } = useLanguage();
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const headlines = tObj('hero.headlines') || [];

  // Rotate headlines every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [headlines.length]);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    language === 'es' ? WHATSAPP_PREFILL_ES : WHATSAPP_PREFILL_EN
  )}`;

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={IMAGES.hero}
          alt="Ocean view at Nuevo Vallarta"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Main Headline */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'Fraunces, serif' }}
            data-testid="hero-headline"
          >
            {headlines[headlineIndex]}
          </h1>

          {/* Subtitle with hours */}
          <p
            className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            data-testid="hero-subtitle"
          >
            {t('hero.subtitle')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary: WhatsApp */}
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base md:text-lg w-full sm:w-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="hero-whatsapp-cta"
            >
              {t('hero.cta_whatsapp')}
            </motion.a>

            {/* Secondary: View Menu */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to={`/${language}/menu`}
                className="btn-secondary bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-[#3B56B0] text-base md:text-lg w-full sm:w-auto inline-block text-center"
                data-testid="hero-menu-cta"
              >
                {t('hero.cta_menu')}
              </Link>
            </motion.div>

            {/* Tertiary: Directions */}
            <motion.a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/90 hover:text-white underline underline-offset-4 font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              data-testid="hero-directions-cta"
            >
              {t('hero.cta_directions')}
            </motion.a>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-8 w-8 text-white/60" />
        </motion.div>
      </div>
    </section>
  );
};
