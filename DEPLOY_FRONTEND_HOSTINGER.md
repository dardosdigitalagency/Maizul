# Maizul Frontend - Hostinger Deployment

## Pasos para desplegar el frontend en Hostinger

### 1. Preparar el build

Primero, actualiza la URL del backend en `/frontend/.env`:
```
REACT_APP_BACKEND_URL=https://tu-backend.up.railway.app
```

Luego genera el build:
```bash
cd frontend
yarn build
```

Esto creará una carpeta `build/` con los archivos estáticos.

### 2. Subir a Hostinger

**Opción A: Via File Manager**
1. Entra al panel de Hostinger
2. Ve a "File Manager"
3. Navega a `public_html/`
4. Sube TODO el contenido de la carpeta `build/` (no la carpeta, solo su contenido)
5. Asegúrate de incluir el archivo `.htaccess`

**Opción B: Via FTP**
1. Usa FileZilla o similar
2. Conecta con tus credenciales FTP de Hostinger
3. Sube el contenido de `build/` a `public_html/`

**Opción C: Via GitHub (Git deployment)**
1. En Hostinger, ve a "Git" en el panel
2. Conecta tu repositorio
3. Configura para que solo despliegue la carpeta `frontend/build/`

### 3. Archivo .htaccess (IMPORTANTE)

Este archivo YA está en `/frontend/public/.htaccess` y se incluirá en el build.

Verifica que exista en `public_html/.htaccess` después de subir:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

### 4. Verificar

- Visita tu dominio: `https://tu-dominio.com` ✓
- Visita el admin: `https://tu-dominio.com/admin` ✓
- Prueba el login con: usuario `admin`, contraseña `Damian.01`

### Troubleshooting

**Error 404 en rutas**:
- Verifica que `.htaccess` existe en `public_html/`
- En Hostinger, asegúrate que mod_rewrite está habilitado

**Login no funciona**:
- Verifica que `REACT_APP_BACKEND_URL` apunta a tu backend
- Abre DevTools (F12) > Network y verifica que las llamadas a `/api/` llegan al backend

**CORS errors**:
- En Railway, asegúrate que `CORS_ORIGINS` incluye tu dominio de Hostinger
