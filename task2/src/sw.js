// version of the cache
const VERSION = "v1";
// the name of the cache
const CACHE_NAME = `ai-news-${VERSION}`;
// the static resources that the app needs to function when it's offline
const APP_STATIC_RESOURCES = [
    "index.html",
    "app.js",
    "style.css",
    "icons/wheel.svg",
];

// On install, cache the static resources
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(APP_STATIC_RESOURCES);
        }).catch((error) => {
            console.error("Failed to cache:", error);
        })
    );
});

// Delete old caches on activate
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((names) => {
            return Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Handle fetch events
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") {
        return; // Skip non-GET requests
    }

    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(event.request);

            if (navigator.onLine) {
                // If online, fetch from the network
                try {
                    const networkResponse = await fetch(event.request);
                    // Update the cache with the new response
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                } catch (error) {
                    console.error("Network request failed:", error);
                    return cachedResponse || new Response(null, { status: 404 });
                }
            } else {
                // If offline, return cached response
                console.log('cachedResponse ' +cachedResponse);
                return cachedResponse || new Response(null, { status: 404 });
            }
        })()
    );
});
