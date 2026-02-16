# Maizul Restaurant Website - PRD

## Original Problem Statement
Sitio web completo para restaurante familiar Maizul en Nuevo Vallarta, México. Mobile-first, SEO optimizado para búsquedas como "desayunos Nuevo Vallarta", "restaurante Nuevo Vallarta". Bilingüe ES/EN con selector persistente.

## User Personas
1. **Turistas (EE.UU.)**: Buscan desayuno/comida/cena en Nuevo Vallarta, necesitan menú en inglés
2. **Familias locales**: Buscan restaurante familiar con vista y ambiente relajado
3. **Admin del restaurante**: Necesita gestionar menú y ver información de contacto

## Core Requirements (Static)
- Sitio bilingüe ES/EN con rutas SEO-friendly (/es, /en)
- Home: Hero, Por qué Maizul, Horarios inteligentes, Instagram, Maps, FAQ
- Menú digital con tabs por categoría y auto-detect de hora
- Admin dashboard con CRUD de menú y gestión de usuarios
- WhatsApp CTA con mensaje prellenado
- SEO: Schema.org, meta tags, sitemap, robots.txt
- Colores: Azul #3B56B0, Amarillo #FFEC76

## What's Been Implemented (Feb 16, 2026)
### Backend (FastAPI + MongoDB)
- [x] Auth: JWT login, registro, roles (admin/editor)
- [x] CRUD Menú: crear, leer, actualizar, eliminar items
- [x] CRUD Usuarios: gestión de usuarios (solo admin)
- [x] Seed inicial: admin + 12 items de menú de ejemplo
- [x] Health check endpoint

### Frontend (React + Tailwind)
- [x] Home page con todas las secciones
- [x] Menu page con tabs, búsqueda, filtros
- [x] Admin login y dashboard completo
- [x] Selector de idioma persistente (localStorage)
- [x] WhatsApp button flotante
- [x] SEO: meta tags dinámicos, schema.org en index.html

### Configuration
- Admin: username=admin, password=Damian.01
- WhatsApp: +52 322 139 3087
- Dirección: C. 16 de Septiembre 42, Nuevo Vallarta 63732

## Prioritized Backlog

### P0 (Critical) - Done ✅
- Sitio funcional con todas las páginas
- Admin CRUD operativo
- Bilingüe completo

### P1 (High Priority) - Pending
- Integración real de Instagram API
- Imágenes propias del restaurante
- Sistema de reservaciones

### P2 (Nice to Have)
- Notificaciones push para ofertas
- Blog con recetas/noticias
- Programa de lealtad
- Integración con Google Reviews

## Next Tasks
1. Reemplazar imágenes placeholder por fotos reales
2. Configurar Instagram API para feed real
3. Añadir sistema de reservas con WhatsApp automático
4. Configurar dominio de producción
