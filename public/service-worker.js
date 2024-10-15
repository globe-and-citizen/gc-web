const CACHE_NAME = 'gc-web-cache-v1';
const urlsToCache = [
  '/',
  '/feedbacks',
  '/index.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('firestore.googleapis.com')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          const clonedRequest = event.request.clone();
          savePostRequest(clonedRequest);

          return new Response(JSON.stringify({ error: 'Offline' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 503
          });
        })
    );
  }
});

function savePostRequest(request) {
  const db = indexedDB.open('postRequests', 1);
  db.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('postRequests', { keyPath: 'id', autoIncrement: true });
  };
  db.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction('postRequests', 'readwrite');
    const objectStore = transaction.objectStore('postRequests');
    objectStore.add({ request });
  };
}
