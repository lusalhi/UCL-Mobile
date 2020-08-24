importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox)
    console.log(`Workbox berhasil dimuat`);
else
    console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([
    { url: '/index.html', revision: '1' },
    { url: '/nav.html', revision: '1' },
    { url: '/club.html', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/css/style.css', revision: '1' },
    { url: '/js/materialize.min.js', revision: '1' },
    { url: '/js/javascript.js', revision: '1' },
    { url: '/js/api.js', revision: '1' },
    { url: '/js/nav.js', revision: '1' },
    { url: '/js/club.js', revision: '1' },
    { url: '/js/db.js', revision: '1' },
    { url: '/js/idb.js', revision: '1' },
    { url: '/js/jquery-3.5.1.min.js', revision: '1' },
    { url: '/icon-192x192.png', revision: '1' },
    { url: '/icon-256x256.png', revision: '1' },
    { url: '/icon-384x384.png', revision: '1' },
    { url: '/icon-512x512.png', revision: '1' },
    { url: '/pages/standings.html', revision: '1' },
    { url: '/pages/favorite.html', revision: '1' },
    { url: '/manifest.json', revision: '1' },

]);

workbox.routing.registerRoute(
    new RegExp('/club'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'club-data'
    })
);

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
    /^https:\/\/api\.football-data\.org/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'api-football',
    })
);

workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);

// Menyimpan cache untuk file font selama 1 tahun
workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    workbox.strategies.cacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
);

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