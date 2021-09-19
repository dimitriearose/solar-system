const version = 2
const CACHE_STATIC_NAME = `SOLAR-SYSTEM-STATIC-V${version}`
const CACHE_DYNAMIC_NAME = `SOLAR-SYSTEM-DYNAMIC-V${version}`

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then((cache) => {
      cache.addAll([
        '/',
        'index.html',
        '/offline.html',
        '/bundle.css',
        '/favicon.ico',
        '/offline.css',
        '/build/build.css',
        '/build/bundle.js',
        '/assets/earth_normal.jpg',
        '/assets/saturn-rings-top.png',
        '/assets/uranus.jpg',
        '/assets/neptune_ring.png',
        '/assets/uranus_ring.png',
        '/assets/jupiter_ring.png',
        '/assets/titan.jpg',
        '/assets/models/Asteroid_One/Asteroid_One.gltf',
        '/assets/models/Asteroid_Two/Asteroid_Two.gltf',
        '/assets/models/Asteroid_Three/Asteroid_Three.gltf',
        '/assets/sun.jpg',
        '/assets/mercury.jpg',
        '/assets/venus_atmosphere.jpg',
        '/assets/mars.jpg',
        '/assets/moon.jpg',
        '/assets/jupiter.jpg',
        '/assets/saturn.jpg',
        '/assets/neptune.jpg',
        '/assets/pluto.jpg',
        '/assets/earthWithClouds.png',
        '/assets/pluto_height.jpg',
        '/assets/ceres.jpg',
        '/assets/charon.jpg',
        '/assets/phobos.jpg',
        '/assets/deimos.jpg',
        '/assets/callisto.jpg',
        '/assets/ganymede.png',
        '/assets/amalthea.jpg',
        '/assets/io.jpg',
        '/assets/titania.jpg',
        '/assets/triton.jpg',
        '/assets/enceladus.jpg',
        '/assets/models/Asteroid_One/Asteroid_One_Albedo.png',
        '/assets/models/Asteroid_One/Asteroid_One_Normal.png',
        '/assets/models/Asteroid_Two/Asteroid_Two_Albedo.jpg',
        '/assets/models/Asteroid_Two/Asteroid_Two_Normal.jpg',
        '/assets/models/Asteroid_Three/Asteroid_Three_Albedo.jpg',
        '/assets/models/Asteroid_Three/Asteroid_Three_Normal.jpg',
        '/assets/stars.jpg',
        '/draco/draco_decoder.wasm',
        '/draco/draco_wasm_wrapper.js',
      ])
    })
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            return caches.delete(key)
          }
        })
      )
    })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
          cache.put(event.request.url, res.clone())
          return res
        })
      })
      .catch(() => {
        return caches.match(event.request)
      })
  )
})
