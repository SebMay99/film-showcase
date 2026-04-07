# Seb — Portfolio Fotográfico

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
</p>

<p align="center">
  Portfolio personal de fotografía analógica y digital.<br/>
  Estética de película 35mm — grano, sepia, marcos blancos y tipografía editorial.
</p>

---

## Stack

| Tecnología | Uso |
|---|---|
| **Next.js 16** (App Router) | Framework principal |
| **Tailwind CSS v4** | Estilos con paleta analógica personalizada |
| **Supabase Storage** | Almacenamiento de imágenes |
| **Supabase PostgreSQL** | Base de datos + RLS |
| **Framer Motion** | Animaciones |
| **Lucide React** | Iconos |
| **Vercel** | Deploy y hosting |

---

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | Galería completa — todas las fotos |
| `/35mm` | Portfolio de fotografía analógica |
| `/digital` | Portfolio de fotografía digital |
| `/about` | Bio y equipamiento |
| `/contact` | Formulario de contacto |

---

## Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta `supabase-setup.sql` completo
3. Ve a **Storage** → crea un bucket llamado `portfolio` → márcalo como **Public**

### 3. Variables de entorno

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=         # Settings → API → Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Settings → API → anon public key
SUPABASE_SERVICE_ROLE_KEY=        # Settings → API → service_role key (secreto)
NEXT_PUBLIC_ADMIN_KEY=            # Tu contraseña de admin
```

### 4. Desarrollo local

```bash
npm run dev
```

### 5. Deploy

```bash
npx vercel
```

O conecta el repositorio en [vercel.com](https://vercel.com) y agrega las 4 variables en **Settings → Environment Variables**.

---

## Modo administrador

El acceso admin está oculto — sin rutas expuestas ni botones visibles.

1. En cualquier galería, **haz clic 5 veces** en el texto `Roll 01 · XX frames`
2. Ingresa tu `NEXT_PUBLIC_ADMIN_KEY`
3. Se activa el modo admin con:
   - Botón **Subir fotos** con modal de metadatos
   - Icono ✏ por foto para editar título, descripción, fecha, cámara y datos del rollo
   - Botón ✕ para eliminar

### Metadatos por foto

**35mm** — cámara, marca del rollo, ISO, Color / B&W, fecha de captura, descripción  
**Digital** — cámara, fecha de captura, descripción

---

## Estructura

```
app/
  page.tsx              # Galería — todas las fotos
  35mm/page.tsx         # Galería 35mm
  digital/page.tsx      # Galería digital
  about/page.tsx        # About
  contact/page.tsx      # Contacto
  api/contact/route.ts  # API para mensajes de contacto
  globals.css           # Tailwind v4 + grain overlay + estilos base
components/
  GalleryView.tsx       # Componente principal de galería (compartido)
  Navbar.tsx            # Navegación
lib/
  supabase.ts           # Cliente Supabase + tipo Photo
supabase-setup.sql      # Tablas, RLS y migraciones
```

---

## Personalización

- **Nombre / bio** → `app/about/page.tsx`
- **Categorías** → array `CATEGORIES` en `components/GalleryView.tsx`
- **Paleta de colores** → `@theme` en `app/globals.css`
- **Redes sociales** → links en `app/about/page.tsx` y `app/contact/page.tsx`
