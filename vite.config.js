import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { PAGES, pagePath } from './src/lib/routes.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'static-page-preview',
    configurePreviewServer({ middlewares }) {
      // Match Vercel's static-route rewrites when checking the production build locally.
      middlewares.use((req, res, next) => {
        const url = new URL(req.url, 'http://preview.local');
        if (PAGES[pagePath(url.pathname)]) {
          req.url = `${url.pathname.replace(/\/$/, '') || ''}/index.html${url.search}`;
        }
        next();
      });
    },
  }],
})
