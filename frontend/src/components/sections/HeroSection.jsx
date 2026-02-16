import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { IMAGES, WHATSAPP_NUMBER, WHATSAPP_PREFILL_ES, WHATSAPP_PREFILL_EN, GOOGLE_MAPS_LINK } from '../../config/constants';

// Imágenes de comida apetitosas
const foodImages = [
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&q=80', // Chilaquiles
  'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=1200&q=80', // Tacos
  'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=1200&q=80', // Aguachile/ceviche
];

export const HeroSection = () => {
  const { language, t, tObj } = useLanguage();
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const headlines = tObj('hero.headlines') || [];

  // Rotate headlines every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length);
      setImageIndex((prev) => (prev + 1) % foodImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [headlines.length]);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    language === 'es' ? WHATSAPP_PREFILL_ES : WHATSAPP_PREFILL_EN
  )}`;

  return (
    <section
      className="relative min-h-[100vh] flex items-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background - Split Design */}
      <div className="absolute inset-0 z-0">
        {/* Left side - Ocean/Ambiance */}
        <div className="absolute inset-0 lg:w-1/2">
          <img
            src={IMAGES.hero}
            alt="Ocean view at Nuevo Vallarta"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/70 lg:to-transparent" />
        </div>
        
        {/* Right side - Food image (visible on large screens) */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2">
          <motion.img
            key={imageIndex}
            src={foodImages[imageIndex]}
            alt="Delicious Mexican food"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black/60" />
        </div>
      </div>

      {/* Floating food preview for mobile */}
      <motion.div
        className="lg:hidden absolute bottom-32 right-4 w-32 h-32 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20"
        initial={{ opacity: 0, scale: 0, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <motion.img
          key={imageIndex}
          src={foodImages[imageIndex]}
          alt="Food preview"
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pt-24 pb-12">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-5 py-2 rounded-full mb-8 border border-white/20"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="w-2 h-2 bg-[#FFEC76] rounded-full animate-pulse" />
              <span className="text-sm font-medium">Nuevo Vallarta, México</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              key={headlineIndex}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white"
              style={{ fontFamily: 'Fraunces, serif' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              data-testid="hero-headline"
            >
              {headlines[headlineIndex]}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-white/90 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              data-testid="hero-subtitle"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-base md:text-lg shadow-lg shadow-[#FFEC76]/30"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255,236,118,0.4)' }}
                whileTap={{ scale: 0.95 }}
                data-testid="hero-whatsapp-cta"
              >
                {t('hero.cta_whatsapp')}
              </motion.a>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={`/${language}/menu`}
                  className="btn-secondary bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-[#3B56B0] text-base md:text-lg inline-block text-center shadow-lg"
                  data-testid="hero-menu-cta"
                >
                  {t('hero.cta_menu')}
                </Link>
              </motion.div>

              <motion.a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-[#FFEC76] underline underline-offset-4 font-medium transition-colors py-3"
                whileHover={{ x: 5 }}
                data-testid="hero-directions-cta"
              >
                {t('hero.cta_directions')} →
              </motion.a>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              className="flex items-center gap-8 mt-12 pt-8 border-t border-white/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FFEC76]" style={{ fontFamily: 'Fraunces, serif' }}>4.8★</div>
                <div className="text-white/60 text-sm">{language === 'es' ? 'Rating' : 'Rating'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Fraunces, serif' }}>9-22h</div>
                <div className="text-white/60 text-sm">{language === 'es' ? 'Abierto' : 'Open'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Fraunces, serif' }}>100%</div>
                <div className="text-white/60 text-sm">{language === 'es' ? 'Vista al mar' : 'Ocean view'}</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
