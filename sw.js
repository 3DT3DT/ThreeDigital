const CACHE_NAME = 'smart-home-v2'; // غيّر الرقم للإصدار الجديد
const urlsToCache = [
  './',
  './index.html', 
  './manifest.json',
  './sw.js'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
  console.log('🔄 Installing Service Worker version: ' + CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// fetch الموارد
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// تفعيل Service Worker وحذف القديم
self.addEventListener('activate', event => {
  console.log('🎯 Activating new Service Worker: ' + CACHE_NAME);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // تخبر جميع Tabs بالتحديث
  self.clients.claim();
});