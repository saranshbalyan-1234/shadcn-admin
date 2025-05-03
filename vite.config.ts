import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'injectManifest',
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      srcDir: 'src',
      filename: 'sw.js',
      includeAssets: [
        'images/favicon.svg', 
        'images/favicon_light.svg', 
        'images/favicon.png', 
        'images/favicon_light.png',
        'offline.html',
        'index.html'
      ],
      manifest: {
        name: 'Shadcn Admin',
        short_name: 'ShadcnAdmin',
        description: 'Shadcn Admin Dashboard',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'images/favicon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'images/favicon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'images/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          },
          {
            src: 'images/favicon_light.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'monochrome'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /\.[^.\/]+$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
