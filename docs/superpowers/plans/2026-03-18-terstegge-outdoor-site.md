# Terstegge Outdoor Services — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and serve a production-ready single-page Astro 5 landing site for Terstegge Outdoor Services with Tailwind CSS v3 styling and Netlify Forms contact form.

**Architecture:** Single-page static site composed of isolated Astro components (Hero, ServicesGrid, ContactSection, Header, Footer), assembled in `index.astro`. All business data lives in `src/lib/constants.ts`. No client-side framework — vanilla JS handles the only interactive element (mobile hamburger toggle).

**Tech Stack:** Astro 5, Tailwind CSS v3 (PostCSS), `@lucide/astro` 0.577.0, TypeScript, Netlify (static hosting + Forms)

---

## Chunk 1: Project Scaffold & Configuration

### Task 1: Scaffold the Astro Project

**Context:** The project directory already exists at `/Users/daltonfrost/Projects/terstegge-outdoor/` with a `.git/` repo, `.superpowers/`, and `docs/`. We need to add the Astro scaffold **into** the existing directory without creating a subdirectory. All commands run from inside that directory.

**Files created by this task:**
- `package.json`
- `astro.config.mjs` (will be overwritten in Task 3)
- `tsconfig.json`
- `src/pages/index.astro` (placeholder, overwritten in Chunk 4)
- `src/env.d.ts`

- [ ] **Step 1: Navigate to project root**

```bash
cd /Users/daltonfrost/Projects/terstegge-outdoor
```

- [ ] **Step 2: Scaffold Astro into the current directory**

```bash
npm create astro@latest . -- --template minimal --no-git --yes
```

If the CLI is interactive (prompts appear), answer:
- "Where should we create your new project?" → `.` (current directory, already entered)
- "How would you like to start your new project?" → `A basic, minimal starter (recommended)`
- "Do you plan to write TypeScript?" → `Yes`
- "How strict should TypeScript be?" → `Strict`
- "Install dependencies?" → `Yes`
- "Initialize a new git repository?" → `No`

- [ ] **Step 3: Verify scaffold succeeded**

```bash
ls package.json astro.config.mjs tsconfig.json src/pages/index.astro
```

Expected output: all four files listed with no errors.

- [ ] **Step 4: Verify Astro version is 5.x**

```bash
cat package.json | grep '"astro"'
```

Expected: `"astro": "^5.` (5.x range)

---

### Task 2: Install Dependencies

**Files modified:** `package.json`, `node_modules/`

- [ ] **Step 1: Install all additional dependencies**

```bash
npm install @astrojs/sitemap @lucide/astro
npm install -D tailwindcss@^3 autoprefixer typescript@^5
```

- [ ] **Step 2: Verify all packages installed**

```bash
cat package.json | grep -E '"@astrojs/sitemap|@lucide/astro|tailwindcss|autoprefixer"'
```

Expected: all four packages listed.

- [ ] **Step 3: Verify Lucide icon names exist in the installed package**

```bash
ls node_modules/@lucide/astro/dist/icons/ | grep -i "scissors\|sprout\|leaf\|cloud-snow\|menu\|phone\|mail\|map-pin\|facebook"
```

Note: `@lucide/astro` uses kebab-case filenames but PascalCase imports. Expected files:
`scissors.js`, `sprout.js`, `leaf.js`, `cloud-snow.js`, `menu.js`, `phone.js`, `mail.js`, `map-pin.js`, `facebook.js`

If any are missing, check the available list:
```bash
ls node_modules/@lucide/astro/dist/icons/ | grep -i "snow\|cloud"
```
And update the icon name in `ServicesGrid.astro` (Task 10) accordingly. The import name is PascalCase: `cloud-snow.js` → `import { CloudSnow } from '@lucide/astro'`.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: scaffold Astro 5 project with dependencies"
```

---

### Task 3: Configuration Files

**Files created/modified:**
- `postcss.config.mjs` (create)
- `tailwind.config.mjs` (create)
- `astro.config.mjs` (overwrite)
- `netlify.toml` (create)
- `src/styles/global.css` (create)
- `src/lib/constants.ts` (create)
- `src/env.d.ts` (already exists from scaffold — verify)

- [ ] **Step 1: Create `postcss.config.mjs`**

```js
// postcss.config.mjs
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 2: Create `tailwind.config.mjs`**

```js
// tailwind.config.mjs
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

- [ ] **Step 3: Create `src/styles/` directory and `global.css`**

```bash
mkdir -p src/styles
```

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 4: Overwrite `astro.config.mjs`**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://terstegge-outdoor.netlify.app', // placeholder — update before production
  output: 'static', // must stay 'static' — required for Netlify Forms /thanks redirect
  integrations: [sitemap()],
});
```

- [ ] **Step 5: Create `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

- [ ] **Step 6: Create `src/lib/` directory and `constants.ts`**

```bash
mkdir -p src/lib
```

```ts
// src/lib/constants.ts
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

- [ ] **Step 7: Verify Astro type check passes**

```bash
npx astro check
```

Expected: `0 errors` (warnings about the placeholder index.astro are fine).

- [ ] **Step 8: Commit**

```bash
git add postcss.config.mjs tailwind.config.mjs astro.config.mjs netlify.toml src/styles/global.css src/lib/constants.ts
git commit -m "chore: add Tailwind v3 PostCSS config, Astro config, Netlify config, constants"
```

---

## Chunk 2: Foundation Components

### Task 4: Logo Asset

**Context:** The client has provided a PNG logo. Place it in `public/` so Astro serves it as a static asset. We'll use it as an `<img>` tag in `Logo.astro`.

**Known deviation from spec:** The spec calls for `public/logo.svg` with inline SVG rendering and SVG-path-level color control. We're using `public/logo.png` (the client's provided PNG) with CSS filter for the `white` variant instead. This is intentional for speed — SVG conversion is a manual step that can be done as a post-launch polish task.

**⚠️ Transparent background requirement:** The `white` variant uses `filter: brightness(0) invert(1)` which requires the logo PNG to have a **transparent background**. If the PNG has a white background, both the background and the logo art will turn white, resulting in a solid white rectangle on the dark nav/hero — visually broken. Before placing the file, check:
- Open the PNG — does it have a transparent (checkerboard) background in an image editor?
- If **transparent**: proceed as-is. The filter works correctly.
- If **white background**: request a transparent PNG from the client, OR use two separate files: `public/logo-color.png` and `public/logo-white.png` (a pre-made white version). Update `Logo.astro` accordingly to switch `src` by variant instead of using CSS filter.

**Files created:**
- `public/logo.png` (client logo — must be transparent-background PNG)
- `public/favicon.png` (same image — spec calls for `favicon.ico` at 32×32; PNG is used here as a practical substitute, generate proper `.ico` post-launch)

- [ ] **Step 1: Ensure `public/` directory exists**

The Astro minimal scaffold creates `public/` with a placeholder favicon. Verify:
```bash
ls public/
```
If it doesn't exist: `mkdir -p public`

- [ ] **Step 2: Copy the logo PNG into the public directory**

The logo PNG provided for this project should be placed at `public/logo.png`.

```bash
cp /path/to/logo.png /Users/daltonfrost/Projects/terstegge-outdoor/public/logo.png
```

- [ ] **Step 3: Copy as favicon**

```bash
cp public/logo.png public/favicon.png
```

- [ ] **Step 4: Verify files exist**

```bash
ls -la public/logo.png public/favicon.png
```

Expected: both files present.

---

### Task 5: `Logo.astro` Component

**File:** `src/components/layout/Logo.astro`

The Logo component wraps the `<img>` tag with size and variant props. The `white` variant uses `brightness-0 invert` filter to turn the image pure white against the dark nav/hero backgrounds.

- [ ] **Step 1: Create `src/components/layout/` directory and `Logo.astro`**

```bash
mkdir -p src/components/layout
```

```astro
---
// src/components/layout/Logo.astro
// Renders the business logo with size and color variant control.
// variant="color"  → original PNG colors (for use on light backgrounds)
// variant="white"  → pure white via CSS filter (for use on dark backgrounds)

interface Props {
  size?: number;
  variant?: 'color' | 'white';
  class?: string;
}

const { size = 36, variant = 'color', class: className = '' } = Astro.props;

const filterClass = variant === 'white' ? 'brightness-0 invert' : '';
---

<img
  src="/logo.png"
  height={size}
  alt="Terstegge Outdoor Services logo"
  class={`inline-block ${filterClass} ${className}`}
  style={`height: ${size}px; width: auto;`}
/>
```

- [ ] **Step 2: Verify TypeScript is happy**

```bash
npx astro check
```

Expected: `0 errors`

- [ ] **Step 3: Commit**

```bash
git add public/ src/components/layout/Logo.astro
git commit -m "feat: add Logo component with color/white variant support"
```

---

### Task 6: `Layout.astro`

**File:** `src/layouts/Layout.astro`

The HTML shell for all pages. Accepts `title` and `description` props. Contains all `<head>` meta tags, Open Graph tags, JSON-LD schema, and imports `global.css`.

- [ ] **Step 1: Create `src/layouts/` directory and `Layout.astro`**

```bash
mkdir -p src/layouts
```

```astro
---
// src/layouts/Layout.astro
// Base HTML layout for all pages. Provides SEO meta, OG tags, JSON-LD, and global styles.

import '../styles/global.css';
import { BUSINESS } from '../lib/constants';

interface Props {
  title?: string;
  description?: string;
}

const {
  title = BUSINESS.name,
  description = `Professional mowing, landscape maintenance, shrub trimming, and snow removal in ${BUSINESS.city}, ${BUSINESS.state}. Call ${BUSINESS.phoneFormatted} for a free quote.`,
} = Astro.props;

const fullTitle = title === BUSINESS.name ? title : `${title} | ${BUSINESS.name}`;
const canonicalUrl = Astro.url.href;

// JSON-LD LocalBusiness schema
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: BUSINESS.name,
  telephone: BUSINESS.phoneFormatted,
  email: BUSINESS.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: BUSINESS.city,
    addressRegion: BUSINESS.state,
    postalCode: BUSINESS.zip,
    addressCountry: 'US',
  },
};
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="generator" content={Astro.generator} />

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/favicon.png" />

    <!-- Primary Meta -->
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalUrl} />

    <!-- Open Graph -->
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalUrl} />
    <!-- og:image intentionally omitted — no suitable asset available yet -->

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body id="top" class="font-sans bg-white text-gray-900 antialiased">
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Type check**

```bash
npx astro check
```

Expected: `0 errors`

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add Layout.astro with SEO meta and JSON-LD schema"
```

---

### Task 7: `Header.astro`

**File:** `src/components/layout/Header.astro`

Sticky nav bar with Logo on the left and nav links on the right. Mobile hamburger (< 768px) uses vanilla JS to toggle a slide-down panel. No framework, no dependencies beyond `@lucide/astro`.

- [ ] **Step 1: Create `src/components/layout/Header.astro`**

```astro
---
// src/components/layout/Header.astro
// Sticky navigation header with desktop nav links and mobile hamburger menu.
// Mobile toggle: vanilla JS, no framework. Hamburger activates at < md (768px).

import Logo from './Logo.astro';
import { Menu, X } from '@lucide/astro';
---

<header class="sticky top-0 z-50 bg-forest-dark border-b border-gold/40">
  <div class="max-w-6xl mx-auto px-4 sm:px-6">
    <div class="flex items-center justify-between h-16">

      <!-- Logo -->
      <a href="#top" aria-label="Terstegge Outdoor Services — home">
        <Logo size={36} variant="white" />
      </a>

      <!-- Desktop Nav (md and up) -->
      <nav class="hidden md:flex items-center gap-8" aria-label="Main navigation">
        <a href="#top"      class="text-white/80 hover:text-gold text-sm font-medium transition">Home</a>
        <a href="#services" class="text-white/80 hover:text-gold text-sm font-medium transition">Services</a>
        <a href="#contact"  class="text-white/80 hover:text-gold text-sm font-medium transition">Contact</a>
      </nav>

      <!-- Mobile Hamburger Button (below md) -->
      <button
        id="menu-toggle"
        class="md:hidden text-white/80 hover:text-gold transition p-1"
        aria-label="Toggle navigation menu"
        aria-expanded="false"
        aria-controls="mobile-nav"
      >
        <span id="icon-menu"><Menu size={24} /></span>
        <span id="icon-close" class="hidden"><X size={24} /></span>
      </button>

    </div>
  </div>

  <!-- Mobile Nav Panel -->
  <!-- Visibility controlled by CSS via .nav-open on <header>. -->
  <!-- Always hidden at md+ via scoped <style> below — JS only runs at mobile. -->
  <div
    id="mobile-nav"
    class="bg-forest-dark border-t border-gold/20"
  >
    <nav class="flex flex-col py-4 px-6 gap-4" aria-label="Mobile navigation">
      <a href="#top"      class="text-white/80 hover:text-gold text-sm font-medium transition py-1">Home</a>
      <a href="#services" class="text-white/80 hover:text-gold text-sm font-medium transition py-1">Services</a>
      <a href="#contact"  class="text-white/80 hover:text-gold text-sm font-medium transition py-1">Contact</a>
    </nav>
  </div>
</header>

<!-- Scoped styles: panel hidden by default; shown only when header has .nav-open.
     The @media rule ensures it never shows at desktop regardless of JS state,
     which also handles the edge case of resizing from mobile to desktop with menu open. -->
<style>
  #mobile-nav {
    display: none;
  }
  header.nav-open #mobile-nav {
    display: block;
  }
  @media (min-width: 768px) {
    #mobile-nav {
      display: none !important;
    }
  }
</style>

<script>
  // Mobile hamburger toggle — adds/removes .nav-open on <header>
  const header    = document.querySelector('header')!;
  const toggle    = document.getElementById('menu-toggle')!;
  const iconMenu  = document.getElementById('icon-menu')!;
  const iconClose = document.getElementById('icon-close')!;
  const navLinks  = document.querySelectorAll('#mobile-nav a');

  function openMenu() {
    header.classList.add('nav-open');
    iconMenu.classList.add('hidden');
    iconClose.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    header.classList.remove('nav-open');
    iconMenu.classList.remove('hidden');
    iconClose.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    header.classList.contains('nav-open') ? closeMenu() : openMenu();
  });

  // Close when nav link clicked
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Auto-close if viewport resizes to desktop (handles orientation change edge case)
  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
    if (e.matches) closeMenu();
  });
</script>
```

- [ ] **Step 2: Type check**

```bash
npx astro check
```

Expected: `0 errors`

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Header.astro
git commit -m "feat: add sticky Header with responsive hamburger nav"
```

---

### Task 8: `Footer.astro`

**File:** `src/components/layout/Footer.astro`

- [ ] **Step 1: Create `src/components/layout/Footer.astro`**

```astro
---
// src/components/layout/Footer.astro
// Site footer: copyright, address, Facebook link.

import { Facebook } from '@lucide/astro';
import { BUSINESS } from '../../lib/constants';

const year = new Date().getFullYear();
---

<footer class="bg-forest-dark py-8">
  <div class="max-w-6xl mx-auto px-4 text-center space-y-2">
    <p class="text-white/60 text-sm">
      &copy; {year} {BUSINESS.name}. All rights reserved.
    </p>
    <p class="text-white/60 text-sm">
      {BUSINESS.city}, {BUSINESS.state} {BUSINESS.zip}
    </p>
    <a
      href={BUSINESS.facebook}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit us on Facebook"
      class="inline-flex items-center gap-1.5 text-white/60 hover:text-gold transition text-sm mt-1"
    >
      <Facebook size={18} />
      <span>Facebook</span>
    </a>
  </div>
</footer>
```

- [ ] **Step 2: Type check**

```bash
npx astro check
```

Expected: `0 errors`

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.astro
git commit -m "feat: add Footer with copyright, address, and Facebook link"
```

---

## Chunk 3: Page Sections

### Task 9: `Hero.astro`

**File:** `src/components/home/Hero.astro`

Full-width dark green hero section. Centered layout: Logo mark → H1 → subheading → CTA button → grass stripe accent at bottom.

- [ ] **Step 1: Create `src/components/home/` directory**

```bash
mkdir -p src/components/home
```

- [ ] **Step 2: Create `src/components/home/Hero.astro`**

```astro
---
// src/components/home/Hero.astro
// Hero section: centered logo, headline, subheading, CTA button, grass stripe.
// The grass stripe at the bottom acts as a visual ground line into the Services section.

import Logo from '../layout/Logo.astro';
---

<section class="bg-forest-dark">
  <div class="py-24 md:py-32 text-center px-4">
    <!-- Logo mark (large) -->
    <Logo size={80} variant="white" />

    <!-- Headline -->
    <h1 class="text-4xl md:text-5xl font-serif text-white mt-6 leading-tight">
      Quincy's Trusted<br />Outdoor Services
    </h1>

    <!-- Subheading -->
    <p class="text-lg text-white/70 max-w-xl mx-auto mt-4 leading-relaxed">
      Professional mowing, landscaping, shrub trimming &amp; snow removal —
      serving the Quincy, IL area.
    </p>

    <!-- CTA Button -->
    <a
      href="#contact"
      class="inline-block mt-8 bg-gold hover:bg-gold-dark text-forest-dark font-semibold px-8 py-3 rounded transition"
    >
      Get a Free Quote
    </a>
  </div>

  <!-- Grass stripe ground line -->
  <div class="w-full h-4 bg-grass" aria-hidden="true"></div>
</section>
```

- [ ] **Step 3: Type check**

```bash
npx astro check
```

Expected: `0 errors`

- [ ] **Step 4: Commit**

```bash
git add src/components/home/Hero.astro
git commit -m "feat: add Hero section with headline, subtext, and CTA"
```

---

### Task 10: `ServicesGrid.astro`

**File:** `src/components/home/ServicesGrid.astro`

Dark service cards in a responsive 4-column grid. Each card has a gold icon square, service name, and description.

**⚠️ Before writing this component:** Verify the Lucide icon import names against your installed version:
```bash
ls node_modules/@lucide/astro/dist/icons/ | grep -i "scissors\|sprout\|leaf\|cloud-snow"
```
If a file like `cloud-snow.js` is missing, search for an alternative:
```bash
ls node_modules/@lucide/astro/dist/icons/ | grep -i "snow"
```
Update the import and usage below to match the actual available name.

- [ ] **Step 1: Create `src/components/home/ServicesGrid.astro`**

```astro
---
// src/components/home/ServicesGrid.astro
// Services section: 4 dark cards in a responsive grid.
// Each card: gold icon square + service name + description.
// Layout: 1-col mobile → 2-col tablet → 4-col desktop

import { Scissors, Sprout, Leaf, CloudSnow } from '@lucide/astro';

// Service data — update descriptions or icons here as the client provides more detail
const services = [
  {
    Icon: Scissors,
    name: 'Mowing',
    description: 'Regular mowing schedules to keep your lawn looking its best all season long.',
  },
  {
    Icon: Sprout,
    name: 'Landscape Maintenance',
    description: 'Seasonal cleanup, edging, and general landscape upkeep for a polished exterior.',
  },
  {
    Icon: Leaf,
    name: 'Shrub Trimming',
    description: 'Precision trimming and shaping for hedges and ornamental shrubs.',
  },
  {
    Icon: CloudSnow,
    name: 'Snow Removal',
    description: 'Reliable snow and ice clearing for driveways and walkways when winter hits.',
  },
];
---

<section id="services" class="bg-forest-dark py-16 px-4">
  <div class="max-w-5xl mx-auto">

    <!-- Section heading + gold rule -->
    <h2 class="text-3xl font-serif text-white text-center">What We Do</h2>
    <div class="w-12 h-0.5 bg-gold mx-auto mt-3 mb-12" aria-hidden="true"></div>

    <!-- Cards grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {services.map(({ Icon, name, description }) => (
        <div class="bg-white/[0.07] border border-gold/35 rounded-lg p-6 hover:border-gold/70 hover:-translate-y-0.5 transition">
          <!-- Gold icon square -->
          <div class="w-10 h-10 rounded bg-gold flex items-center justify-center">
            <Icon size={20} class="text-forest-dark" />
          </div>
          <!-- Service name -->
          <h3 class="text-white font-semibold mt-4">{name}</h3>
          <!-- Description -->
          <p class="text-white/60 text-sm mt-1 leading-relaxed">{description}</p>
        </div>
      ))}
    </div>

  </div>
</section>
```

- [ ] **Step 2: Type check**

```bash
npx astro check
```

Expected: `0 errors`. If you see an error about a missing icon export, revisit the icon name check above.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/ServicesGrid.astro
git commit -m "feat: add Services section with 4-card dark grid"
```

---

### Task 11: `ContactSection.astro`

**File:** `src/components/home/ContactSection.astro`

Cream-background contact section. Two-column (50/50 on desktop, stacked mobile): business info with icons on the left, Netlify Form on the right. Form redirects to `/thanks` on submission.

- [ ] **Step 1: Create `src/components/home/ContactSection.astro`**

```astro
---
// src/components/home/ContactSection.astro
// Contact section with business info and Netlify-powered contact form.
// Form: name="contact" data-netlify="true" action="/thanks"
// Validation: HTML5 native only (required, type="email", type="tel")

import { Phone, Mail, MapPin, Facebook } from '@lucide/astro';
import { BUSINESS } from '../../lib/constants';
---

<section id="contact" class="bg-cream py-16 px-4">
  <div class="max-w-4xl mx-auto">

    <!-- Section heading -->
    <h2 class="text-3xl font-serif text-forest-dark text-center mb-12">Get in Touch</h2>

    <!-- Two-column layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">

      <!-- Left: Business Info -->
      <div>
        <p class="text-gray-700 mb-6 leading-relaxed">
          Serving the Quincy, IL area. Reach out for a free quote — we'll get back to you promptly.
        </p>

        <ul class="space-y-4">
          <!-- Phone -->
          <li>
            <a
              href={`tel:+1${BUSINESS.phone}`}
              class="flex items-center gap-3 text-gray-800 hover:text-forest-mid transition"
            >
              <Phone size={20} class="text-forest-dark shrink-0" />
              <span>{BUSINESS.phoneFormatted}</span>
            </a>
          </li>

          <!-- Email -->
          <li>
            <a
              href={`mailto:${BUSINESS.email}`}
              class="flex items-center gap-3 text-gray-800 hover:text-forest-mid transition break-all"
            >
              <Mail size={20} class="text-forest-dark shrink-0" />
              <span>{BUSINESS.email}</span>
            </a>
          </li>

          <!-- Location -->
          <li class="flex items-center gap-3 text-gray-800">
            <MapPin size={20} class="text-forest-dark shrink-0" />
            <span>{BUSINESS.city}, {BUSINESS.state} {BUSINESS.zip}</span>
          </li>

          <!-- Facebook -->
          <li>
            <a
              href={BUSINESS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 text-gray-800 hover:text-forest-mid transition"
            >
              <Facebook size={20} class="text-forest-dark shrink-0" />
              <span>Facebook</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Right: Netlify Contact Form -->
      <div>
        <form
          name="contact"
          method="POST"
          data-netlify="true"
          action="/thanks"
          class="space-y-4"
        >
          <!-- Required hidden field for Netlify Forms -->
          <input type="hidden" name="form-name" value="contact" />

          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Name <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              autocomplete="name"
              class="bg-white border border-gray-300 focus:border-forest-mid focus:ring-1 focus:ring-forest-mid rounded px-4 py-2 w-full outline-none transition"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autocomplete="email"
              class="bg-white border border-gray-300 focus:border-forest-mid focus:ring-1 focus:ring-forest-mid rounded px-4 py-2 w-full outline-none transition"
            />
          </div>

          <!-- Phone (optional) -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
              Phone <span class="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              autocomplete="tel"
              class="bg-white border border-gray-300 focus:border-forest-mid focus:ring-1 focus:ring-forest-mid rounded px-4 py-2 w-full outline-none transition"
            />
          </div>

          <!-- Message -->
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
              Message <span class="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              class="bg-white border border-gray-300 focus:border-forest-mid focus:ring-1 focus:ring-forest-mid rounded px-4 py-2 w-full outline-none transition resize-none"
            ></textarea>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="bg-gold hover:bg-gold-dark text-forest-dark font-semibold px-6 py-2.5 rounded transition w-full sm:w-auto"
          >
            Send Message
          </button>
        </form>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Type check**

```bash
npx astro check
```

Expected: `0 errors`

- [ ] **Step 3: Commit**

```bash
git add src/components/home/ContactSection.astro
git commit -m "feat: add Contact section with business info and Netlify form"
```

---

## Chunk 4: Page Assembly & Dev Server

### Task 12: `index.astro` — Assemble the Page

**File:** `src/pages/index.astro`

Replace the placeholder `index.astro` (from the Astro scaffold) with the real page that assembles all sections.

- [ ] **Step 1: Overwrite `src/pages/index.astro`**

```astro
---
// src/pages/index.astro
// Home page: assembles all sections inside the Layout shell.

import Layout from '../layouts/Layout.astro';
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';
import Hero from '../components/home/Hero.astro';
import ServicesGrid from '../components/home/ServicesGrid.astro';
import ContactSection from '../components/home/ContactSection.astro';
---

<!-- No title prop — Layout defaults to BUSINESS.name ("Terstegge Outdoor Services").
     Passing a custom title here would trigger Layout's "title | BUSINESS.name" suffix logic,
     causing the business name to appear twice. The default is the correct homepage title. -->
<Layout
  description="Professional mowing, landscape maintenance, shrub trimming, and snow removal in Quincy, IL. Call (217) 316-5969 for a free quote."
>
  <Header />
  <main>
    <Hero />
    <ServicesGrid />
    <ContactSection />
  </main>
  <Footer />
</Layout>
```

- [ ] **Step 2: Type check**

```bash
npx astro check
```

Expected: `0 errors`

---

### Task 13: `thanks.astro` — Form Submission Page

**File:** `src/pages/thanks.astro`

Simple dark green confirmation page that Netlify redirects to after form submission.

- [ ] **Step 1: Create `src/pages/thanks.astro`**

```astro
---
// src/pages/thanks.astro
// Form submission success page. Netlify redirects here after contact form is submitted.

import Layout from '../layouts/Layout.astro';
---

<Layout
  title="Thank You"
  description="Thanks for contacting Terstegge Outdoor Services. We'll be in touch soon."
>
  <div class="min-h-screen bg-forest-dark flex items-center justify-center px-4 text-center">
    <div>
      <h1 class="text-4xl font-serif text-white mb-4">Thanks for reaching out!</h1>
      <p class="text-white/70 text-lg mb-8 max-w-md mx-auto">
        We'll get back to you as soon as possible.
      </p>
      <a
        href="/"
        class="inline-block bg-gold hover:bg-gold-dark text-forest-dark font-semibold px-8 py-3 rounded transition"
      >
        &larr; Back to Home
      </a>
    </div>
  </div>
</Layout>
```

- [ ] **Step 2: Type check**

```bash
npx astro check
```

Expected: `0 errors`

- [ ] **Step 3: Commit both pages**

```bash
git add src/pages/index.astro src/pages/thanks.astro
git commit -m "feat: assemble index page and add thanks page for form redirect"
```

---

### Task 14: Production Build Verification

- [ ] **Step 1: Run the production build**

```bash
npm run build
```

Expected: Build completes with `0 errors`. You'll see output like:
```
dist/index.html     ✓
dist/thanks/index.html  ✓
dist/sitemap-index.xml  ✓
```

If the build fails:
- Import errors (e.g., Lucide icon not found): re-check icon names per the note in Task 10
- Tailwind classes not generating: verify `tailwind.config.mjs` content globs include `**/*.astro`
- TypeScript errors: run `npx astro check` for line-specific details

- [ ] **Step 2: Preview the production build**

```bash
npm run preview
```

Expected: Preview server starts at `http://localhost:4321`. Open in browser and spot-check:
- Home page loads with correct title "Terstegge Outdoor Services"
- `/thanks` page loads (navigate to `http://localhost:4321/thanks`)
- No blank pages or 404s

Stop the preview server (`Ctrl+C`) before continuing.

- [ ] **Step 3: Commit the build config (not dist/)**

Verify `.gitignore` includes `dist/`:
```bash
cat .gitignore | grep dist
```
If `dist` is not in `.gitignore`, add it:
```bash
echo "dist/" >> .gitignore && git add .gitignore && git commit -m "chore: ensure dist/ is gitignored"
```

---

### Task 15: Start Dev Server & Visual Review

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Expected output:
```
🚀 astro  v5.x.x started in Xms

  ┃ Local    http://localhost:4321/
  ┃ Network  http://xxx.xxx.x.x:4321/
```

- [ ] **Step 2: Open in browser and verify each section**

Navigate to `http://localhost:4321/` and check:

| Section | What to verify |
|---|---|
| Header | Logo visible (white), nav links present, gold bottom border visible |
| Hero | Dark green bg, logo mark, H1 headline, subtext, gold CTA button, grass stripe at bottom |
| Services | 4 dark cards, gold icon squares with icons, white text, hover border brightens |
| Contact | Cream background, business info with icons, form fields visible |
| Footer | Dark green, copyright, address, Facebook link/icon |

- [ ] **Step 3: Test responsive layout — resize browser to < 768px**

| Mobile check | Expected |
|---|---|
| Header | Hamburger icon (☰) appears, nav links hidden |
| Hamburger tap | Slide-down panel appears with nav links |
| Nav link tap | Panel closes, page scrolls to section |
| Services | Cards stack single-column |
| Contact | Info and form stack vertically |

- [ ] **Step 4: Verify the `/thanks` page**

Navigate to `http://localhost:4321/thanks` and check:

| Check | Expected |
|---|---|
| Background | Dark green (`forest-dark`) fills the full screen |
| Heading | "Thanks for reaching out!" — white, serif font |
| Body text | "We'll get back to you as soon as possible." — muted white |
| Button | Gold CTA "← Back to Home" links to `/` |

- [ ] **Step 5: Final commit**

```bash
git add src/pages/index.astro src/pages/thanks.astro src/components/ src/layouts/ src/lib/ src/styles/ public/ postcss.config.mjs tailwind.config.mjs astro.config.mjs netlify.toml
git commit -m "feat: complete Terstegge Outdoor Services landing site — ready for preview"
```

---

## Summary: File Manifest

| File | Status |
|---|---|
| `package.json` | ✓ Astro 5 + deps |
| `astro.config.mjs` | ✓ sitemap, static output |
| `postcss.config.mjs` | ✓ Tailwind v3 via PostCSS |
| `tailwind.config.mjs` | ✓ custom color tokens |
| `netlify.toml` | ✓ build + publish |
| `public/logo.png` | ✓ client-provided logo |
| `public/favicon.png` | ✓ logo copy as favicon |
| `src/styles/global.css` | ✓ Tailwind directives |
| `src/lib/constants.ts` | ✓ BUSINESS data |
| `src/layouts/Layout.astro` | ✓ HTML shell, SEO, JSON-LD |
| `src/components/layout/Logo.astro` | ✓ size + variant props |
| `src/components/layout/Header.astro` | ✓ sticky nav + hamburger |
| `src/components/layout/Footer.astro` | ✓ copyright + FB link |
| `src/components/home/Hero.astro` | ✓ hero section |
| `src/components/home/ServicesGrid.astro` | ✓ 4-card dark grid |
| `src/components/home/ContactSection.astro` | ✓ Netlify form |
| `src/pages/index.astro` | ✓ page assembly |
| `src/pages/thanks.astro` | ✓ form success page |
