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
