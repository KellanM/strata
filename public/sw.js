// Offline cache: everything the game needs is fetched on install, then served
// cache-first. A new deploy rewrites VERSION, which installs a fresh cache and
// drops the old one. tools/build.mjs fills in VERSION and the file list.
const VERSION = 'dev';
const FILES = [];
const CACHE = `strata-${VERSION}`;

self.addEventListener('install', (e) => {
  // cache: 'reload' skips the browser's HTTP cache, which GitHub Pages lets hold
  // files for 10 minutes; otherwise a new version could be filled with old files
  e.waitUntil(caches.open(CACHE)
    .then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('strata-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request)),
  );
});
