self.addEventListener('install', event => {
  console.log('Service Worker installed.');
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activated.');
  // Take control of all pages immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // Optional: add caching here
  // For now, just pass through all requests
  event.respondWith(fetch(event.request));
});
