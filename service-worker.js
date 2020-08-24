importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.3/workbox-sw.js');

const CACHE_NAME = "uefacl-v1";
const urlsToCache = [
    "/",
    "/manifest.json",
    "/nav.html",
    "/index.html",
    "/club.html",
    "/css/materialize.min.css",
    "/css/style.css",
    "/js/api.js",
    "/js/nav.js",
    "/js/club.js",
    "/js/db.js",
    "/js/idb.js",
    "/js/javascript.js",
    "/js/jquery-3.5.1.min.js",
    "/js/materialize.min.js",
    "/pages/standings.html",
    "/pages/favorite.html",
    "/icon-192x192.png",
    "/icon-256x256.png",
    "/icon-384x384.png",
    "/icon-512x512.png",
    "/logo.png",
];
// tambah cache pertama kali
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

// fetch cache ketika reload (invoked when fetch)
self.addEventListener("fetch", async (event) => {
    const base_url = "https://api.football-data.org/";
    const svg_url = ".svg"
    if (event.request.url.indexOf(base_url) > -1 || event.request.url.indexOf(svg_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                const response = await fetch(event.request);
                cache.put(event.request.url, response.clone());
                return response;
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then((response) => {
                return response || fetch(event.request);
            })
        )
    }
});

// hapus caches lama (invoked when service-worker activated)
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache " + cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('push', function (event) {
    let body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    let options = {
        body: body,
        badge: '../logo.png',
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});