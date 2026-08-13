import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

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

test("mounts a lazy local-only gallery with filters and progressive disclosure", async () => {
  const [gallery, routeMap] = await Promise.all([
    readFile(new URL("../app/PrivateSocialGallery.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/RouteMap.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(routeMap, /process\.env\.NEXT_PUBLIC_PRIVATE_MEDIA === "1"/);
  assert.match(routeMap, /PrivateSocialGallery/);
  assert.match(gallery, /LOCAL PRIVATE/);
  assert.match(gallery, /aria-label="私人图片主题筛选"/);
  assert.match(gallery, /slice\(0,\s*12\)/);
  assert.match(gallery, /loading="lazy"/);
  assert.match(gallery, /展开更多/);
  assert.match(gallery, /上一张私人图片/);
  assert.match(gallery, /下一张私人图片/);
});
