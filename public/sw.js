const CACHE_NAME = 'marine-fix-v4';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/anchor.svg',
  '/boiler.png',
  '/motor.png'
];

// Install: Cache base assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Delete old caches instantly
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Intercept requests
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // 1. External URLs (GitHub CDN, etc.) - NEVER intercept
  if (url.origin !== self.location.origin) {
    return;
  }

  // 2. Direct Binary Downloads (.apk) - NEVER intercept
  if (url.pathname.endsWith('.apk') || url.pathname.includes('MarineFix.apk')) {
    return;
  }

  // 3. API endpoints bypass
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response(JSON.stringify({ error: 'Offline' }), {
        headers: { 'Content-Type': 'application/json' }
      }))
    );
    return;
  }

  // 4. JS, CSS and module assets
  if (url.pathname.startsWith('/assets/') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // 5. HTML and other assets fallback
  event.respondWith(
    fetch(event.request)
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;

        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html');
        }
      })
  );
});