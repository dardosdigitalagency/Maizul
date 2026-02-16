import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Coffee, Utensils, Moon, Star, Leaf, ChefHat, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { API_URL, RESTAURANT_NAME, IMAGES, CATEGORIES, HOURS_BREAKFAST, HOURS_LUNCH, HOURS_DINNER } from '../config/constants';

const getMealPeriod = () => {
  const hour = new Date().getHours();
  if (hour >= HOURS_BREAKFAST.start && hour < HOURS_LUNCH.start) return 'breakfast';
  if (hour >= HOURS_LUNCH.start && hour < HOURS_DINNER.start) return 'lunch';
  if (hour >= HOURS_DINNER.start && hour < HOURS_DINNER.end) return 'dinner';
  return 'breakfast'; // Default
};

const categoryIcons = {
  breakfast: Coffee,
  lunch: Utensils,
  dinner: Moon,
};

const tagIcons = {
  popular: Star,
  vegetarian: Leaf,
  specialty: ChefHat,
  new: Sparkles,
};

const Menu = () => {
  const { lang } = useParams();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Get initial category from URL or auto-detect
  const initialCategory = searchParams.get('category') || getMealPeriod();
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  // Sync URL language
  useEffect(() => {
    if (lang && (lang === 'es' || lang === 'en') && lang !== language) {
      setLanguage(lang);
    }
  }, [lang, language, setLanguage]);

  // Fetch menu items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/menu`);
        setMenuItems(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [t]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchParams({ category });
  };

  // Filter items
  const filteredItems = useMemo(() => {
    let items = menuItems.filter(item => item.category === activeCategory);
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => {
        const name = language === 'es' ? item.name_es : item.name_en;
        const desc = language === 'es' ? item.description_es : item.description_en;
        return name.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
      });
    }
    
    // Tag filter
    if (activeFilter !== 'all') {
      items = items.filter(item => item.tags && item.tags.includes(activeFilter));
    }
    
    return items.sort((a, b) => a.sort_order - b.sort_order);
  }, [menuItems, activeCategory, searchQuery, activeFilter, language]);

  // SEO content
  const seoTitle = t('menu_page.meta_title');
  const seoDescription = t('menu_page.meta_description');

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={IMAGES.tacos} />
        <meta property="og:url" content={`${window.location.origin}/${language}/menu`} />
        <link rel="canonical" href={`${window.location.origin}/${language}/menu`} />
        <link rel="alternate" hrefLang="es" href={`${window.location.origin}/es/menu`} />
        <link rel="alternate" hrefLang="en" href={`${window.location.origin}/en/menu`} />
      </Helmet>

      <div className="min-h-screen bg-[#FDFCF8]" data-testid="menu-page">
        <Header />
        
        <main className="pt-20 md:pt-24 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Page Header */}
            <motion.div
              className="text-center mb-8 md:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-3"
                style={{ fontFamily: 'Fraunces, serif' }}
                data-testid="menu-title"
              >
                {t('menu_page.title')}
              </h1>
            </motion.div>

            {/* Category Tabs */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
                <TabsList className="w-full justify-center bg-white border border-slate-200 rounded-full p-1 h-auto">
                  {Object.entries(CATEGORIES).map(([key, value]) => {
                    const Icon = categoryIcons[key];
                    return (
                      <TabsTrigger
                        key={key}
                        value={key}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full data-[state=active]:bg-[#3B56B0] data-[state=active]:text-white transition-all"
                        data-testid={`category-tab-${key}`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{value[language]}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder={t('menu_page.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 rounded-full border-slate-200 bg-white"
                  data-testid="menu-search-input"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 sm:pb-0">
                {['all', 'popular', 'vegetarian', 'specialty'].map((filter) => {
                  const Icon = tagIcons[filter];
                  return (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        activeFilter === filter
                          ? 'bg-[#3B56B0] text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-[#3B56B0]/50'
                      }`}
                      data-testid={`filter-${filter}`}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {t(`menu_page.filter_${filter}`)}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Menu Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="card-maizul animate-pulse">
                    <div className="h-48 bg-slate-200 rounded-xl mb-4" />
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-full mb-4" />
                    <div className="h-6 bg-slate-200 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 text-slate-500" data-testid="menu-error">
                <p>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 btn-secondary"
                >
                  {t('common.retry')}
                </button>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12 text-slate-500" data-testid="menu-empty">
                <p>{t('menu_page.no_results')}</p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="card-maizul group overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    data-testid={`menu-item-${item.id}`}
                  >
                    {/* Image */}
                    {item.image && (
                      <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
                        <img
                          src={item.image}
                          alt={language === 'es' ? item.name_es : item.name_en}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {item.is_featured && (
                            <Badge className="bg-[#FFEC76] text-[#3B56B0] hover:bg-[#FFEC76]">
                              <Star className="h-3 w-3 mr-1" />
                              {t('menu_page.featured')}
                            </Badge>
                          )}
                          {item.tags?.includes('new') && (
                            <Badge className="bg-green-500 text-white hover:bg-green-500">
                              {t('menu_page.new')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div>
                      <h3
                        className="text-lg font-semibold text-slate-800 mb-2"
                        style={{ fontFamily: 'Fraunces, serif' }}
                      >
                        {language === 'es' ? item.name_es : item.name_en}
                      </h3>
                      
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {language === 'es' ? item.description_es : item.description_en}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-[#3B56B0]">
                          {t('menu_page.price_prefix')}{item.price.toFixed(0)}
                        </span>
                        
                        {/* Tag icons */}
                        <div className="flex gap-1">
                          {item.tags?.includes('vegetarian') && (
                            <span className="p-1.5 bg-green-100 rounded-full" title="Vegetariano">
                              <Leaf className="h-4 w-4 text-green-600" />
                            </span>
                          )}
                          {item.tags?.includes('popular') && (
                            <span className="p-1.5 bg-amber-100 rounded-full" title="Popular">
                              <Star className="h-4 w-4 text-amber-600" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
        
        {/* Sticky WhatsApp bar on mobile */}
        <WhatsAppButton variant="sticky" />
        {/* Floating button on desktop */}
        <div className="hidden md:block">
          <WhatsAppButton />
        </div>
      </div>
    </>
  );
};

export default Menu;
