/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated () {
      sendPostRequests();
    },
    offline () {
      window.addEventListener('fetch', function(event) {
        if (event.request.method === 'POST') {
          const clonedRequest = event.request.clone()
          savePostRequest(clonedRequest)
        } else {
          event.respondWith(
            caches.match(event.request)
              .then(function(response) {
                if (response) {
                  return response;
                }
                return fetch(event.request);
              }
            )
          );
        }
      });
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}

function savePostRequest(request) {
  const db = indexedDB.open('postRequests', 3);
  db.onupgradeneeded = function(event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore('postRequests', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('request', 'request', { unique: false });
  };
  db.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction('postRequests', 'readwrite');
    const objectStore = transaction.objectStore('postRequests');
    objectStore.add({ request: request });
  };
}

function sendPostRequests() {
  const db = indexedDB.open('postRequests', 3);
  db.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction('postRequests', 'readwrite');
    const objectStore = transaction.objectStore('postRequests');
    objectStore.getAll().onsuccess = function(event) {
      const requests = event.target.result;
      requests.forEach(function(request) {
        fetch(request.request);
      });
      objectStore.clear();
    };
  };
}
