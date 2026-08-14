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

test("uses one OpenStreetMap tile host to avoid three cold TLS connections", async () => {
  const [routeMap, layout] = await Promise.all([
    readFile(new URL("../app/RouteMap.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(routeMap, /https:\/\/tile\.openstreetmap\.org\/\{z\}\/\{x\}\/\{y\}\.png/);
  assert.doesNotMatch(routeMap, /\{s\}\.tile\.openstreetmap\.org/);
  assert.match(layout, /rel="preconnect" href="https:\/\/tile\.openstreetmap\.org"/);
  assert.match(layout, /rel="dns-prefetch" href="\/\/tile\.openstreetmap\.org"/);
  assert.match(layout, /rel="preload"[^>]+hainan-plan-a\.geojson[^>]+as="fetch"/);
});
