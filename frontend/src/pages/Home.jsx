import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { HeroSection } from '../components/sections/HeroSection';
import { WhyMaizulSection } from '../components/sections/WhyMaizulSection';
import { StorySection } from '../components/sections/StorySection';
import { SmartHoursSection } from '../components/sections/SmartHoursSection';
import { InstagramSection } from '../components/sections/InstagramSection';
import { LocationSection } from '../components/sections/LocationSection';
import { FAQSection } from '../components/sections/FAQSection';

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

  // Update document metadata via useEffect
  useEffect(() => {
    document.title = seoTitle;
    document.documentElement.lang = language;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', seoDescription);
    }
    
    // Update OG tags
    const updateMeta = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      }
    };
    
    updateMeta('og:title', seoTitle);
    updateMeta('og:description', seoDescription);
    updateMeta('og:url', `${window.location.origin}/${language}`);
    updateMeta('og:locale', language === 'es' ? 'es_MX' : 'en_US');
    
  }, [language, seoTitle, seoDescription]);

  return (
    <div className="min-h-screen bg-[#FDFCF8]" data-testid="home-page">
      <Header />
      
      <main>
        <HeroSection />
        <WhyMaizulSection />
        <StorySection />
        <SmartHoursSection />
        <InstagramSection />
        <LocationSection />
        <FAQSection />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Home;
