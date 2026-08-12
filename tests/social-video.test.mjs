import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("curates a city-spanning social video library with official Douyin embeds", async () => {
  const source = await readFile(new URL("../app/social-videos.ts", import.meta.url), "utf8");
  const douyin = [...source.matchAll(/platform:\s*"抖音"/g)];
  const xhs = [...source.matchAll(/platform:\s*"小红书"/g)];
  const videoIds = [...source.matchAll(/videoId:\s*"(\d+)"/g)].map((match) => match[1]);

  assert.ok(douyin.length >= 10, `expected at least 10 Douyin videos, got ${douyin.length}`);
  assert.ok(xhs.length >= 4, `expected at least 4 Xiaohongshu dynamic notes, got ${xhs.length}`);
  assert.equal(new Set(videoIds).size, videoIds.length, "Douyin video ids must be unique");
  for (const city of ["海口", "万宁", "陵水", "三亚"]) assert.match(source, new RegExp(`city: "${city}"`));
  assert.match(source, /open\.douyin\.com\/player\/video/);
  assert.match(source, /xhslink\.cn|xiaohongshu\.com/);
});

test("only mounts the official player after a deliberate click and keeps Xiaohongshu honest", async () => {
  const [component, routeMap] = await Promise.all([
    readFile(new URL("../app/SocialVideoGallery.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/RouteMap.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(component, /视频旅程库/);
  assert.match(component, /useState<SocialVideo \| null>\(null\)/);
  assert.match(component, /activeVideo\?\.embedUrl/);
  assert.match(component, /loading="lazy"/);
  assert.match(component, /allowFullScreen/);
  assert.match(component, /小红书暂不提供稳定的第三方网页播放器/);
  assert.match(component, /去小红书播放/);
  assert.match(routeMap, /SocialVideoGallery/);
});
