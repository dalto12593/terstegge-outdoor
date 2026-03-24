// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tersteggeoutdoor.com',
  output: 'static', // must stay 'static' — required for Netlify Forms /thanks redirect
  integrations: [sitemap()],
});
