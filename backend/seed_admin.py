#!/usr/bin/env python3
"""
Script para crear el usuario admin inicial.
Ejecutar: python seed_admin.py

Este script crea el usuario admin con las credenciales:
- Usuario: admin
- Contraseña: Damian.01
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import bcrypt
import uuid
from datetime import datetime, timezone

# Cargar variables de entorno
load_dotenv()

# Configuración
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'maizul')

# Credenciales del admin
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "Damian.01"

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

async def seed_admin():
    print(f"Conectando a MongoDB: {MONGO_URL[:30]}...")
    
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Verificar si ya existe el admin
    existing = await db.users.find_one({"username": ADMIN_USERNAME})
    
    if existing:
        print(f"✓ El usuario '{ADMIN_USERNAME}' ya existe.")
        print("  Si quieres resetear la contraseña, elimina el usuario primero.")
    else:
        # Crear usuario admin
        admin_doc = {
            "id": str(uuid.uuid4()),
            "username": ADMIN_USERNAME,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "role": "admin",
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.users.insert_one(admin_doc)
        print(f"✓ Usuario admin creado exitosamente!")
        print(f"  Usuario: {ADMIN_USERNAME}")
        print(f"  Contraseña: {ADMIN_PASSWORD}")
    
    # Verificar conexión
    user_count = await db.users.count_documents({})
    menu_count = await db.menu_items.count_documents({})
    
    print(f"\n📊 Estado de la base de datos:")
    print(f"  - Usuarios: {user_count}")
    print(f"  - Items del menú: {menu_count}")
    
    client.close()
    print("\n✓ Listo!")

if __name__ == "__main__":
    asyncio.run(seed_admin())
