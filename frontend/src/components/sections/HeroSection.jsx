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
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background Image with Parallax Effect */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <img
          src={IMAGES.hero}
          alt="Ocean view at Nuevo Vallarta"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </motion.div>

      {/* Animated Decorative Elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-[#FFEC76]/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-40 right-20 w-48 h-48 bg-[#3B56B0]/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          y: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center text-white pt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Animated Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-5 py-2 rounded-full mb-8 border border-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <span className="w-2 h-2 bg-[#FFEC76] rounded-full animate-pulse" />
            <span className="text-sm font-medium">Nuevo Vallarta, México</span>
          </motion.div>

          {/* Main Headline with Animation */}
          <motion.h1
            key={headlineIndex}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'Fraunces, serif' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            data-testid="hero-headline"
          >
            {headlines[headlineIndex]}
          </motion.h1>

          {/* Subtitle with hours */}
          <motion.p
            className="text-base sm:text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            data-testid="hero-subtitle"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {/* Primary: WhatsApp */}
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base md:text-lg w-full sm:w-auto shadow-lg shadow-[#FFEC76]/30"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255,236,118,0.4)' }}
              whileTap={{ scale: 0.95 }}
              data-testid="hero-whatsapp-cta"
            >
              {t('hero.cta_whatsapp')}
            </motion.a>

            {/* Secondary: View Menu */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={`/${language}/menu`}
                className="btn-secondary bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-[#3B56B0] text-base md:text-lg w-full sm:w-auto inline-block text-center shadow-lg"
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
              whileHover={{ scale: 1.05, y: -2 }}
              data-testid="hero-directions-cta"
            >
              {t('hero.cta_directions')}
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
