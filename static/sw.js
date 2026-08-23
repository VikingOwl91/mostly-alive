const CACHE_NAME = 'mostly-alive-v1';
const OFFLINE_URLS = [
	'/',
	'/en',
	'/de',
	'/en/emergency',
	'/de/emergency',
	'/en/guide',
	'/de/guide',
	'/favicon.svg'
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(OFFLINE_URLS);
		})
	);
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) => {
			return Promise.all(
				keys.map((key) => {
					if (key !== CACHE_NAME) {
						return caches.delete(key);
					}
				})
			);
		})
	);
	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	event.respondWith(
		fetch(event.request)
			.then((response) => {
				const clone = response.clone();
				caches.open(CACHE_NAME).then((cache) => {
					cache.put(event.request, clone);
				});
				return response;
			})
			.catch(() => {
				return caches.match(event.request).then((cached) => {
					if (cached) return cached;
					if (event.request.headers.get('accept')?.includes('text/html')) {
						return caches.match('/en/emergency');
					}
				});
			})
	);
});
