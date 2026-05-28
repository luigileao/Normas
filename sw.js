/* sw.js — Engenharia Elétrica · Normas */
const CACHE = 'normas-v12';   // ← incrementar a cada deploy
const SHELL = [
  './','./index.html','./styles.css','./manifest.json',
  './js/config.js','./js/supabase.js','./js/data.js','./js/cemig.js','./js/cemig_index.js','./js/ct017.js','./js/eng.js','./js/app.js',
  './icons/icon-192.png','./icons/icon-512.png'
];
const IGNORE = ['supabase.co'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
});
self.addEventListener('message', e => { if(e.data==='skip') self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (IGNORE.some(d => e.request.url.includes(d))) return;
  e.respondWith(
    fetch(e.request)
      .then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return res; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
