import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the place hero compact and defers heavy media libraries", async () => {
  const [hero, privateGallery, videoGallery, routeMap] = await Promise.all([
    readFile(new URL("../app/PlacePhotoGallery.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/PrivateSocialGallery.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/SocialVideoGallery.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/RouteMap.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(hero, /photos\.slice\(0, 4\)/);
  assert.match(hero, /decoding="async"/);
  assert.match(privateGallery, /const \[activated, setActivated\] = useState\(false\)/);
  assert.match(privateGallery, /if \(!activated\)/);
  assert.match(videoGallery, /const \[activated, setActivated\] = useState\(false\)/);
  assert.match(videoGallery, /if \(!activated\)/);
  assert.match(routeMap, /dynamic\(\(\) => import\("\.\/PrivateSocialGallery"\)/);
  assert.match(routeMap, /dynamic\(\(\) => import\("\.\/SocialVideoGallery"\)/);
  assert.match(routeMap, /dynamic\(\(\) => import\("\.\/PlaceDecisionTabs"\)/);
  assert.doesNotMatch(routeMap, /import \{ PrivateSocialGallery \} from/);
  assert.doesNotMatch(routeMap, /import \{ SocialVideoGallery \} from/);
  assert.doesNotMatch(routeMap, /import \{ PlaceDecisionTabs \} from/);
});

test("does not let below-the-fold photography compete with hydration", async () => {
  const [page, routeMap, deferredImage] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/RouteMap.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/DeferredImage.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /import \{ DeferredImage \}/);
  assert.match(routeMap, /import \{ DeferredImage \}/);
  assert.match(page, /<DeferredImage/);
  assert.match(routeMap, /<DeferredImage/);
  assert.match(deferredImage, /useState\(false\)/);
  assert.match(deferredImage, /useEffect/);
  assert.match(deferredImage, /deferred-image-placeholder/);
  assert.match(deferredImage, /trip-map-ready/);
  assert.match(deferredImage, /dataset\.tripMapReady/);
  assert.match(deferredImage, /window\.setTimeout\(activate, 12_000\)/);
  assert.match(routeMap, /dataset\.tripMapReady = "1"/);
  assert.match(routeMap, /dispatchEvent\(new Event\("trip-map-ready"\)\)/);
});

test("uses a low-request tile grid on ultra-wide screens", async () => {
  const [routeMap, layout] = await Promise.all([
    readFile(new URL("../app/RouteMap.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(routeMap, /https:\/\/tile\.openstreetmap\.de\/\{z\}\/\{x\}\/\{y\}\.png/);
  assert.match(routeMap, /const useWideTileGrid = window\.innerWidth >= 2200/);
  assert.match(routeMap, /tileSize: useWideTileGrid \? 512 : 256/);
  assert.match(routeMap, /zoomOffset: useWideTileGrid \? -1 : 0/);
  assert.match(routeMap, /keepBuffer: 0/);
  assert.match(routeMap, /const tilesRef = useRef<TileLayer \| null>\(null\)/);
  assert.match(routeMap, /tilesRef\.current = tiles/);
  assert.match(routeMap, /if \(tilesRef\.current && !map\.hasLayer\(tilesRef\.current\)\)/);
  assert.doesNotMatch(routeMap, /tiles\.addTo\(map\)/);
  assert.ok(routeMap.indexOf('map.once("moveend", addTilesAtFinalView)') < routeMap.indexOf("map.fitBounds(bounds"));
  assert.match(routeMap, /window\.setTimeout\(addTilesAtFinalView, 800\)/);
  assert.match(routeMap, /const routeDataReady = mapReady && status === "ready"/);
  assert.match(routeMap, /const routeIsReady = routeDataReady && tilesReady/);
  assert.match(routeMap, /!routeData \|\| !routeDataReady/);
  assert.doesNotMatch(routeMap, /server\.arcgisonline\.com/);
  assert.match(layout, /rel="preconnect" href="https:\/\/tile\.openstreetmap\.de"/);
  assert.match(layout, /rel="dns-prefetch" href="\/\/tile\.openstreetmap\.de"/);
  assert.match(layout, /rel="preload"[^>]+hainan-plan-a\.geojson[^>]+as="fetch"/);
});
