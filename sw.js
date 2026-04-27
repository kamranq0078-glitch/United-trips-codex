/**
 * Service Worker with Smart Cache Management
 * Version is automatically updated during deployment
 */

// AUTO-GENERATED: This version will be updated automatically
const CACHE_NAME = "unitedtrips-2026-04-27-1714204800";
const APP_VERSION = "1.0.0";

const STATIC_ASSETS = [
  "/",
  "packages.html",
  "destinations.html",
  "about.html",
  "services.html",
  "blog.html",
  "contact.html",
  "styles.css",
  "main.js",
  "manifest.json",
  "icon.svg"
];

// Log version on install
self.addEventListener("install", (event) => {
  console.log(`[SW] Installing Service Worker - Cache: ${CACHE_NAME}`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log(`[SW] Caching ${STATIC_ASSETS.length} assets`);
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log(`[SW] Cache installation complete`);
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error(`[SW] Installation failed:`, error);
        throw error;
      })
  );
});

// Clean old caches on activate
self.addEventListener("activate", (event) => {
  console.log(`[SW] Activating Service Worker`);
  event.waitUntil(
    caches.keys().then((keys) => {
      console.log(`[SW] Found ${keys.length} caches`);
      return Promise.all(
        keys
          .filter((key) => {
            const isOld = key !== CACHE_NAME;
            if (isOld) {
              console.log(`[SW] Deleting old cache: ${key}`);
            }
            return isOld;
          })
          .map((key) => caches.delete(key))
      );
    })
    .then(() => {
      console.log(`[SW] Activation complete`);
      return self.clients.matchAll();
    })
    .then((clients) => {
      // Notify all clients that service worker was updated
      clients.forEach((client) => {
        client.postMessage({
          type: 'CACHE_UPDATED',
          cacheName: CACHE_NAME,
          version: APP_VERSION
        });
      });
    })
  );
});

// Cache-first strategy for static assets
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request)
      .then((cached) => {
        if (cached) {
          console.log(`[SW] Serving from cache: ${event.request.url}`);
          return cached;
        }
        
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-2xx responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache successful responses
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
            return response;
          })
          .catch((error) => {
            console.error(`[SW] Fetch failed:`, error);
            // Return cached index.html as fallback
            return caches.match("/");
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log(`[SW] Skip waiting signal received`);
    self.skipWaiting();
  }
});
