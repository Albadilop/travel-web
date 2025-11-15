# Travel Diary - Tu Diario de Aventuras

Una aplicación web moderna para guardar y visualizar tus viajes alrededor del mundo. Crea tu diario personal de aventuras, añade ciudades visitadas con fotos, y explora tus destinos en un mapa interactivo.

## 🌟 Características

### Funcionalidades Principales

- **📍 Gestión de Ciudades**: Añade, edita y elimina ciudades que has visitado
- **🗺️ Mapa Interactivo**: Visualiza todas tus ciudades en un mapa interactivo con Mapbox
- **📸 Galería de Fotos**: Sube múltiples imágenes por ciudad (hasta 10 por ciudad)
- **⭐ Sistema de Valoración**: Califica tus ciudades visitadas del 1 al 5
- **📅 Filtros Avanzados**: Filtra ciudades por valoración, año y mes de visita
- **🏆 Ranking de Ciudades**: Visualiza tus top 5 ciudades mejor valoradas
- **👤 Perfiles de Usuario**: Crea y personaliza tu perfil de viajero
- **🔐 Autenticación Segura**: Sistema de autenticación con Supabase
- **📱 Diseño Responsive**: Funciona perfectamente en dispositivos móviles y desktop

### Páginas

- **Inicio (`/`)**: Página principal con hero section y showcase de ciudades
- **Mi Mapa (`/map`)**: Mapa interactivo con todas tus ciudades visitadas
- **Mis Ciudades (`/cities`)**: Lista completa de ciudades con filtros y ranking
- **Autenticación (`/auth`)**: Registro e inicio de sesión

## 🛠️ Tecnologías

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **Mapbox GL** - Mapas interactivos
- **TanStack Query** - Gestión de estado del servidor

### Backend & Base de Datos
- **Supabase** - Backend as a Service
  - PostgreSQL - Base de datos
  - Authentication - Autenticación de usuarios
  - Storage - Almacenamiento de imágenes
  - Realtime - Actualizaciones en tiempo real

### Otras Dependencias
- **Lucide React** - Iconos
- **React Hook Form** - Formularios
- **Zod** - Validación de esquemas
- **date-fns** - Manipulación de fechas

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Cuenta de Supabase
- Token de acceso de Mapbox (opcional, para el mapa interactivo)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <YOUR_GIT_URL>
cd travel_web-main
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
VITE_MAPBOX_TOKEN=tu_token_de_mapbox
```

### 4. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta las migraciones en orden:
   ```bash
   supabase db reset
   ```
   O ejecuta manualmente las migraciones desde `supabase/migrations/`

3. (Opcional) Ejecuta el seed para datos de ejemplo:
   ```bash
   psql -h [tu-host] -U postgres -d postgres -f supabase/seed.sql
   ```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
travel_web-main/
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── ui/           # Componentes de shadcn/ui
│   │   ├── CityCard.tsx  # Tarjeta de ciudad
│   │   ├── Map.tsx       # Componente del mapa
│   │   └── ...
│   ├── pages/            # Páginas de la aplicación
│   │   ├── Index.tsx
│   │   ├── AllCitiesPage.tsx
│   │   ├── MyMapPage.tsx
│   │   └── AuthPage.tsx
│   ├── hooks/            # Custom hooks
│   │   ├── useCities.ts  # Hook para gestionar ciudades
│   │   └── useAuth.ts    # Hook para autenticación
│   ├── integrations/     # Integraciones externas
│   │   └── supabase/     # Cliente de Supabase
│   └── lib/              # Utilidades
├── supabase/
│   ├── migrations/       # Migraciones de base de datos
│   ├── seed.sql          # Datos de ejemplo
│   └── functions/        # Edge functions
└── public/               # Archivos estáticos
```

## 🗄️ Base de Datos

### Tablas Principales

- **`profiles`**: Perfiles de usuario
- **`cities`**: Ciudades visitadas
- **`city_images`**: Imágenes asociadas a ciudades

### Migraciones

Las migraciones están en `supabase/migrations/` y se ejecutan en orden cronológico:

1. `cities.sql` - Crea la tabla de ciudades
2. `storage-bucket-for-city-images.sql` - Configura el bucket de almacenamiento
3. `realtime-for-the-cities-table.sql` - Habilita realtime y crea tabla de imágenes
4. `profiles-table.sql` - Crea la tabla de perfiles
5. `auto-create-profile-on-signup.sql` - Trigger para crear perfil automáticamente

## 🎨 Características de Diseño

- **Tema**: Diseño moderno con soporte para modo claro/oscuro
- **Colores**: Paleta con tonos naranjas como color principal
- **Tipografía**: Fuente Poppins para títulos
- **Responsive**: Diseño adaptativo para móviles, tablets y desktop
- **Animaciones**: Transiciones suaves y efectos hover

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm run build:dev    # Construye en modo desarrollo
npm run preview      # Previsualiza la build de producción

# Linting
npm run lint         # Ejecuta el linter
```

## 🔧 Funcionalidades Técnicas

### Autenticación
- Registro de nuevos usuarios
- Inicio de sesión
- Cierre de sesión
- Creación automática de perfil al registrarse

### Gestión de Ciudades
- Añadir ciudades con geocodificación automática
- Editar información de ciudades
- Eliminar ciudades
- Subir múltiples imágenes por ciudad
- Filtrado por valoración, año y mes

### Mapa Interactivo
- Visualización de todas las ciudades en un mapa
- Marcadores interactivos
- Integración con Mapbox GL

### Realtime
- Actualizaciones en tiempo real cuando se añaden/modifican ciudades
- Sincronización automática entre dispositivos

## 🚢 Despliegue

### Con Lovable

Simplemente abre [Lovable](https://lovable.dev/projects/502a5aa7-047e-4684-94f0-9a88d10d202d) y haz clic en Share -> Publish.

### Despliegue Manual

1. Construye la aplicación:
   ```bash
   npm run build
   ```

2. Los archivos de producción estarán en la carpeta `dist/`

3. Despliega en tu plataforma preferida (Vercel, Netlify, etc.)

## 🔐 Seguridad

- Row Level Security (RLS) habilitado en todas las tablas
- Políticas de seguridad configuradas para acceso por usuario
- Autenticación segura con Supabase Auth
- Validación de datos en frontend y backend

## 📄 Licencia

Este proyecto es privado.

## 👥 Contribuir

Este es un proyecto personal. Si deseas contribuir, por favor contacta al propietario del repositorio.

## 📞 Soporte

Para soporte, abre un issue en el repositorio o contacta al desarrollador.

---

**Travel Diary** - Guarda cada momento, cada ciudad y cada experiencia de tus viajes en un mapa interactivo lleno de recuerdos.
