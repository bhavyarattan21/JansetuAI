// JanSetu AI Service Worker - Progressive Web App Support
const CACHE_NAME = "jansetu-v10-supabase-cache";
const APP_SHELL = [
  "/",
  "/manifest.json",
  "/icon.svg"
];

// Install: Cache core application shell
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-First for HTML and JavaScript, Cache fallback for offline icons
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Bypass API and Supabase routes from offline cache
  if (url.pathname.startsWith("/api/") || url.hostname.includes("supabase.co")) {
    return;
  }

  // Network-first for navigation, html, and scripts so users always receive fresh builds
  if (
    event.request.mode === "navigate" ||
    event.request.destination === "script" ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".js")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Static assets: cache with network fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
