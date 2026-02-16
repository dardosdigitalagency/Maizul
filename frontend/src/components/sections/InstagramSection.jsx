import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { INSTAGRAM_URL, IMAGES } from '../../config/constants';

// Placeholder Instagram posts (since we can't use the real API without auth)
const placeholderPosts = [
  { id: 1, image: IMAGES.tacos, alt: 'Gourmet tacos' },
  { id: 2, image: IMAGES.seafood, alt: 'Fresh seafood' },
  { id: 3, image: IMAGES.cocktail, alt: 'Tropical cocktail' },
  { id: 4, image: IMAGES.family, alt: 'Restaurant atmosphere' },
  { id: 5, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', alt: 'Delicious food' },
  { id: 6, image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400', alt: 'Mexican cuisine' },
];

export const InstagramSection = () => {
  const { t } = useLanguage();

  return (
    <section
      id="instagram"
      className="section-padding bg-[#FDFCF8]"
      data-testid="instagram-section"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-4 py-2 rounded-full mb-4">
            <Instagram className="h-5 w-5" />
            <span className="font-medium text-sm">@maizul.restaurant</span>
          </div>
          
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-3"
            style={{ fontFamily: 'Fraunces, serif' }}
            data-testid="instagram-title"
          >
            {t('instagram.title')}
          </h2>
          
          <p className="text-slate-600 max-w-xl mx-auto">
            {t('instagram.subtitle')}
          </p>
        </motion.div>

        {/* Instagram Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {placeholderPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square overflow-hidden rounded-xl md:rounded-2xl group"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              data-testid={`instagram-post-${index}`}
            >
              <img
                src={post.image}
                alt={post.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="h-8 w-8 text-white" />
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-8 md:mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-secondary"
            data-testid="instagram-cta"
          >
            {t('instagram.cta')}
            <ExternalLink className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
