/* FEP Compass v2.0 — service worker
   App shell: cache-first with background refresh.
   CDN assets (fonts, icons): cached on first use for offline reuse. */
'use strict';

const CACHE = 'fep-compass-v51';
const SHELL = ['./', './index.html', './styles.css', './kb.js', './app.js', './legal.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // never intercept AI provider calls
  const url = new URL(req.url);
  if (url.hostname.includes('generativelanguage.googleapis.com') || url.port === '11434') return;

  e.respondWith(
    caches.match(req).then(hit => {
      const refresh = fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || refresh;
    })
  );
});
