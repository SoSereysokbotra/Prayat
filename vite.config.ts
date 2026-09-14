import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['fonts/NotoSansKhmer-Variable.woff2', 'apple-touch-icon.png', 'icon.svg'],

      manifest: {
        name: 'Prayat — Learn to spot scams',
        short_name: 'Prayat',
        description:
          'Khmer-first scam simulation. Stop a family member from losing money — in real time.',
        lang: 'km',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        // The Khmer font is the one asset that must survive going offline —
        // without it the app shell renders in a fallback face and the
        // diacritics break. It is self-hosted precisely so it can be cached.
        globPatterns: ['**/*.{js,css,html,woff2,png,svg}'],

        // Every client route serves index.html, so the shell opens offline
        // even on a deep link. API calls are excluded: a playthrough needs the
        // network, and serving a stale scenario would be worse than an error.
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],

        runtimeCaching: [
          {
            urlPattern: /^\/api\/health$/,
            handler: 'NetworkOnly',
          },
        ],
      },

      devOptions: {
        // Off in dev: a service worker caching a stale bundle while you are
        // editing is a confusing way to lose an afternoon.
        enabled: false,
      },
    }),
  ],

  resolve: {
    alias: { '@shared': path.resolve(__dirname, 'shared') },
  },

  server: {
    host: true, // bind 0.0.0.0 so a phone on the same network can open it
    proxy: { '/api': 'http://localhost:3001' },
  },
})
