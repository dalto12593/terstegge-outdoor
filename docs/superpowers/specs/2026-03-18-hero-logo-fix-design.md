# Terstegge Outdoor Services — Hero & Logo Fix Design Spec

**Date:** 2026-03-18
**Scope:** Two visual fixes identified during dev preview review
**Affected files:** `public/logo.png`, `public/favicon.png`, `src/components/home/Hero.astro`

---

## Problem Summary

Two issues observed after initial dev preview:

1. **Logo invisible on dark backgrounds** — The original `public/logo.png` was an RGB PNG (no alpha channel). The `brightness-0 invert` CSS filter applied in `Logo.astro` (variant="white") requires a transparent background to work correctly. On a white/gray background PNG it converts all pixels to white, making the logo indistinguishable from the dark green background.

2. **Hero headline text wrong** — Original hero headline "Quincy's Trusted Outdoor Services" used `font-serif` (Georgia). The text was considered off-brand in appearance.

---

## Fix 1: Logo — Transparent PNG

**Root cause:** `public/logo.png` was an RGB file with a checkerboard-colored (light gray ~219,219,219) background from the background-removal export tool. No alpha channel present.

**Resolution:** Client provided a new transparent-background version (`terstegge-logo-transparent-sm.png`, 2628×2327, RGB). A Python/Pillow script converted it to RGBA by masking pixels where R, G, B are all >185 and max–min channel diff <30 (near-neutral = background). Output: 512×453px RGBA PNG, ~255KB.

**Result:** `public/logo.png` now has `hasAlpha: true`, RGBA mode. Corner pixels are `(0,0,0,0)` (fully transparent). The `brightness-0 invert` filter in `Logo.astro` now correctly renders the tree silhouette as solid white on dark backgrounds.

**No code changes required** — `Logo.astro` filter logic is unchanged. The fix is purely the asset replacement.

`public/favicon.png` updated with the same file (copy of new `logo.png`).

---

## Fix 2: Hero Headline Typography

### Approved Design

**Headline text:** `Terstegge Outdoor Services` (the business name — replaces "Quincy's Trusted Outdoor Services")

**Font:** `font-sans` — system-ui / -apple-system sans-serif stack (replaces `font-serif` / Georgia)

**Weight:** `font-bold` (700)

**Size:** `text-4xl md:text-5xl` (same responsive sizing as before)

**Letter-spacing:** `tracking-tight` (-0.025em)

**Color treatment:** Two-line split with gold/white hierarchy.

The `text-gold` class uses the `gold` token (`#c8a84b`) from `tailwind.config.mjs` — not `gold-dark`.

Final `<h1>` markup (complete class list — replaces the existing `<h1>` in Hero.astro entirely):

```html
<h1 class="font-sans font-bold text-4xl md:text-5xl tracking-tight mt-6 leading-tight">
  <span class="text-gold block">Terstegge</span>
  <span class="text-white block">Outdoor Services</span>
</h1>
```

Classes retained from original: `text-4xl md:text-5xl mt-6 leading-tight`
Classes removed: `font-serif`
Classes added: `font-sans font-bold tracking-tight` + inner `<span>` wrappers for color split

- Line 1: `"Terstegge"` — `text-gold` (`#c8a84b`, Tailwind token: `gold`) — brand name, draws the eye first
- Line 2: `"Outdoor Services"` — `text-white` — descriptor, supports the name

**Rationale:** Two lines allows larger display size without wrapping concerns. Gold on the brand name creates clear hierarchy and brand identity. White on the service descriptor provides contrast without competing. Bold system sans is modern and readable — suits an outdoor services brand better than traditional serif.

### Layout context (unchanged)

The surrounding hero structure is unchanged:
- Section background: `bg-forest-dark`
- Inner padding: `py-24 md:py-32 text-center px-4`
- Logo above headline: `<Logo size={80} variant="white" />`
- Subheading below: `text-lg text-white/70` — unchanged text
- CTA button below subheading: unchanged
- Grass stripe at bottom: unchanged

---

## Implementation Checklist

- [x] `public/logo.png` — replaced with RGBA transparent PNG (512×453, ~255KB) *(already done)*
- [x] `public/favicon.png` — updated to match *(already done)*
- [ ] `src/components/home/Hero.astro` — replace `<h1>` with:
  ```html
  <h1 class="font-sans font-bold text-4xl md:text-5xl tracking-tight mt-6 leading-tight">
    <span class="text-gold block">Terstegge</span>
    <span class="text-white block">Outdoor Services</span>
  </h1>
  ```
- [ ] `src/pages/thanks.astro` — update `<h1>` font for consistency: change `font-serif` to `font-sans font-bold`. Full class: `class="text-4xl font-sans font-bold text-white mb-4"`
- [ ] Run `npx astro check` → 0 errors
- [ ] Verify in browser at `localhost:4321`:
  - Logo renders as white tree silhouette in header and hero (not a white box)
  - Hero headline shows gold "Terstegge" / white "Outdoor Services" in bold sans
  - `/thanks` page headline uses matching sans-serif font
- [ ] Commit: `git add src/components/home/Hero.astro src/pages/thanks.astro && git commit -m "fix: hero headline to bold sans with gold/white split; sync thanks page font"`
