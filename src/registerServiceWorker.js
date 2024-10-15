/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (import.meta.env.NODE_ENV === 'production') {
  register(`${import.meta.env.BASE_URL}service-worker.js`, {
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
      console.log('New content is available; please refresh.')
      sendPostRequests();
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}

function sendPostRequests() {
  const db = indexedDB.open('postRequests', 1);
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
