import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Flame, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const featuredDishes = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
    name_es: 'Chilaquiles Verdes',
    name_en: 'Green Chilaquiles',
    description_es: 'Crujientes totopos bañados en salsa verde casera, crema fresca, queso y huevo estrellado',
    description_en: 'Crispy tortilla chips bathed in homemade green salsa, fresh cream, cheese and sunny-side egg',
    price: 145,
    tag: 'popular',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80',
    name_es: 'Tacos de Pescado',
    name_en: 'Fish Tacos',
    description_es: 'Pescado fresco del día, col morada, pico de gallo y nuestra salsa chipotle secreta',
    description_en: 'Fresh catch of the day, purple cabbage, pico de gallo and our secret chipotle sauce',
    price: 185,
    tag: 'specialty',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800&q=80',
    name_es: 'Aguachile Maizul',
    name_en: 'Maizul Aguachile',
    description_es: 'Camarón fresco marinado en limón, pepino, chile serrano y cilantro. ¡Explosión de frescura!',
    description_en: 'Fresh shrimp marinated in lime, cucumber, serrano pepper and cilantro. A burst of freshness!',
    price: 225,
    tag: 'signature',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    name_es: 'Rib Eye al Carbón',
    name_en: 'Charcoal Rib Eye',
    description_es: 'Corte premium de 400g sellado a la perfección, acompañado de vegetales asados',
    description_en: 'Premium 400g cut seared to perfection, served with roasted vegetables',
    price: 485,
    tag: 'premium',
  },
];

export const FeaturedDishesSection = () => {
  const { language } = useLanguage();

  const content = {
    es: {
      badge: '¡Para antojarse!',
      title: 'Nuestros Platillos Estrella',
      subtitle: 'Los favoritos de nuestros clientes, preparados con ingredientes frescos del día',
      cta: 'Ver menú completo',
      tags: {
        popular: 'Más pedido',
        specialty: 'Especialidad',
        signature: 'Firma del chef',
        premium: 'Premium',
      },
    },
    en: {
      badge: 'Crave-worthy!',
      title: 'Our Star Dishes',
      subtitle: 'Customer favorites, prepared with fresh ingredients daily',
      cta: 'View full menu',
      tags: {
        popular: 'Most ordered',
        specialty: 'Specialty',
        signature: 'Chef\'s signature',
        premium: 'Premium',
      },
    },
  };

  const t = content[language];

  return (
    <section className="section-padding bg-white overflow-hidden" data-testid="featured-dishes-section">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2 rounded-full mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <Flame className="h-5 w-5" />
            <span className="font-semibold">{t.badge}</span>
          </motion.div>

          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            {t.title}
          </h2>

          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Featured Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Large Featured Item */}
          <motion.div
            className="md:col-span-2 lg:col-span-2 lg:row-span-2 group relative rounded-3xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-[400px] lg:h-full min-h-[500px]">
              <img
                src={featuredDishes[0].image}
                alt={language === 'es' ? featuredDishes[0].name_es : featuredDishes[0].name_en}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Tag */}
              <div className="absolute top-6 left-6">
                <span className="inline-flex items-center gap-1.5 bg-[#FFEC76] text-[#3B56B0] px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                  <Star className="h-4 w-4 fill-current" />
                  {t.tags[featuredDishes[0].tag]}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3
                  className="text-3xl md:text-4xl font-bold text-white mb-3"
                  style={{ fontFamily: 'Fraunces, serif' }}
                >
                  {language === 'es' ? featuredDishes[0].name_es : featuredDishes[0].name_en}
                </h3>
                <p className="text-white/80 text-lg mb-4 max-w-lg">
                  {language === 'es' ? featuredDishes[0].description_es : featuredDishes[0].description_en}
                </p>
                <span className="text-3xl font-bold text-[#FFEC76]">
                  ${featuredDishes[0].price}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Smaller Items */}
          {featuredDishes.slice(1).map((dish, index) => (
            <motion.div
              key={dish.id}
              className="group relative rounded-3xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <div className="relative h-[280px]">
                <img
                  src={dish.image}
                  alt={language === 'es' ? dish.name_es : dish.name_en}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-medium text-xs shadow-lg ${
                    dish.tag === 'premium' 
                      ? 'bg-amber-500 text-white' 
                      : dish.tag === 'signature'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/90 text-slate-800'
                  }`}>
                    {dish.tag === 'premium' && <Star className="h-3 w-3 fill-current" />}
                    {t.tags[dish.tag]}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3
                    className="text-xl font-bold text-white mb-1"
                    style={{ fontFamily: 'Fraunces, serif' }}
                  >
                    {language === 'es' ? dish.name_es : dish.name_en}
                  </h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">
                    {language === 'es' ? dish.description_es : dish.description_en}
                  </p>
                  <span className="text-2xl font-bold text-[#FFEC76]">
                    ${dish.price}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to={`/${language}/menu`}
            className="inline-flex items-center gap-3 btn-primary text-lg group"
          >
            {t.cta}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
