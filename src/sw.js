import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { StaleWhileRevalidate, CacheFirst, NetworkOnly } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { createHandlerBoundToURL } from 'workbox-precaching'

// Use with precache injection
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// This will be replaced by the workbox injection
precacheAndRoute(self.__WB_MANIFEST)

// Cache fonts
registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
)

registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        maxEntries: 30,
      }),
    ],
  })
)

// Cache images
registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
)

// Define offline fallback
const offlineHandler = ({ event }) => {
  return fetch(event.request).catch(() => caches.match('/offline.html'))
}

// Register a navigation route for offline fallback
const navigationRoute = new NavigationRoute(offlineHandler, {
  // Exclude API requests from offline handling
  denylist: [/^\/api/],
})

registerRoute(navigationRoute)

// Cache CSS and JS with stale-while-revalidate strategy
registerRoute(
  /\.(?:js|css)$/,
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
)
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html')
      })
    )
  }
})
