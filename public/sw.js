const CACHE_PREFIX = `cinemaddict-cache`;
const CACHE_VER = `v1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll([
            `/`,
            `/index.html`,
            `/bundle.js`,
            `/css/normalize.css`,
            `/css/main.css`,
            `/images/emoji/angry.png`,
            `/images/emoji/puke.png`,
            `/images/emoji/sleeping.png`,
            `/images/emoji/smile.png`,
            `/images/icons/icon-favorite-active.svg`,
            `images/icons/icon-favorite.svg`,
            `images/icons/icon-watched-active.svg`,
            `images/icons/icon-watched.svg`,
            `images/icons/icon-watchlist-active.svg`,
            `images/icons/icon-watchlist.svg`,
            `images/background.png`,
            `images/bitmap.png`,
            `images/bitmap@2x.png`,
            `images/bitmap@3x.png`
          ]);
        })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      caches.keys()
        .then(
            (keys) => Promise.all(
                keys.map(
                    (key) => {
                      if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
                        return caches.delete(key);
                      }

                      return null;
                    })
                  .filter((key) => key !== null)
            )
        )
  );
});

self.addEventListener(`fetch`, (evt) => {
  const {request} = evt;

  evt.respondWith(
      caches.match(request)
        .then((cacheResponse) => {
          if (cacheResponse) {
            return cacheResponse;
          }

          return fetch(request)
            .then((response) => {
              if (!response || response.status !== 200 || response.type !== `basic`) {
                return response;
              }

              const clonedResponse = response.clone();

              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, clonedResponse));

              return response;
            });
        })
  );
});
