const CACHE_NAME = 'cajon-rhythm-v1';
const asset = (path) => new URL(path, self.registration.scope).toString();
const ASSETS = [
  asset('./'),
  asset('manifest.webmanifest'),
  asset('assets/cajon-icon.png'),
  asset('assets/hand-bass-full.png'),
  asset('assets/hand-slap-upper.png'),
  asset('assets/hand-tap-tip.png'),
  asset('audio/slap.mp3'),
  asset('audio/bass.mp3')
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        if (response.ok && event.request.url.startsWith(self.location.origin)) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
