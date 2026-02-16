import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink, Heart } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { INSTAGRAM_URL, IMAGES } from '../../config/constants';

// Placeholder Instagram posts
const placeholderPosts = [
  { id: 1, image: IMAGES.tacos, alt: 'Gourmet tacos', likes: '2.4k' },
  { id: 2, image: IMAGES.seafood, alt: 'Fresh seafood', likes: '1.8k' },
  { id: 3, image: IMAGES.cocktail, alt: 'Tropical cocktail', likes: '3.1k' },
  { id: 4, image: IMAGES.family, alt: 'Restaurant atmosphere', likes: '2.9k' },
  { id: 5, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', alt: 'Delicious food', likes: '1.5k' },
  { id: 6, image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400', alt: 'Mexican cuisine', likes: '2.2k' },
];

export const InstagramSection = () => {
  const { t, language } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { type: 'spring', stiffness: 200 },
    },
  };

  return (
    <section
      id="instagram"
      className="section-padding bg-gradient-to-b from-[#FDFCF8] to-white overflow-hidden"
      data-testid="instagram-section"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-5 py-2.5 rounded-full mb-6 shadow-lg"
            whileHover={{ scale: 1.05 }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <Instagram className="h-5 w-5" />
            <span className="font-semibold">@maizul.restaurant</span>
          </motion.div>
          
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4"
            style={{ fontFamily: 'Fraunces, serif' }}
            data-testid="instagram-title"
          >
            {t('instagram.title')}
          </h2>
          
          <p className="text-slate-600 max-w-xl mx-auto text-lg">
            {t('instagram.subtitle')}
          </p>
        </motion.div>

        {/* Instagram Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {placeholderPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square overflow-hidden rounded-2xl md:rounded-3xl group shadow-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.03, rotate: 1, zIndex: 10 }}
              data-testid={`instagram-post-${index}`}
            >
              <img
                src={post.image}
                alt={post.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Hover overlay */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  className="flex items-center gap-2 text-white mb-2"
                >
                  <Heart className="h-6 w-6 fill-red-500 text-red-500" />
                  <span className="font-semibold">{post.likes}</span>
                </motion.div>
                <Instagram className="h-8 w-8 text-white" />
              </motion.div>

              {/* Corner badge */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <ExternalLink className="h-4 w-4 text-slate-700" />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 btn-secondary text-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            data-testid="instagram-cta"
          >
            {t('instagram.cta')}
            <ExternalLink className="h-5 w-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
