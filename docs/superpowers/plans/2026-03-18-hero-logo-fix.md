# Hero & Logo Fix Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the logo rendering on dark backgrounds and update the hero headline to bold system sans-serif with a gold/white two-line split.

**Architecture:** Two independent file changes. The logo asset is already replaced in `public/` — only `Hero.astro` and `thanks.astro` need edits. No new files, no dependency changes. Each task is a single component edit followed by a type-check and commit.

**Tech Stack:** Astro 5, Tailwind CSS v3 (custom tokens: `text-gold`, `text-white`, `font-sans`, `font-bold`, `tracking-tight`)

---

## Chunk 1: Hero & Thanks Headline Updates

### Task 1: Update `Hero.astro` headline

**Files:**
- Modify: `src/components/home/Hero.astro`

**Context:** The existing `<h1>` uses `font-serif` (Georgia) with plain white text and the old headline copy "Quincy's Trusted Outdoor Services". Replace with bold system sans, gold/white two-line split using the business name.

- [ ] **Step 1: Read the current file**

```bash
cat src/components/home/Hero.astro
```

Locate the `<h1>` element. It currently reads:

```astro
<h1 class="text-4xl md:text-5xl font-serif text-white mt-6 leading-tight">
  Quincy's Trusted<br />Outdoor Services
</h1>
```

- [ ] **Step 2: Replace the `<h1>` element**

Replace the entire `<h1>` block (including its content) with:

```astro
<h1 class="font-sans font-bold text-4xl md:text-5xl tracking-tight mt-6 leading-tight">
  <span class="text-gold block">Terstegge</span>
  <span class="text-white block">Outdoor Services</span>
</h1>
```

Classes removed: `font-serif` (replaced by `font-sans font-bold tracking-tight`)
Classes retained: `text-4xl md:text-5xl mt-6 leading-tight`
`text-gold` uses the `gold` Tailwind token (`#c8a84b`) — not `gold-dark`.

- [ ] **Step 3: Run type check**

```bash
npx astro check
```

Expected: `0 errors, 0 warnings, 0 hints`

If errors appear: confirm the `<h1>` replacement is syntactically correct Astro/HTML — no unclosed tags.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/Hero.astro
git commit -m "fix: hero headline to bold sans with gold/white two-line split"
```

---

### Task 2: Update `thanks.astro` headline font

**Files:**
- Modify: `src/pages/thanks.astro`

**Context:** The thanks page `<h1>` uses `font-serif` which now clashes with the updated hero style. Update it to `font-sans font-bold` for consistency across the site.

- [ ] **Step 1: Read the current file**

```bash
cat src/pages/thanks.astro
```

Locate the `<h1>` element. It currently reads:

```astro
<h1 class="text-4xl font-serif text-white mb-4">Thanks for reaching out!</h1>
```

- [ ] **Step 2: Update the `<h1>` class**

Change the class from `"text-4xl font-serif text-white mb-4"` to `"text-4xl font-sans font-bold text-white mb-4"`:

```astro
<h1 class="text-4xl font-sans font-bold text-white mb-4">Thanks for reaching out!</h1>
```

Only the class attribute changes. The text content is unchanged.

- [ ] **Step 3: Run type check**

```bash
npx astro check
```

Expected: `0 errors, 0 warnings, 0 hints`

- [ ] **Step 4: Commit**

```bash
git add src/pages/thanks.astro
git commit -m "fix: sync thanks page headline to font-sans to match hero"
```

---

### Task 3: Visual verification

**Files:** None modified — verification only.

- [ ] **Step 1: Confirm dev server is running**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/
```

Expected: `200`. If not running, start it: `npm run dev`

- [ ] **Step 2: Verify logo in header**

Open `http://localhost:4321/` in a browser and inspect the sticky header:

| Check | Expected |
|---|---|
| Logo in header | White tree silhouette visible against dark green — NOT a white rectangle/box |
| Logo in hero | Same white tree, larger (80px), centered above headline |

If the logo still appears as a white box: hard-refresh the browser (`Cmd+Shift+R`) to bust the asset cache.

- [ ] **Step 3: Verify hero headline**

| Check | Expected |
|---|---|
| Font | Bold sans-serif (system UI, NOT Georgia/serif) |
| Line 1 | "Terstegge" in gold (`#c8a84b`) |
| Line 2 | "Outdoor Services" in white |
| Size | Large display size, same as before |

- [ ] **Step 4: Verify thanks page**

Navigate to `http://localhost:4321/thanks`:

| Check | Expected |
|---|---|
| Headline font | Bold sans-serif — matches hero style |
| Headline text | "Thanks for reaching out!" — unchanged |
| Background | Dark green (`forest-dark`) — unchanged |
| CTA button | Gold "← Back to Home" — unchanged |
