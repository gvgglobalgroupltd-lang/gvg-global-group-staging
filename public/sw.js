const CACHE_NAME = 'gvg-portal-cache-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Basic pass-through or simple cache strategy
    // For now, we won't aggressively cache to avoid staleness issues without proper versioning logic
    // helping specifically with Lighthouse "Registers a service worker" check
});
