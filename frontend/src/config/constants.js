// ================== MAIZUL RESTAURANT CONFIGURATION ==================
// Edit these values to customize the restaurant website

export const RESTAURANT_NAME = "Maizul";
export const PRIMARY_COLOR = "#3B56B0";
export const ACCENT_COLOR = "#FFEC76";

export const ADDRESS = "C. 16 de Septiembre 42, Nay, Nuevo Vallarta 63732";
export const ADDRESS_SHORT = "Nuevo Vallarta, Nayarit";

export const WHATSAPP_NUMBER = "523221393087";
export const WHATSAPP_PREFILL_ES = "Hola, quiero información de Maizul. ¿Tienen mesa disponible hoy?";
export const WHATSAPP_PREFILL_EN = "Hi! I'd like info about Maizul. Do you have availability today?";

export const INSTAGRAM_URL = "https://www.instagram.com/maizul.restaurant/";
export const INSTAGRAM_USERNAME = "@maizul.restaurant";

// Hours
export const HOURS_BREAKFAST = { start: 9, end: 12, label_es: "9:00–12:00", label_en: "9:00 AM–12:00 PM" };
export const HOURS_LUNCH = { start: 12, end: 17, label_es: "12:00–17:00", label_en: "12:00–5:00 PM" };
export const HOURS_DINNER = { start: 17, end: 22, label_es: "17:00–22:00", label_en: "5:00–10:00 PM" };
export const HOURS_FULL = { label_es: "9:00 AM – 10:00 PM", label_en: "9:00 AM – 10:00 PM" };

// Google Maps
export const GOOGLE_MAPS_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.7!2d-105.29!3d20.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDQyJzAwLjAiTiAxMDXCsDE3JzI0LjAiVw!5e0!3m2!1sen!2smx!4v1234567890";
export const GOOGLE_MAPS_LINK = "https://maps.google.com/?q=C.+16+de+Septiembre+42,+Nuevo+Vallarta,+Nayarit,+Mexico";

// Default language
export const DEFAULT_LANGUAGE = "es";

// API - Use environment variable or fallback to production URL
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://maizul-production.up.railway.app';
export const API_URL = `${BACKEND_URL}/api`;

// Images from design guidelines
export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1760726254306-9d7d755ba60a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHw0fHxibHVlJTIwb2NlYW4lMjBzdW5ueSUyMGJlYWNoJTIwbWV4aWNvJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc3MTI1ODQ5Mnww&ixlib=rb-4.1.0&q=85",
  tacos: "https://images.unsplash.com/photo-1768716697811-75b2ce9c5b54?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwbWV4aWNhbiUyMHRhY29zJTIwZnJlc2glMjBjaWxhbnRyb3xlbnwwfHx8fDE3NzEyNTg0Nzd8MA&ixlib=rb-4.1.0&q=85",
  seafood: "https://images.unsplash.com/photo-1681394421550-83cc9341b9f8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHw0fHxmcmVzaCUyMGFndWFjaGlsZSUyMHNlYWZvb2QlMjBwbGF0ZSUyMG1leGljYW4lMjBnb3VybWV0fGVufDB8fHx8MTc3MTI1ODQ5MHww&ixlib=rb-4.1.0&q=85",
  cocktail: "https://images.unsplash.com/photo-1576271758678-8ed32baa7d10?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MTJ8MHwxfHNlYXJjaHw0fHx5ZWxsb3clMjB0cm9waWNhbCUyMGNvY2t0YWlsJTIwc3VubnklMjBiZWFjaHxlbnwwfHx8fDE3NzEyNTg0OTF8MA&ixlib=rb-4.1.0&q=85",
  family: "https://images.unsplash.com/photo-1713965591727-8bde8b3da24a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHw0fHxiZWFjaCUyMHJlc3RhdXJhbnQlMjBpbnRlcmlvciUyMHN1bm55JTIwbWV4aWNvJTIwZmFtaWx5fGVufDB8fHx8MTc3MTI1ODQ3OXww&ixlib=rb-4.1.0&q=85",
};

// Category mapping
export const CATEGORIES = {
  breakfast: { es: "Desayunos", en: "Breakfast" },
  lunch: { es: "Comida", en: "Lunch" },
  dinner: { es: "Cena", en: "Dinner" },
};
