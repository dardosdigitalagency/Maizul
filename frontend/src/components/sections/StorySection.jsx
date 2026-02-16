import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Waves, Users, Award } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { IMAGES } from '../../config/constants';

export const StorySection = () => {
  const { language } = useLanguage();

  const content = {
    es: {
      badge: 'Nuestra Historia',
      title: 'Más que un restaurante, una experiencia familiar',
      description: 'Maizul nació del amor por la cocina mexicana y el deseo de compartir los sabores auténticos de nuestra tierra con el mundo. Ubicados en el corazón de Nuevo Vallarta, combinamos las recetas tradicionales de generaciones con la frescura del mar y la calidez de nuestra gente.',
      quote: '"Cada platillo cuenta una historia, cada visita crea un recuerdo."',
      stats: [
        { icon: Heart, value: '2019', label: 'Año de fundación' },
        { icon: Users, value: '10K+', label: 'Familias felices' },
        { icon: Waves, value: '100%', label: 'Vista al mar' },
        { icon: Award, value: '4.8★', label: 'Calificación' },
      ],
    },
    en: {
      badge: 'Our Story',
      title: 'More than a restaurant, a family experience',
      description: 'Maizul was born from a love of Mexican cuisine and the desire to share the authentic flavors of our land with the world. Located in the heart of Nuevo Vallarta, we combine traditional generational recipes with the freshness of the sea and the warmth of our people.',
      quote: '"Every dish tells a story, every visit creates a memory."',
      stats: [
        { icon: Heart, value: '2019', label: 'Year founded' },
        { icon: Users, value: '10K+', label: 'Happy families' },
        { icon: Waves, value: '100%', label: 'Ocean view' },
        { icon: Award, value: '4.8★', label: 'Rating' },
      ],
    },
  };

  const t = content[language];

  return (
    <section className="section-padding bg-[#FDFCF8] overflow-hidden" data-testid="story-section">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <motion.img
                src={IMAGES.family}
                alt="Maizul Restaurant atmosphere"
                className="w-full h-[400px] md:h-[500px] object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3B56B0]/30 to-transparent" />
            </div>

            {/* Floating Card */}
            <motion.div
              className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 bg-white rounded-2xl p-6 shadow-xl max-w-[200px]"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: 'spring' }}
              whileHover={{ y: -5, rotate: 2 }}
            >
              <div className="text-4xl font-bold text-[#3B56B0] mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
                5+
              </div>
              <div className="text-sm text-slate-600">
                {language === 'es' ? 'Años de sabor y tradición' : 'Years of flavor & tradition'}
              </div>
            </motion.div>

            {/* Decorative Element */}
            <motion.div
              className="absolute -top-4 -left-4 w-24 h-24 bg-[#FFEC76] rounded-full opacity-60 blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-[#FFEC76]/30 text-[#3B56B0] px-4 py-2 rounded-full mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              <Heart className="h-4 w-4" />
              <span className="text-sm font-semibold">{t.badge}</span>
            </motion.div>

            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              {t.title}
            </h2>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {t.description}
            </p>

            {/* Quote */}
            <motion.blockquote
              className="border-l-4 border-[#FFEC76] pl-6 py-2 mb-10"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-xl text-[#3B56B0] italic font-medium" style={{ fontFamily: 'Fraunces, serif' }}>
                {t.quote}
              </p>
            </motion.blockquote>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              {t.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 rounded-2xl bg-white shadow-sm border border-slate-100"
                  whileHover={{ y: -5, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <stat.icon className="h-5 w-5 text-[#3B56B0] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Fraunces, serif' }}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
