import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { HeroSection } from '../components/sections/HeroSection';
import { WhyMaizulSection } from '../components/sections/WhyMaizulSection';
import { SmartHoursSection } from '../components/sections/SmartHoursSection';
import { InstagramSection } from '../components/sections/InstagramSection';
import { LocationSection } from '../components/sections/LocationSection';
import { FAQSection } from '../components/sections/FAQSection';
import { RESTAURANT_NAME, ADDRESS, IMAGES } from '../config/constants';

const Home = () => {
  const { lang } = useParams();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  // Sync URL language with context
  useEffect(() => {
    if (lang && (lang === 'es' || lang === 'en') && lang !== language) {
      setLanguage(lang);
    } else if (!lang) {
      navigate(`/${language}`, { replace: true });
    }
  }, [lang, language, setLanguage, navigate]);

  // SEO content
  const seoTitle = language === 'es'
    ? 'Maizul | Restaurante en Nuevo Vallarta | Desayunos, Comida y Cena'
    : 'Maizul | Restaurant in Nuevo Vallarta | Breakfast, Lunch & Dinner';
  
  const seoDescription = language === 'es'
    ? 'Maizul es el mejor restaurante familiar en Nuevo Vallarta. Disfruta desayunos, comidas y cenas con vista al mar. Cocina mexicana con vibra de playa. Reserva por WhatsApp.'
    : 'Maizul is the best family restaurant in Nuevo Vallarta. Enjoy breakfast, lunch & dinner with ocean views. Mexican cuisine with beach vibes. Book via WhatsApp.';

  // Schema.org structured data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: RESTAURANT_NAME,
    image: IMAGES.hero,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'C. 16 de Septiembre 42',
      addressLocality: 'Nuevo Vallarta',
      addressRegion: 'Nayarit',
      postalCode: '63732',
      addressCountry: 'MX',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 20.7035,
      longitude: -105.2944,
    },
    url: window.location.origin,
    telephone: '+52-322-139-3087',
    servesCuisine: ['Mexican', 'Seafood', 'International'],
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '22:00',
      },
    ],
    menu: `${window.location.origin}/${language}/menu`,
    acceptsReservations: true,
    hasMenu: {
      '@type': 'Menu',
      hasMenuSection: [
        { '@type': 'MenuSection', name: 'Breakfast' },
        { '@type': 'MenuSection', name: 'Lunch' },
        { '@type': 'MenuSection', name: 'Dinner' },
      ],
    },
  };

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content="restaurante Nuevo Vallarta, desayunos Nuevo Vallarta, comida Nuevo Vallarta, cena Nuevo Vallarta, restaurant Nuevo Vallarta, breakfast Nuevo Vallarta, lunch Nuevo Vallarta, dinner Nuevo Vallarta, family restaurant Nuevo Vallarta, Maizul" />
        
        {/* Open Graph */}
        <meta property="og:type" content="restaurant" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={IMAGES.hero} />
        <meta property="og:url" content={`${window.location.origin}/${language}`} />
        <meta property="og:locale" content={language === 'es' ? 'es_MX' : 'en_US'} />
        <meta property="og:site_name" content={RESTAURANT_NAME} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={IMAGES.hero} />
        
        {/* Canonical */}
        <link rel="canonical" href={`${window.location.origin}/${language}`} />
        <link rel="alternate" hrefLang="es" href={`${window.location.origin}/es`} />
        <link rel="alternate" hrefLang="en" href={`${window.location.origin}/en`} />
        
        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-[#FDFCF8]" data-testid="home-page">
        <Header />
        
        <main>
          <HeroSection />
          <WhyMaizulSection />
          <SmartHoursSection />
          <InstagramSection />
          <LocationSection />
          <FAQSection />
        </main>

        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Home;
