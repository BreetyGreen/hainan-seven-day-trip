import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

async function readPrivateLibrary() {
  const source = await readFile(new URL("../app/private-social-gallery.ts", import.meta.url), "utf8");
  const match = source.match(/export const privateSocialImages: PrivateSocialImage\[\] = (\[[\s\S]*?\]);\s*\n\s*export function/);
  assert.ok(match, "private gallery data must remain a JSON-compatible generated array");
  return { source, images: JSON.parse(match[1]) };
}

test("keeps the private media mode local and outside public deployment", async () => {
  const [ignore, env] = await Promise.all([
    readFile(new URL("../.gitignore", import.meta.url), "utf8"),
    readFile(new URL("../.env.local", import.meta.url), "utf8"),
  ]);

  assert.match(ignore, /^\/public\/private-hainan\/$/m);
  assert.match(env, /^NEXT_PUBLIC_PRIVATE_MEDIA=1$/m);
});

test("ships a large private Xiaohongshu library across every city and theme", async () => {
  const source = await readFile(new URL("../app/private-social-gallery.ts", import.meta.url), "utf8");
  const assets = [...source.matchAll(/"src":\s*"(\/private-hainan\/[^"]+\.webp)"/g)].map((match) => match[1]);
  const cities = [...source.matchAll(/"city":\s*"([^"]+)"/g)].map((match) => match[1]);
  const themes = [...source.matchAll(/"theme":\s*"([^"]+)"/g)].map((match) => match[1]);

  assert.ok(assets.length >= 60, `expected at least 60 private images, got ${assets.length}`);
  assert.deepEqual(new Set(cities), new Set(["海口", "万宁", "陵水", "三亚"]));
  assert.deepEqual(new Set(themes), new Set(["海景酒店", "安静海岸", "城市漫游", "吃喝"]));
  assert.equal(new Set(assets).size, assets.length, "private asset paths must be unique");
  assert.match(source, /sourceUrl:/);

  for (const assetPath of assets) {
    const asset = new URL(`../public${assetPath}`, import.meta.url);
    await access(asset);
    const info = await stat(asset);
    assert.ok(info.size < 400_000, `${assetPath} must stay below 400 KB`);
  }
});

test("binds only verified private images to exact itinerary places", async () => {
  const { source, images } = await readPrivateLibrary();
  assert.ok(images.every((image) => Array.isArray(image.placeIds)), "every image must declare placeIds");
  assert.match(source, /export function privateSocialImagesForPlace\(placeId: string\)/);

  const expectedBindings = {
    qilou: "local-qilou-night-xhs",
    "wanning-hyatt": "local-grand-hyatt-wanning-xhs",
    "shenzhou-peninsula": "local-shenzhou-peninsula-xhs",
    "shimei-bay": "local-shimei-bay-xhs",
    "xinglong-market": "local-xinglong-market-xhs",
    "xinglong-garden": "local-xinglong-garden-xhs",
    "xincun-port": "local-xincun-port-xhs",
    "sangem-moon": "local-sangem-moon-xhs",
    luhuitou: "local-luhuitou-xhs",
  };

  for (const [placeId, imageId] of Object.entries(expectedBindings)) {
    const image = images.find((candidate) => candidate.id === imageId);
    assert.ok(image, `missing verified image ${imageId}`);
    assert.ok(image.placeIds.includes(placeId), `${imageId} must bind to ${placeId}`);
  }

  const broadRouteImages = images.filter((image) => image.id.startsWith("eastline-seven-days-"));
  assert.ok(broadRouteImages.length > 0);
  assert.ok(broadRouteImages.every((image) => image.placeIds.length === 0), "city-wide route cards must not pretend to be Qilou photos");
});

test("mounts a place-first private gallery and gates the city-wide library", async () => {
  const [gallery, routeMap] = await Promise.all([
    readFile(new URL("../app/PrivateSocialGallery.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/RouteMap.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(routeMap, /process\.env\.NEXT_PUBLIC_PRIVATE_MEDIA === "1"/);
  assert.match(routeMap, /<PrivateSocialGallery[\s\S]*placeId=\{place\.id\}[\s\S]*placeName=\{place\.name\}[\s\S]*city=\{place\.city\}/);
  assert.match(gallery, /placeId, placeName, city/);
  assert.match(gallery, /privateSocialImagesForPlace\(placeId\)/);
  assert.match(gallery, /type GalleryScope = "place" \| "city"/);
  assert.match(gallery, /LOCAL PRIVATE/);
  assert.match(gallery, /aria-label="私人图片主题筛选"/);
  assert.match(gallery, /slice\(0,\s*scope === "place" \? 8 : 12\)/);
  assert.match(gallery, /loading="lazy"/);
  assert.match(gallery, /展开更多/);
  assert.match(gallery, /查看.*全部素材/);
  assert.match(gallery, /返回.*专属图片/);
  assert.match(gallery, /上一张私人图片/);
  assert.match(gallery, /下一张私人图片/);
});
