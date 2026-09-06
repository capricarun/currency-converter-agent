/* ══════════════════════════════════════════════════════════════
   Currenzy service worker

   Written network-first on purpose. The usual cache-first service
   worker is why installed web apps go stale for days — and this app
   was already being served a stale build by the CDN for minutes
   after each deploy. Here the network always wins when it is
   reachable, and the cache exists only so the agent still opens
   with no signal, which is exactly when a currency app is needed.
   ══════════════════════════════════════════════════════════════ */
const VERSION = "currenzy-v5";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(SHELL))
      .catch(() => {})            // a missing asset must not block activation
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  /* Rate feeds are cross-origin and must never be served from cache —
     a stale exchange rate presented as live is the one thing this app
     refuses to do. Let them go straight to the network. */
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then(hit =>
          hit || (req.mode === "navigate" ? caches.match("./index.html") : undefined)
        )
      )
  );
});
