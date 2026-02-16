import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Navigation, Clock, Phone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ADDRESS, GOOGLE_MAPS_LINK, WHATSAPP_NUMBER } from '../../config/constants';

export const LocationSection = () => {
  const { t, language } = useLanguage();

  // Google Maps embed URL for the location
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.8776!2d-105.2944!3d20.7035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x84214462b97a0001%3A0x0!2sC.%2016%20de%20Septiembre%2042%2C%20Nuevo%20Vallarta!5e0!3m2!1sen!2smx!4v1700000000000!5m2!1sen!2smx";

  return (
    <section
      id="location"
      className="section-padding bg-white overflow-hidden"
      data-testid="location-section"
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
            className="inline-flex items-center gap-2 bg-[#3B56B0]/10 text-[#3B56B0] px-5 py-2.5 rounded-full mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <MapPin className="h-5 w-5" />
            <span className="font-semibold">Nuevo Vallarta, México</span>
          </motion.div>
          
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4"
            style={{ fontFamily: 'Fraunces, serif' }}
            data-testid="location-title"
          >
            {t('location.title')}
          </h2>
          
          <motion.p 
            className="text-slate-600 max-w-xl mx-auto flex items-center justify-center gap-2 text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Navigation className="h-5 w-5 text-[#3B56B0]" />
            {t('location.subtitle')}
          </motion.p>
        </motion.div>

        {/* Map and Info Container */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Map */}
          <motion.div 
            className="lg:col-span-2 rounded-3xl overflow-hidden shadow-2xl h-[350px] md:h-[450px] relative group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Maizul Restaurant Location"
              data-testid="google-map-embed"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#3B56B0]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          {/* Info Card */}
          <motion.div 
            className="bg-gradient-to-br from-[#3B56B0] to-[#2A4090] rounded-3xl p-8 text-white flex flex-col justify-between shadow-2xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <motion.h3
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: 'Fraunces, serif' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                Maizul Restaurant
              </motion.h3>
              
              <div className="space-y-5">
                <motion.div 
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white/90">{ADDRESS}</p>
                    <p className="text-sm text-white/60 mt-1">{t('location.subtitle')}</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white/90">
                      {language === 'es' ? 'Horario' : 'Hours'}
                    </p>
                    <p className="text-sm text-white/60 mt-1">9:00 AM – 10:00 PM</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white/90">WhatsApp</p>
                    <p className="text-sm text-white/60 mt-1">+52 322 139 3087</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* CTA Button */}
            <motion.a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 bg-[#FFEC76] text-[#3B56B0] rounded-full py-4 px-6 font-semibold flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.95 }}
              data-testid="open-maps-cta"
            >
              {t('location.open_maps')}
              <ExternalLink className="h-5 w-5" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
