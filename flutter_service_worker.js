'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "9f0ff7c4946a01a9498da88473abbeff",
"assets/AssetManifest.bin.json": "99fd0648ecd140b822877bab00c29f98",
"assets/AssetManifest.json": "7fbfc1d72c99db91f9faa6e62d581002",
"assets/assets/fonts/Inter_Regular.ttf": "e48c1217adab2a0e44f8df400d33c325",
"assets/assets/fonts/Inter_Medium.ttf": "4591e900425d177e6ba268d165bf12e8",
"assets/assets/fonts/Inter_ExtraBold.ttf": "995fb5ac38b90303c0cc1a0b21e2c9fe",
"assets/assets/fonts/Inter_Thin.ttf": "1e9e30c74648950a240427636b6c1992",
"assets/assets/fonts/Inter_Bold.ttf": "8b04b3bd9435341377d7f4b4d68b6ecc",
"assets/assets/fonts/Inter_Light.ttf": "65ec965bd90e1a297cdb3be407420abc",
"assets/assets/fonts/Inter_Black.ttf": "2392341284c30f5fffb9fe0ab0cd983e",
"assets/assets/fonts/Inter_ExtraLight.ttf": "8da347e947a38e1262841f21fe7c893e",
"assets/assets/fonts/Inter_SemiBold.ttf": "c77560a8441d664af3e65dd57026dff9",
"assets/assets/images/mechanic_icon.png": "b72f87d5afcd2b258cc5884dce2e0bc8",
"assets/assets/images/property_icon.png": "16e9b85cac5b318d21cf3f67ec564a11",
"assets/assets/images/object_icon.png": "21f5e970e4b94d0fdbf3a887887dfa99",
"assets/assets/images/gravity_icon.png": "fc49fe9a048ca561205552601494e187",
"assets/fonts/MaterialIcons-Regular.otf": "d201f2612e50ee593c98e2b4f40a3b11",
"assets/NOTICES": "56f9a59227cb8d3f9cdd4949ba97a11f",
"assets/AssetManifest.bin": "9513ca00206f2b8432150899b6ca02ce",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/FontManifest.json": "e6b9658fb88cfbba66d53cecacbcb9d5",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"editor.js": "872ea5ac328ce28ac59127fbb927697a",
"editor.html": "925f58edb596b0a073ffe8226f2d09a5",
"flutter_bootstrap.js": "0aedd493a15eb171e9eaf7982581cca5",
"index.html": "2c4c1c028f1e70090fa68de06cf2aea0",
"/": "2c4c1c028f1e70090fa68de06cf2aea0",
"manifest.json": "c9d3f034674a5446701012578ca22c33",
"flutter.js": "76f08d47ff9f5715220992f993002504",
"main.dart.js": "81c11b0949610df00769ffcddc96a696",
"canvaskit/skwasm.js.symbols": "80806576fa1056b43dd6d0b445b4b6f7",
"canvaskit/skwasm.wasm": "f0dfd99007f989368db17c9abeed5a49",
"canvaskit/chromium/canvaskit.js.symbols": "5a23598a2a8efd18ec3b60de5d28af8f",
"canvaskit/chromium/canvaskit.wasm": "64a386c87532ae52ae041d18a32a3635",
"canvaskit/chromium/canvaskit.js": "34beda9f39eb7d992d46125ca868dc61",
"canvaskit/skwasm_st.js.symbols": "c7e7aac7cd8b612defd62b43e3050bdd",
"canvaskit/canvaskit.js.symbols": "68eb703b9a609baef8ee0e413b442f33",
"canvaskit/skwasm_st.js": "d1326ceef381ad382ab492ba5d96f04d",
"canvaskit/skwasm_st.wasm": "56c3973560dfcbf28ce47cebe40f3206",
"canvaskit/skwasm.js": "f2ad9363618c5f62e813740099a80e63",
"canvaskit/canvaskit.wasm": "efeeba7dcc952dae57870d4df3111fad",
"canvaskit/canvaskit.js": "86e461cf471c1640fd2b461ece4589df",
"interpreter.html": "1012374ed8a371bd9647e9f0c94073b4",
"icons/Icon-512.png": "b98c996529b5c3f6f7a3fa1c58ba1822",
"icons/Icon-192.png": "ea0e0bf6d12bce91e154cd082b6593bf",
"icons/Icon-maskable-192.png": "1932638346c016108528756030b148e7",
"icons/Icon-maskable-512.png": "ebbb53cb2d6c57dbfc7825a340ba066d",
"interpreter.js": "20ccbf5289f4754813c71544b2fc06cf",
"acorn_interpreter.js": "57c53598672bd6ab5591d51375e6758b",
"favicon.png": "0cfa86136a874e015d6ef3bd174c3413"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
