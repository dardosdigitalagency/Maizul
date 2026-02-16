import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, Utensils, Moon, Clock, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { HOURS_BREAKFAST, HOURS_LUNCH, HOURS_DINNER, IMAGES } from '../../config/constants';

const getMealPeriod = () => {
  const now = new Date();
  const hour = now.getHours();
  
  if (hour >= HOURS_BREAKFAST.start && hour < HOURS_LUNCH.start) {
    return 'breakfast';
  } else if (hour >= HOURS_LUNCH.start && hour < HOURS_DINNER.start) {
    return 'lunch';
  } else if (hour >= HOURS_DINNER.start && hour < HOURS_DINNER.end) {
    return 'dinner';
  }
  return 'closed';
};

const mealData = {
  breakfast: {
    icon: Coffee,
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400',
  },
  lunch: {
    icon: Utensils,
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    image: IMAGES.tacos,
  },
  dinner: {
    icon: Moon,
    color: 'from-indigo-400 to-purple-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
  },
};

export const SmartHoursSection = () => {
  const { language, t } = useLanguage();
  const [currentPeriod, setCurrentPeriod] = useState(getMealPeriod());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPeriod(getMealPeriod());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const meals = ['breakfast', 'lunch', 'dinner'];
  const isClosed = currentPeriod === 'closed';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="section-padding bg-white overflow-hidden" data-testid="smart-hours-section">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-[#3B56B0]/10 text-[#3B56B0] px-4 py-2 rounded-full mb-4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">
              {language === 'es' ? 'Servicio todo el día' : 'All-day service'}
            </span>
          </motion.div>
          
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4"
            style={{ fontFamily: 'Fraunces, serif' }}
            data-testid="smart-hours-title"
          >
            {t('hours.title')}
          </h2>
        </motion.div>

        {/* Current Status */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          {isClosed ? (
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-full">
              <Clock className="h-5 w-5" />
              <span className="font-medium">{t('hours.closed')}</span>
            </div>
          ) : (
            <motion.div
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r ${mealData[currentPeriod].color} text-white shadow-lg`}
              animate={{ 
                boxShadow: ['0 10px 40px rgba(0,0,0,0.1)', '0 10px 60px rgba(0,0,0,0.2)', '0 10px 40px rgba(0,0,0,0.1)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
              data-testid="current-meal-indicator"
            >
              <span className="font-semibold text-lg">{t('hours.now')}</span>
              {React.createElement(mealData[currentPeriod].icon, { className: 'h-6 w-6' })}
              <span className="font-bold text-lg">{t(`hours.${currentPeriod}`)}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Meal Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {meals.map((meal) => {
            const data = mealData[meal];
            const Icon = data.icon;
            const isActive = currentPeriod === meal;
            
            return (
              <motion.div
                key={meal}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Link
                  to={`/${language}/menu?category=${meal}`}
                  className={`group relative block rounded-3xl overflow-hidden transition-all duration-500 ${
                    isActive ? 'ring-4 ring-[#3B56B0] ring-offset-4' : ''
                  }`}
                  data-testid={`meal-button-${meal}`}
                >
                  {/* Image Background */}
                  <div className="relative h-64 md:h-72">
                    <img
                      src={data.image}
                      alt={t(`hours.${meal}`)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent`} />
                    
                    {/* Active Badge */}
                    {isActive && (
                      <motion.div
                        className="absolute top-4 right-4 bg-[#FFEC76] text-[#3B56B0] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                        initial={{ scale: 0, rotate: -12 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', delay: 0.5 }}
                      >
                        {t('hours.now').replace(':', '')} ✨
                      </motion.div>
                    )}

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${data.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      
                      <h3
                        className="text-2xl font-bold mb-1"
                        style={{ fontFamily: 'Fraunces, serif' }}
                      >
                        {t(`hours.${meal}`)}
                      </h3>
                      
                      <p className="text-white/80 text-sm mb-3">
                        {meal === 'breakfast' && (language === 'es' ? '9:00 AM – 12:00 PM' : '9:00 AM – 12:00 PM')}
                        {meal === 'lunch' && (language === 'es' ? '12:00 PM – 5:00 PM' : '12:00 PM – 5:00 PM')}
                        {meal === 'dinner' && (language === 'es' ? '5:00 PM – 10:00 PM' : '5:00 PM – 10:00 PM')}
                      </p>
                      
                      <motion.span 
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#FFEC76]"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                      >
                        {t('hours.view_menu')} {t(`hours.${meal}`)} →
                      </motion.span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
