# Terstegge Outdoor Services — Website Design Spec

**Date:** 2026-03-17
**Project:** Single-page landing site for Terstegge Outdoor Services
**Stack:** Astro 5, Tailwind CSS v3 (via PostCSS), Netlify

---

## Client Information

| Field | Value |
|---|---|
| Business Name | Terstegge Outdoor Services |
| Location | Quincy, IL 62305 |
| Phone | (217) 316-5969 |
| Email | tersteggeoutdoorservices@gmail.com |
| Facebook | https://www.facebook.com/p/Terstegge-Outdoor-Services-61579828017333/ |
| Services | Mowing, Landscape Maintenance, Shrub Trimming, Snow Removal |

---

## Design Direction

**Theme:** Dark & Earthy Pro — deep forest green base, warm cream accents, brass/gold highlights.

### Color Palette

All tokens are registered in `tailwind.config.mjs` under `theme.extend.colors`:

| Token | Hex | Tailwind class example | Use |
|---|---|---|---|
| `forest-dark` | `#1a3d1f` | `bg-forest-dark` | Hero, nav, footer, service card bg |
| `forest-mid` | `#2d6a35` | `bg-forest-mid` | Card hover bg |
| `grass` | `#4a9e55` | `bg-grass` | Grass accent stripe, decorative |
| `gold` | `#c8a84b` | `bg-gold` | CTA buttons, dividers, icon squares |
| `gold-dark` | `#a8882e` | `bg-gold-dark` | Gold hover state |
| `cream` | `#f5f0e8` | `bg-cream` | Contact section background |
| `bark` | `#7b5e3a` | `border-bark` | Subtle borders, detail use |

`tailwind.config.mjs`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        'forest-dark': '#1a3d1f',
        'forest-mid':  '#2d6a35',
        'grass':       '#4a9e55',
        'gold':        '#c8a84b',
        'gold-dark':   '#a8882e',
        'cream':       '#f5f0e8',
        'bark':        '#7b5e3a',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans:  ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### Typography

- **Display / headings:** `font-serif` (Georgia)
- **Body / UI:** `font-sans` (system stack)

---

## Framework & Dependencies

**No React.** The only interactive element is the mobile hamburger menu, handled with vanilla JS in `Header.astro`.

Lucide icons are provided by **`@lucide/astro`** (the official Astro-native package — confirm latest version on npm at implementation time, expected `^0.x`). This has no runtime JS.

**Tailwind CSS v3 integration in Astro 5:** `@astrojs/tailwind` is deprecated in Astro 5. Use PostCSS directly:

`postcss.config.mjs`:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

Import Tailwind in `src/styles/global.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`global.css` is imported in `Layout.astro` via `import '../styles/global.css'`. No other base resets are needed beyond Tailwind's preflight.

**`astro.config.mjs`** — no Tailwind integration needed, just sitemap:
```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://terstegge-outdoor.netlify.app', // placeholder; update before production
  output: 'static', // must stay 'static' — required for Netlify Forms redirect to /thanks to work
  integrations: [sitemap()],
});
```

**`package.json` dependencies:**
```json
{
  "astro": "^5.x",
  "@astrojs/sitemap": "^3.x",
  "@lucide/astro": "latest",
  "tailwindcss": "^3.x",
  "autoprefixer": "^10.x",
  "typescript": "^5.x"
}
```

---

## Logo

- **Use existing logo** — tree with exposed roots flowing into a lawn-stripe mound
- **Key detail to preserve/enhance:** roots visually continue into the diagonal stripes of the green lawn section (client direction)
- **Source:** Client-provided logo image (PNG/JPG). Must be traced to clean SVG and optimized with SVGO before use. Implementer is responsible for SVG conversion/cleanup.
- Stored at `public/logo.svg` (full-color reference copy)
- `src/components/layout/Logo.astro` — inline SVG component with props:
  - `size: number` — used as SVG `height` attribute. Defaults: nav = `36`, hero = `80`
  - `variant: 'color' | 'white'` — `color` keeps original greens/browns (light bg use), `white` renders all paths white (dark bg use). Nav and hero use `white` variant.
- **Favicon:** `public/favicon.ico` — derived from the logo mark (tree/roots portion only, 32×32). Implementer generates this from the SVG using a favicon generator tool.

---

## Page Architecture

Single-page (`index.astro`) with anchor-linked sections. No client-side routing.

```
<body id="top">
  Header (sticky, z-50)
  └── Logo (white, 36px) left | Nav links right (Home → #top, Services → #services, Contact → #contact)
  └── Mobile (< md / 768px): hamburger → slide-down panel

  <main>
    Hero (id not needed — "Home" links to #top on <body>)
    └── Logo mark (white, 80px) → H1 → subtext → CTA → grass stripe

    Services (id="services")
    └── H2 + gold rule → 4 dark cards grid

    Contact (id="contact")
    └── H2 → 2-col: business info | Netlify form

  Footer
  └── copyright | address | Facebook link
</body>
```

The "Home" nav link targets `id="top"` on `<body>`.

---

## Section Specs

### 1. Header / Nav

- **Behavior:** `sticky top-0 z-50`
- **Background:** `bg-forest-dark border-b border-gold/40`
- **Left:** `Logo.astro` (variant="white", size=36)
- **Right (≥ md / 768px):** Nav links — `Home` (#top), `Services` (#services), `Contact` (#contact) — `text-white/80 hover:text-gold text-sm font-medium transition`
- **Mobile (< md / 768px):** Hamburger toggle
  - Hamburger button shows Lucide `Menu` icon; when open, shows `X` icon (swap via JS)
  - Clicking the button toggles class `nav-open` on the `<header>` element
  - The slide-down panel is a `<div>` that is `hidden` by default; when `nav-open` is present on the header, it becomes `block`
  - Panel: `<div id="mobile-nav" ...>` — same `bg-forest-dark`, links stacked vertically, `py-4 px-6`, `border-t border-gold/20`
  - Clicking any nav link inside the panel closes the menu (JS removes `nav-open` class)
  - Vanilla `<script>` in `Header.astro`:
    ```js
    const header = document.querySelector('header');
    const toggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelectorAll('#mobile-nav a');
    toggle.addEventListener('click', () => header.classList.toggle('nav-open'));
    navLinks.forEach(link => link.addEventListener('click', () => header.classList.remove('nav-open')));
    ```

### 2. Hero

- **Background:** `bg-forest-dark`
- **Layout:** `py-24 md:py-32 text-center px-4`
- **Content (top to bottom):**
  1. `Logo.astro` (variant="white", size=80)
  2. `<h1 class="text-4xl md:text-5xl font-serif text-white mt-6">` — *"Quincy's Trusted Outdoor Services"*
  3. `<p class="text-lg text-white/70 max-w-xl mx-auto mt-4">` — *"Professional mowing, landscaping, shrub trimming & snow removal — serving the Quincy, IL area."*
  4. `<a href="#contact" class="inline-block mt-8 bg-gold hover:bg-gold-dark text-forest-dark font-semibold px-8 py-3 rounded transition">` — *"Get a Free Quote"*
- **Bottom accent:** `<div class="w-full h-4 bg-grass"></div>`

### 3. Services

- **ID:** `id="services"`
- **Background:** `bg-forest-dark py-16 px-4`
- **Heading:** `<h2 class="text-3xl font-serif text-white text-center">` — *"What We Do"* — followed by `<div class="w-12 h-0.5 bg-gold mx-auto mt-3 mb-12"></div>`
- **Grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto`
- **Card:**
  ```html
  <div class="bg-white/[0.07] border border-gold/35 rounded-lg p-6 hover:border-gold/70 hover:-translate-y-0.5 transition">
    <div class="w-10 h-10 rounded bg-gold flex items-center justify-center">
      <!-- Lucide icon, class="text-forest-dark w-5 h-5" -->
    </div>
    <h3 class="text-white font-semibold mt-4">Service Name</h3>
    <p class="text-white/60 text-sm mt-1">Description</p>
  </div>
  ```
- **Services:**

  | Service | `@lucide/astro` Icon | Description |
  |---|---|---|
  | Mowing | `Scissors` | Regular mowing schedules to keep your lawn looking its best |
  | Landscape Maintenance | `Sprout` | Seasonal cleanup, edging, and general landscape upkeep |
  | Shrub Trimming | `Leaf` | Precision trimming and shaping for hedges and ornamental shrubs |
  | Snow Removal | `CloudSnow` | Reliable snow and ice clearing for driveways and walkways |

  **Note:** Lucide renames icons between releases. Before building, verify all four icon names (`Scissors`, `Sprout`, `Leaf`, `CloudSnow`) are valid exports in the installed version of `@lucide/astro`. If any name is wrong the Astro build will fail with an import error. Check the package's `dist/` directory or its GitHub readme for the installed version's icon list.

### 4. Contact

- **ID:** `id="contact"`
- **Background:** `bg-cream py-16 px-4`
- **Heading:** `<h2 class="text-3xl font-serif text-forest-dark text-center mb-12">` — *"Get in Touch"*
- **Layout:** `grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto`

**Left — Business Info:**
```html
<div>
  <p class="text-gray-700 mb-6">Serving the Quincy, IL area. Reach out for a free quote.</p>
  <!-- Each row: flex items-center gap-3, icon text-forest-dark w-5 h-5, text text-gray-800 -->
  <a href="tel:+12173165969">(217) 316-5969</a>   <!-- Phone icon -->
  <a href="mailto:tersteggeoutdoorservices@gmail.com">tersteggeoutdoor...</a>  <!-- Mail icon -->
  <span>Quincy, IL 62305</span>                   <!-- MapPin icon -->
  <a href="[FB URL]" target="_blank" rel="noopener">Facebook</a>  <!-- Facebook icon -->
</div>
```

**Right — Netlify Form:**
```html
<form name="contact" method="POST" data-netlify="true" action="/thanks">
  <input type="hidden" name="form-name" value="contact" />
  <!-- Name (required), Email (required), Phone (optional), Message textarea (required) -->
  <!-- Submit: bg-gold hover:bg-gold-dark text-forest-dark font-semibold px-6 py-2 rounded -->
</form>
```
- Field style: `bg-white border border-gray-300 focus:border-forest-mid focus:ring-1 focus:ring-forest-mid rounded px-4 py-2 w-full outline-none`
- Validation: HTML5 native only (`required`, `type="email"`, `type="tel"`)
- On submit: Netlify redirects to `/thanks`

### 5. Footer

- **Background:** `bg-forest-dark py-8 text-center`
- **Content:** `text-white/60 text-sm space-y-1`
  - `© 2026 Terstegge Outdoor Services. All rights reserved.`
  - `Quincy, IL 62305`
  - Facebook `<a>` with Lucide `Facebook` icon (`w-5 h-5 text-white/60 hover:text-gold`), `target="_blank" rel="noopener"`

---

## Additional Pages

### `/thanks` (`src/pages/thanks.astro`)

Uses `Layout.astro`. Title: "Thank You | Terstegge Outdoor Services".

```
bg-forest-dark, min-h-screen, centered content
<h1 font-serif text-white> "Thanks for reaching out!"
<p text-white/70> "We'll get back to you as soon as possible."
<a href="/"> ← Back to Home </a>  (styled as gold button)
```

---

## SEO & Meta (`Layout.astro`)

```html
<title>{title} | Terstegge Outdoor Services</title>
<meta name="description" content="..." />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:type" content="website" />
<meta property="og:url" content={Astro.url} />
<!-- og:image: intentionally omitted (out of scope — no suitable image asset) -->
```

Schema.org `LocalBusiness` JSON-LD (inline in `<head>`):
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Terstegge Outdoor Services",
  "telephone": "(217) 316-5969",
  "email": "tersteggeoutdoorservices@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Quincy",
    "addressRegion": "IL",
    "postalCode": "62305",
    "addressCountry": "US"
  }
}
```

`streetAddress` is omitted — client has not provided a street address.

---

## Netlify Configuration

`netlify.toml` at project root:
```toml
[build]
  command = "npm run build"
  publish = "dist"
```

---

## Responsive Breakpoints

All breakpoints use Tailwind's default `md` = 768px and `lg` = 1024px.

| Breakpoint | Services Grid | Contact layout | Nav |
|---|---|---|---|
| Mobile (< 640px) | 1 column | Stacked | Hamburger + slide-down |
| Tablet (640–767px) | 2 columns (`sm:`) | Stacked | Hamburger + slide-down |
| Tablet (768–1023px) | 2 columns | Stacked | Full inline links |
| Desktop (≥ 1024px) | 4 columns (`lg:`) | 2-column 50/50 (`md:`) | Full inline links |

The hamburger menu activates at `< md` (768px). Full links appear at `md:` and above.

---

## File Structure

```
public/
  logo.svg          # Full-color reference (also used as og:image source if added later)
  favicon.ico       # 32×32 icon derived from logo mark (tree portion)

src/
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro
│   └── thanks.astro
├── components/
│   ├── layout/
│   │   ├── Header.astro    # Sticky nav + vanilla JS hamburger
│   │   ├── Footer.astro
│   │   └── Logo.astro      # Inline SVG, props: size (number), variant ('color' | 'white')
│   └── home/
│       ├── Hero.astro
│       ├── ServicesGrid.astro
│       └── ContactSection.astro
├── lib/
│   └── constants.ts
└── styles/
    └── global.css          # @tailwind base/components/utilities only

postcss.config.mjs           # tailwindcss + autoprefixer
tailwind.config.mjs          # custom color tokens + font families
astro.config.mjs             # sitemap integration + site URL
netlify.toml                 # build command + publish dir
```

---

## Business Constants (`src/lib/constants.ts`)

```ts
export const BUSINESS = {
  name: 'Terstegge Outdoor Services',
  city: 'Quincy',
  state: 'IL',
  zip: '62305',
  phone: '2173165969',
  phoneFormatted: '(217) 316-5969',
  email: 'tersteggeoutdoorservices@gmail.com',
  facebook: 'https://www.facebook.com/p/Terstegge-Outdoor-Services-61579828017333/',
} as const;
```

---

## Out of Scope

- React / any JS framework
- `@astrojs/tailwind` (deprecated in Astro 5 — use PostCSS)
- Blog / CMS
- Pricing page
- Online booking or scheduling
- Photo gallery
- `og:image` social share image
- Street address (not available)
- Custom domain setup (client handles post-launch)
