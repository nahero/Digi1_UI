self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll(["./", "./styles/all.css", "./styles/tailwind.css", "./webfonts/fa-regular-400.woff2", "./webfonts/fa-solid-900.woff2", "./images/logo192.png"])
        })
    );
});

self.addEventListener("fetch", e => {
    console.log(`Intercepting fetch request for: ${e.request.url}`)
});