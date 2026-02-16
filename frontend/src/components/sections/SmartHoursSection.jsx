import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, Utensils, Moon, Clock, ChevronRight } from 'lucide-react';
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

const mealData = {
  breakfast: {
    icon: Coffee,
    gradient: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-50',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80',
    dishes: [
      { es: 'Chilaquiles Verdes', en: 'Green Chilaquiles' },
      { es: 'Huevos Rancheros', en: 'Ranch-Style Eggs' },
      { es: 'Hot Cakes con Frutas', en: 'Pancakes with Fruits' },
    ],
  },
  lunch: {
    icon: Utensils,
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&q=80',
    dishes: [
      { es: 'Tacos de Pescado', en: 'Fish Tacos' },
      { es: 'Aguachile Maizul', en: 'Maizul Aguachile' },
      { es: 'Ensalada Tropical', en: 'Tropical Salad' },
    ],
  },
  dinner: {
    icon: Moon,
    gradient: 'from-indigo-500 to-purple-600',
    bgGradient: 'from-indigo-50 to-purple-50',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
    dishes: [
      { es: 'Rib Eye al Carbón', en: 'Charcoal Rib Eye' },
      { es: 'Pulpo a las Brasas', en: 'Grilled Octopus' },
      { es: 'Pasta Mariscos', en: 'Seafood Pasta' },
    ],
  },
};

export const SmartHoursSection = () => {
  const { language, t } = useLanguage();
  const [currentPeriod, setCurrentPeriod] = useState(getMealPeriod());
  const [hoveredMeal, setHoveredMeal] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPeriod(getMealPeriod());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const meals = ['breakfast', 'lunch', 'dinner'];
  const isClosed = currentPeriod === 'closed';

  return (
    <section className="section-padding bg-[#FDFCF8] overflow-hidden" data-testid="smart-hours-section">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            {t('hours.title')}
          </h2>
          
          {/* Current Status */}
          {!isClosed && (
            <motion.div
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${mealData[currentPeriod].gradient} text-white shadow-lg`}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="font-semibold">{t('hours.now')} {t(`hours.${currentPeriod}`)}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Meal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {meals.map((meal, index) => {
            const data = mealData[meal];
            const Icon = data.icon;
            const isActive = currentPeriod === meal;
            const isHovered = hoveredMeal === meal;
            
            return (
              <motion.div
                key={meal}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                onMouseEnter={() => setHoveredMeal(meal)}
                onMouseLeave={() => setHoveredMeal(null)}
              >
                <Link
                  to={`/${language}/menu?category=${meal}`}
                  className={`block relative rounded-3xl overflow-hidden transition-all duration-500 ${
                    isActive ? 'ring-4 ring-[#3B56B0] ring-offset-4 shadow-2xl' : 'shadow-lg hover:shadow-2xl'
                  }`}
                  data-testid={`meal-button-${meal}`}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <motion.img
                      src={data.image}
                      alt={t(`hours.${meal}`)}
                      className="w-full h-full object-cover"
                      animate={{ scale: isHovered ? 1.1 : 1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${data.gradient} opacity-60`} />
                    
                    {/* Icon */}
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <Icon className={`h-6 w-6 bg-gradient-to-r ${data.gradient} bg-clip-text text-transparent`} style={{ color: 'currentColor' }} />
                    </div>

                    {/* Active Badge */}
                    {isActive && (
                      <motion.div
                        className="absolute top-4 right-4 bg-[#FFEC76] text-[#3B56B0] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        {language === 'es' ? '¡AHORA!' : 'NOW!'}
                      </motion.div>
                    )}

                    {/* Meal Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <h3
                        className="text-2xl font-bold mb-1"
                        style={{ fontFamily: 'Fraunces, serif' }}
                      >
                        {t(`hours.${meal}`)}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {meal === 'breakfast' && '9:00 AM – 12:00 PM'}
                        {meal === 'lunch' && '12:00 PM – 5:00 PM'}
                        {meal === 'dinner' && '5:00 PM – 10:00 PM'}
                      </p>
                    </div>
                  </div>

                  {/* Dishes Preview */}
                  <div className={`p-5 bg-gradient-to-b ${data.bgGradient}`}>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-semibold">
                      {language === 'es' ? 'Prueba nuestros' : 'Try our'}
                    </p>
                    <ul className="space-y-2">
                      {data.dishes.map((dish, i) => (
                        <motion.li
                          key={i}
                          className="flex items-center gap-2 text-slate-700"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + i * 0.1 }}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${data.gradient}`} />
                          <span className="text-sm font-medium">{language === 'es' ? dish.es : dish.en}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    {/* CTA */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`text-sm font-semibold bg-gradient-to-r ${data.gradient} bg-clip-text text-transparent`}>
                        {language === 'es' ? 'Ver menú' : 'View menu'}
                      </span>
                      <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
