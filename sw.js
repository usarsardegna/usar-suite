// USAR-SAR01 SUITE - permette di aprire la suite anche senza rete
const CACHE = 'usar-suite-v9';
const FILES = ['./', 'index.html', 'manifest.json', 'icon-v27-192.png', 'icon-v27-512.png', 'logo-vvf.png', 'logo-usar.png',
  'app-attivazioni.png', 'app-logistica.png', 'app-accessi.png', 'app-usartac.png', 'app-posizione.png', 'app-quadro.png', 'app-controlli.png', 'logo-scritta.png', 'icon-splash-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => c.add(f).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))));
  self.clients.claim();
});
// Prima la rete (aggiornamenti subito), poi la copia salvata
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    // la pagina e i file della suite: chiedo sempre la versione nuova (niente copia vecchia del browser)
    fetch(e.request, { cache: 'no-cache' })
      .then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
