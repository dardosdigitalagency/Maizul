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
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section className="section-padding bg-[#FDFCF8]" data-testid="why-maizul-section">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#3B56B0] mb-12 md:mb-16"
          style={{ fontFamily: 'Fraunces, serif' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          data-testid="why-maizul-title"
        >
          {why.title}
        </motion.h2>

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
                className="card-maizul group cursor-default"
                variants={cardVariants}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
                data-testid={`why-card-${index}`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-[#FFEC76]/30 flex items-center justify-center mb-4 group-hover:bg-[#FFEC76]/50 transition-colors">
                    <IconComponent className="h-7 w-7 text-[#3B56B0]" />
                  </div>
                  <h3
                    className="text-lg font-semibold text-slate-800 mb-2"
                    style={{ fontFamily: 'Fraunces, serif' }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
