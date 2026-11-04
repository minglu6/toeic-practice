/* 托业考试练习 · offline shell */
const CACHE = 'toeic-practice-v1';
const SHELL = [
  './',
  './index.html',
  './css/app.css',
  './css/exam.css',
  './js/config.js',
  './js/storage.js',
  './js/quiz.js',
  './js/listening.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './listening/part1.html',
  './listening/part2.html',
  './listening/part3.html',
  './listening/part4.html',
  './reading/part5.html',
  './reading/part6.html',
  './reading/part7.html',
  './basics/vocab.html',
  './basics/grammar.html',
  './basics/wrongbook.html',
  './data/part1.json',
  './data/part2.json',
  './data/part3.json',
  './data/part4.json',
  './data/part5.json',
  './data/part6.json',
  './data/part7.json',
  './data/vocab.json',
  './data/grammar.json'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        var copy = res.clone();
        if (res.ok && (req.url.indexOf('/audio/') >= 0 || req.url.indexOf('/images/') >= 0 || req.url.indexOf('/data/') >= 0)) {
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        if (req.mode === 'navigate') return caches.match('./index.html');
        return new Response('offline', { status: 503 });
      });
    })
  );
});
