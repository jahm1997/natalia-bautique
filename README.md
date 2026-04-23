# 🛍️ Natalia Boutique — Tienda Virtual

Tienda virtual para **Natalia Boutique**, una boutique colombiana de bolsos, maquillaje y accesorios de diseñador. La aplicación permite a los clientes navegar el catálogo, ver productos por marca, armar cotizaciones y enviarlas por WhatsApp. Incluye un panel de administración protegido para gestionar categorías, marcas y productos.

---

## 📋 Tabla de Contenidos

- [Tech Stack](#-tech-stack)
- [Arquitectura](#-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Setup](#-instalación-y-setup)
- [Variables de Entorno](#-variables-de-entorno)
- [Base de Datos — MongoDB](#-base-de-datos--mongodb)
- [API Endpoints](#-api-endpoints)
- [Funcionalidades](#-funcionalidades)
- [Panel de Administración](#-panel-de-administración)
- [Roadmap](#-roadmap)

---

## 🛠️ Tech Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 18 · TypeScript · Vite 5 |
| **Estilos** | Tailwind CSS 3.4 |
| **Backend** | Node.js · Express *(en desarrollo)* |
| **Base de datos** | MongoDB (Atlas o local) |
| **Autenticación** | JWT (JSON Web Tokens) |
| **Iconos** | lucide-react |
| **Imágenes** | Cloudinary / almacenamiento local |

---

## 🏗️ Arquitectura

```
┌─────────────────────┐       ┌──────────────────────┐       ┌────────────────┐
│   Frontend (Vite)   │──────▶│  Backend API (Express)│──────▶│   MongoDB      │
│   React + TS        │ HTTP  │  /api/*               │       │   Atlas/Local  │
│   localhost:5173     │       │  localhost:4000        │       │                │
└─────────────────────┘       └──────────────────────┘       └────────────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │   Cloudinary /    │
                              │   File Storage    │
                              └──────────────────┘
```

---

## 📂 Estructura del Proyecto

```
natalia-bautique/
├── server/                    # Backend API (por construir)
│   ├── config/
│   │   └── db.js              # Conexión MongoDB
│   ├── middleware/
│   │   └── auth.js            # Middleware JWT
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Brand.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── brands.js
│   │   ├── products.js
│   │   └── upload.js
│   └── index.js               # Entry point Express
│
├── src/                       # Frontend React
│   ├── components/
│   │   ├── admin/             # Panel de administración
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── BrandManager.tsx
│   │   │   ├── CategoryManager.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   └── ProductManager.tsx
│   │   ├── cart/
│   │   │   └── CartDrawer.tsx
│   │   ├── catalog/
│   │   │   ├── BrandCard.tsx
│   │   │   └── ProductCard.tsx
│   │   ├── landing/
│   │   │   ├── BrandsShowcase.tsx
│   │   │   ├── CategorySection.tsx
│   │   │   ├── Hero.tsx
│   │   │   └── PromoSection.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   └── Header.tsx
│   │   └── ui/
│   │       ├── AnimatedEntry.tsx
│   │       └── SwipeCarousel.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── hooks/
│   │   └── useIntersectionObserver.ts
│   ├── lib/
│   │   └── api.ts             # Cliente HTTP (reemplaza supabase.ts)
│   ├── pages/
│   │   ├── Admin.tsx
│   │   ├── BrandDetail.tsx
│   │   ├── Catalog.tsx
│   │   └── Landing.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env                       # Variables de entorno (NO commitear)
├── .env.example               # Plantilla de variables de entorno
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Instalación y Setup

### Prerrequisitos

- Node.js 18+
- MongoDB (local o [MongoDB Atlas](https://www.mongodb.com/atlas))
- Git

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/jahm1997/natalia-bautique.git
cd natalia-bautique
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Edita .env con tus valores reales
```

### 3. Iniciar en desarrollo

```bash
# Terminal 1 — Frontend
npm run dev

# Terminal 2 — Backend (cuando esté listo)
cd server
npm run dev
```

El frontend corre en `http://localhost:5173` y el backend en `http://localhost:4000`.

---

## 🔐 Variables de Entorno

Copia `.env.example` a `.env` y configura tus valores:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGODB_URI` | Connection string de MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/natalia_boutique` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | `mi_clave_super_secreta_2026` |
| `JWT_EXPIRES_IN` | Tiempo de expiración de tokens | `7d` |
| `PORT` | Puerto del servidor backend | `4000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `VITE_API_URL` | URL base del backend (para el frontend) | `http://localhost:4000/api` |
| `CLOUDINARY_CLOUD_NAME` | Nombre del cloud de Cloudinary *(opcional)* | `mi_cloud` |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary *(opcional)* | `123456789` |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary *(opcional)* | `abc123secret` |

> ⚠️ **Nunca** subas el archivo `.env` al repositorio. Usa `.env.example` como referencia.

---

## 🗄️ Base de Datos — MongoDB

### Colecciones

#### `categories`
```json
{
  "_id": "ObjectId",
  "name": "Bolsos",
  "slug": "bolsos",
  "icon": "👜",
  "sort_order": 1,
  "created_at": "ISODate"
}
```

#### `brands`
```json
{
  "_id": "ObjectId",
  "name": "REF BIRKIN",
  "slug": "ref-birkin",
  "category_id": "ObjectId | null",
  "cover_image": "https://...",
  "description": "Referencia Birkin, icono de la moda",
  "is_active": true,
  "sort_order": 4,
  "created_at": "ISODate"
}
```

#### `products`
```json
{
  "_id": "ObjectId",
  "brand_id": "ObjectId",
  "name": "Bolso LV Neverfull",
  "description": "Descripción del producto",
  "price": 20000,
  "image_url": "https://...",
  "is_active": true,
  "sort_order": 0,
  "created_at": "ISODate"
}
```

#### `users`
```json
{
  "_id": "ObjectId",
  "email": "admin@nataliaboutique.com",
  "password_hash": "$2b$...",
  "role": "admin",
  "created_at": "ISODate"
}
```

### Índices recomendados

```js
db.categories.createIndex({ slug: 1 }, { unique: true });
db.categories.createIndex({ sort_order: 1 });

db.brands.createIndex({ slug: 1 }, { unique: true });
db.brands.createIndex({ category_id: 1 });
db.brands.createIndex({ is_active: 1, sort_order: 1 });

db.products.createIndex({ brand_id: 1 });
db.products.createIndex({ is_active: 1, sort_order: 1 });

db.users.createIndex({ email: 1 }, { unique: true });
```

---

## 🔌 API Endpoints

### Autenticación

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/api/auth/login` | Iniciar sesión (email + password) | ❌ |
| `POST` | `/api/auth/logout` | Cerrar sesión | ✅ |
| `GET` | `/api/auth/session` | Verificar sesión activa | ✅ |

### Categorías

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/categories` | Listar todas las categorías | ❌ |
| `POST` | `/api/categories` | Crear categoría | ✅ Admin |
| `PUT` | `/api/categories/:id` | Editar categoría | ✅ Admin |
| `DELETE` | `/api/categories/:id` | Eliminar categoría | ✅ Admin |

### Marcas

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/brands` | Listar marcas activas | ❌ |
| `GET` | `/api/brands/all` | Listar todas las marcas | ✅ Admin |
| `GET` | `/api/brands/:slug` | Detalle de una marca | ❌ |
| `POST` | `/api/brands` | Crear marca | ✅ Admin |
| `PUT` | `/api/brands/:id` | Editar marca | ✅ Admin |
| `DELETE` | `/api/brands/:id` | Eliminar marca (y sus productos) | ✅ Admin |
| `PATCH` | `/api/brands/:id/toggle` | Activar/desactivar marca | ✅ Admin |

### Productos

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/products?brand_id=X` | Productos activos de una marca | ❌ |
| `GET` | `/api/products/all?brand_id=X` | Todos los productos de una marca | ✅ Admin |
| `POST` | `/api/products` | Crear producto | ✅ Admin |
| `PUT` | `/api/products/:id` | Editar producto | ✅ Admin |
| `DELETE` | `/api/products/:id` | Eliminar producto | ✅ Admin |
| `PATCH` | `/api/products/:id/toggle` | Activar/desactivar producto | ✅ Admin |
| `PATCH` | `/api/products/bulk-price` | Cambiar precio masivo | ✅ Admin |

### Imágenes

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/api/upload` | Subir imagen | ✅ Admin |

---

## ✨ Funcionalidades

### Tienda Pública
- 🏠 Landing page con hero, categorías y showcase de marcas
- 📦 Catálogo filtrable por categoría y búsqueda por nombre
- 🏷️ Detalle de marca con carrusel y grilla de productos
- 🛒 Carrito de cotización persistido en localStorage
- 📱 Envío de cotización por WhatsApp con resumen formateado
- 📐 Diseño responsive (mobile-first)
- ✨ Animaciones de entrada y transiciones suaves

### Panel de Administración (`/#/admin`)
- 🔐 Login con autenticación segura
- 📊 Dashboard con estadísticas generales
- 🏷️ Gestión completa de marcas (CRUD + toggle visibilidad)
- 📦 Gestión de productos con paginación y cambio masivo de precios
- 📂 Gestión de categorías con iconos emoji
- 📷 Subida de imágenes (URL o archivo)

---

## 🗺️ Roadmap

- [x] Frontend completo (landing, catálogo, carrito, admin)
- [x] Diseño premium con Tailwind CSS
- [ ] Backend API con Express + MongoDB
- [ ] Autenticación con JWT + roles (admin/user)
- [ ] Subida de imágenes a Cloudinary
- [ ] React Router para navegación real
- [ ] SEO y meta tags personalizadas
- [ ] Tests unitarios y de integración
- [ ] Deploy a producción

---

## 📞 Contacto

- **WhatsApp**: [+57 301 331 6136](https://wa.me/573013316136)
- **Instagram**: [@natalia_boutique](https://instagram.com/natalia_boutique)

---

## 📄 Licencia

Proyecto privado — Todos los derechos reservados © 2026 Natalia Boutique.
