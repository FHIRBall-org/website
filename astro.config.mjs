// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://YOUR_USERNAME.github.io',
  // If deploying to a repo (not username.github.io), add:
  // base: '/REPO_NAME',
  vite: {
    plugins: [tailwindcss()]
  }
});