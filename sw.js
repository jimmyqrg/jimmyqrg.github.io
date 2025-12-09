self.addEventListener('install', event => {
  console.log('Service Worker installed.');
});

self.addEventListener('fetch', event => {
  // Optional: add caching here
});
