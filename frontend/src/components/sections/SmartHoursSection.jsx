import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, Utensils, Moon, Clock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { HOURS_BREAKFAST, HOURS_LUNCH, HOURS_DINNER } from '../../config/constants';

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

const mealIcons = {
  breakfast: Coffee,
  lunch: Utensils,
  dinner: Moon,
};

const mealColors = {
  breakfast: 'bg-amber-100 text-amber-700',
  lunch: 'bg-green-100 text-green-700',
  dinner: 'bg-indigo-100 text-indigo-700',
};

export const SmartHoursSection = () => {
  const { language, t } = useLanguage();
  const [currentPeriod, setCurrentPeriod] = useState(getMealPeriod());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPeriod(getMealPeriod());
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const meals = ['breakfast', 'lunch', 'dinner'];
  const isClosed = currentPeriod === 'closed';

  return (
    <section className="section-padding bg-white" data-testid="smart-hours-section">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4"
          style={{ fontFamily: 'Fraunces, serif' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          data-testid="smart-hours-title"
        >
          {t('hours.title')}
        </motion.h2>

        {/* Current Status */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {isClosed ? (
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-full">
              <Clock className="h-5 w-5" />
              <span className="font-medium">{t('hours.closed')}</span>
            </div>
          ) : (
            <div
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${mealColors[currentPeriod]}`}
              data-testid="current-meal-indicator"
            >
              <span className="font-semibold">{t('hours.now')}</span>
              {React.createElement(mealIcons[currentPeriod], { className: 'h-5 w-5' })}
              <span className="font-medium">{t(`hours.${currentPeriod}`)}</span>
            </div>
          )}
        </motion.div>

        {/* Meal Buttons */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {meals.map((meal) => {
            const Icon = mealIcons[meal];
            const isActive = currentPeriod === meal;
            
            return (
              <Link
                key={meal}
                to={`/${language}/menu?category=${meal}`}
                className={`group relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                  isActive
                    ? 'border-[#3B56B0] bg-[#3B56B0]/5 shadow-md'
                    : 'border-slate-200 hover:border-[#3B56B0]/50 hover:bg-slate-50'
                }`}
                data-testid={`meal-button-${meal}`}
              >
                {isActive && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#FFEC76] text-[#3B56B0] text-xs font-bold px-3 py-1 rounded-full">
                    {t('hours.now').replace(':', '')}
                  </span>
                )}
                
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                  isActive ? 'bg-[#3B56B0] text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-[#3B56B0]/10'
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    isActive ? 'text-[#3B56B0]' : 'text-slate-800'
                  }`}
                  style={{ fontFamily: 'Fraunces, serif' }}
                >
                  {t(`hours.${meal}`)}
                </h3>
                
                <p className="text-sm text-slate-500">
                  {meal === 'breakfast' && (language === 'es' ? '9:00 – 12:00' : '9am – 12pm')}
                  {meal === 'lunch' && (language === 'es' ? '12:00 – 17:00' : '12pm – 5pm')}
                  {meal === 'dinner' && (language === 'es' ? '17:00 – 22:00' : '5pm – 10pm')}
                </p>
                
                <span className="mt-3 text-sm font-medium text-[#3B56B0] opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('hours.view_menu')} →
                </span>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
