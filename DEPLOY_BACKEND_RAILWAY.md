# Maizul Backend - Railway Deployment

## Pasos para desplegar el backend en Railway (GRATIS)

### 1. Crear cuenta en Railway
- Ve a https://railway.app
- Regístrate con GitHub

### 2. Crear nuevo proyecto
- Click en "New Project"
- Selecciona "Deploy from GitHub repo"
- Conecta tu repositorio

### 3. Configurar variables de entorno en Railway
En el dashboard de Railway, ve a "Variables" y agrega:

```
MONGO_URL=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster.mongodb.net/maizul
DB_NAME=maizul
JWT_SECRET=tu-secreto-seguro-aqui-cambiar-en-produccion
CORS_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com
```

### 4. Configurar el build
Railway detectará automáticamente que es Python. Si no, crea un archivo `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### 5. Base de datos MongoDB
Opción A: Usar MongoDB Atlas (gratis)
- Ve a https://www.mongodb.com/atlas
- Crea un cluster gratis (M0)
- Obtén la connection string y ponla en MONGO_URL

Opción B: Agregar MongoDB en Railway
- En tu proyecto Railway, click "New" > "Database" > "MongoDB"
- Railway te dará la MONGO_URL automáticamente

### 6. Obtener la URL del backend
Una vez desplegado, Railway te dará una URL como:
`https://tu-app.up.railway.app`

### 7. Actualizar el frontend
Cambia la variable en tu frontend antes de subir a Hostinger:

En el archivo `.env` del frontend:
```
REACT_APP_BACKEND_URL=https://tu-app.up.railway.app
```

Luego haz build: `yarn build`
Y sube la carpeta `build/` a Hostinger

---

## Estructura de archivos para Railway

Tu repo debe tener esta estructura:
```
/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── .env (NO subir, usar variables de Railway)
├── frontend/
│   └── ... (esto va a Hostinger)
├── railway.json (opcional)
└── README.md
```

## Alternativa: Render.com

Similar a Railway:
1. https://render.com
2. "New" > "Web Service"
3. Conecta GitHub
4. Build Command: `pip install -r backend/requirements.txt`
5. Start Command: `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`
