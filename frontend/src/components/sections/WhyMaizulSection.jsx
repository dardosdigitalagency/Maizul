import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Users, Palmtree, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const iconMap = {
  sun: Sun,
  users: Users,
  palmtree: Palmtree,
  globe: Globe,
};

const cardColors = [
  'from-amber-400 to-orange-500',
  'from-blue-400 to-indigo-500',
  'from-emerald-400 to-teal-500',
  'from-purple-400 to-pink-500',
];

export const WhyMaizulSection = () => {
  const { tObj } = useLanguage();
  const why = tObj('why') || {};
  const cards = why.cards || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="section-padding bg-[#FDFCF8] overflow-hidden" data-testid="why-maizul-section">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <span className="text-6xl">✨</span>
          </motion.div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3B56B0]"
            style={{ fontFamily: 'Fraunces, serif' }}
            data-testid="why-maizul-title"
          >
            {why.title}
          </h2>
        </motion.div>

        {/* Cards Grid - Bento style */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {cards.map((card, index) => {
            const IconComponent = iconMap[card.icon] || Sun;
            return (
              <motion.div
                key={index}
                className="group cursor-default"
                variants={cardVariants}
                whileHover={{ y: -12, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                data-testid={`why-card-${index}`}
              >
                <div className="card-maizul h-full relative overflow-hidden">
                  {/* Gradient Background on Hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${cardColors[index]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />
                  
                  <div className="relative flex flex-col items-center text-center">
                    {/* Icon Container with Animation */}
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cardColors[index]} flex items-center justify-center mb-5 shadow-lg`}
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </motion.div>
                    
                    <h3
                      className="text-lg font-semibold text-slate-800 mb-3"
                      style={{ fontFamily: 'Fraunces, serif' }}
                    >
                      {card.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
