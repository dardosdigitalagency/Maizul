import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ADDRESS, GOOGLE_MAPS_LINK } from '../../config/constants';

export const LocationSection = () => {
  const { t } = useLanguage();

  // Google Maps embed URL for the location
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.8776!2d-105.2944!3d20.7035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x84214462b97a0001%3A0x0!2sC.%2016%20de%20Septiembre%2042%2C%20Nuevo%20Vallarta!5e0!3m2!1sen!2smx!4v1700000000000!5m2!1sen!2smx";

  return (
    <section
      id="location"
      className="section-padding bg-white"
      data-testid="location-section"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-[#3B56B0]/10 text-[#3B56B0] px-4 py-2 rounded-full mb-4">
            <MapPin className="h-5 w-5" />
            <span className="font-medium text-sm">Nuevo Vallarta, México</span>
          </div>
          
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-3"
            style={{ fontFamily: 'Fraunces, serif' }}
            data-testid="location-title"
          >
            {t('location.title')}
          </h2>
          
          <p className="text-slate-600 max-w-xl mx-auto flex items-center justify-center gap-2">
            <Navigation className="h-4 w-4" />
            {t('location.subtitle')}
          </p>
        </motion.div>

        {/* Map and Info Container */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {/* Map */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-lg h-[300px] md:h-[400px]">
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
          </div>

          {/* Info Card */}
          <div className="card-maizul flex flex-col justify-between">
            <div>
              <h3
                className="text-xl font-semibold text-slate-800 mb-4"
                style={{ fontFamily: 'Fraunces, serif' }}
              >
                Maizul Restaurant
              </h3>
              
              <div className="space-y-4 text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#3B56B0] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-800">
                      {t('location.address')}
                    </p>
                    <p className="text-sm mt-1">
                      {t('location.subtitle')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6 flex items-center justify-center gap-2"
              data-testid="open-maps-cta"
            >
              {t('location.open_maps')}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
