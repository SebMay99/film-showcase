# Seb — Photography Portfolio

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
</p>

<p align="center">
  Personal photography portfolio with an analog 35mm film aesthetic.<br/>
  Grain overlays, white borders, editorial typography, film metadata — and a digital gallery too.
</p>

---

## Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | Framework |
| **Tailwind CSS v4** | Styling with custom analog color palette |
| **Supabase Storage** | Image storage |
| **Supabase PostgreSQL** | Database + Row Level Security |
| **Framer Motion** | Animations |
| **Lucide React** | Icons |
| **Vercel** | Hosting & deployment |

---

## Pages

| Route | Description |
|---|---|
| `/` | Full gallery — all photos |
| `/35mm` | Film photography portfolio |
| `/digital` | Digital photography portfolio |
| `/about` | Bio and gear |
| `/contact` | Contact form |

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full contents of `supabase-setup.sql`
3. Go to **Storage** → create a bucket named `portfolio` → mark it as **Public**

### 3. Environment variables

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=         # Settings → API → Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Settings → API → anon public key
SUPABASE_SERVICE_ROLE_KEY=        # Settings → API → service_role key (secret)
NEXT_PUBLIC_ADMIN_KEY=            # Your admin password (choose any string)
```

### 4. Run locally

```bash
npm run dev
```

### 5. Deploy

```bash
npx vercel
```

Or connect the repository at [vercel.com](https://vercel.com) and add all 4 environment variables under **Settings → Environment Variables**.

---

## Admin mode

Admin access is hidden — no exposed routes, no visible buttons.

1. On any gallery page, **click 5 times** on the `Roll 01 · XX frames` counter
2. Enter your `NEXT_PUBLIC_ADMIN_KEY`
3. Admin mode activates with:
   - **Upload photos** button with a full metadata modal
   - **✏ Edit** icon per photo — title, description, date, camera, film data
   - **✕ Delete** button per photo

### Photo metadata

**35mm** — camera, film roll brand, ISO, Color / B&W, capture date, optional description  
**Digital** — camera, capture date, optional description

Both types support an optional title and description.

---

## Internationalization

A language toggle (ES / EN) is available in the top-right corner of the navbar. The preference is saved to `localStorage` and persists across sessions.

---

## Project structure

```
app/
  page.tsx              # Gallery — all photos
  35mm/page.tsx         # Film gallery
  digital/page.tsx      # Digital gallery
  about/page.tsx        # About page
  contact/page.tsx      # Contact form
  api/contact/route.ts  # Contact API endpoint
  globals.css           # Tailwind v4 entry + grain overlay + base styles
components/
  GalleryView.tsx       # Shared gallery component (used by all three gallery pages)
  Navbar.tsx            # Navigation + language toggle
  Providers.tsx         # Client-side context wrapper
lib/
  supabase.ts           # Supabase client + Photo type
  i18n.ts               # EN / ES translations
  LanguageContext.tsx   # Language context + useLang hook
supabase-setup.sql      # Tables, RLS policies, and migrations
```

---

## Customization

- **Name / bio** → `app/about/page.tsx`
- **Categories** → `CATEGORY_KEYS` array in `components/GalleryView.tsx`
- **Color palette** → `@theme` block in `app/globals.css`
- **Social links** → `app/about/page.tsx` and `app/contact/page.tsx`
- **Translations** → `lib/i18n.ts`
