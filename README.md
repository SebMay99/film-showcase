# Seb — Portfolio Fotográfico

Portfolio personal estilo película analógica 35mm. Construido con Next.js 15, Tailwind CSS y Supabase.

## Stack

- **Next.js 15** (App Router)
- **Tailwind CSS** — paleta film analógica personalizada
- **Supabase** — Storage para fotos + base de datos PostgreSQL
- **Lucide React** — iconos
- **Vercel** — deploy

---

## Setup rápido

### 1. Clonar / descomprimir el proyecto

```bash
npm install
```

### 2. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto nuevo
2. En **SQL Editor**, pega y ejecuta el contenido de `supabase-setup.sql`
3. En **Storage**, crea un bucket llamado `portfolio` y márcalo como **Public**

### 3. Variables de entorno

Copia `.env.example` a `.env.local` y llena los valores:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=        # Settings → API → Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Settings → API → anon public key
SUPABASE_SERVICE_ROLE_KEY=       # Settings → API → service_role key (secreto)
NEXT_PUBLIC_ADMIN_KEY=           # Tu contraseña de admin (elige la que quieras)
```

### 4. Correr en local

```bash
npm run dev
```

### 5. Deploy en Vercel

```bash
npx vercel
```

O conecta el repo en [vercel.com](https://vercel.com) y agrega las 4 variables de entorno en **Settings → Environment Variables**.

---

## Modo administrador

Para subir, editar o eliminar fotos sin exponer una ruta de admin:

1. En la galería, **haz clic 5 veces** en el contador "Roll 01 · XX frames · ISO 400"
2. Ingresa tu `NEXT_PUBLIC_ADMIN_KEY`
3. Aparece el botón **Subir fotos** y controles de edición en cada foto

---

## Estructura del proyecto

```
app/
  page.tsx          # Galería principal
  about/page.tsx    # About me
  contact/page.tsx  # Formulario de contacto
  api/contact/      # API route para guardar mensajes
  globals.css       # Estilos globales + grain overlay
components/
  Navbar.tsx        # Navegación
lib/
  supabase.ts       # Cliente Supabase + tipos
supabase-setup.sql  # SQL para crear tablas y políticas RLS
```

---

## Personalización

- **Nombre / bio**: edita `app/about/page.tsx`
- **Redes sociales**: busca los links de Instagram/GitHub en `about` y `contact`
- **Categorías de fotos**: modifica el array `CATEGORIES` en `app/page.tsx`
- **Colores**: ajusta la paleta `film` en `tailwind.config.ts`
