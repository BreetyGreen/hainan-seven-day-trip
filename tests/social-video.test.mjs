import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("curates a city-spanning social video library with official Douyin embeds", async () => {
  const source = await readFile(new URL("../app/social-videos.ts", import.meta.url), "utf8");
  const douyin = [...source.matchAll(/platform:\s*"抖音"/g)];
  const xhs = [...source.matchAll(/platform:\s*"小红书"/g)];
  const videoIds = [...source.matchAll(/videoId:\s*"(\d+)"/g)].map((match) => match[1]);
  const themes = [...source.matchAll(/theme:\s*"([^"]+)"/g)].map((match) => match[1]);

  assert.ok(douyin.length >= 26, `expected at least 26 Douyin videos, got ${douyin.length}`);
  assert.ok(xhs.length >= 4, `expected at least 4 Xiaohongshu dynamic notes, got ${xhs.length}`);
  assert.ok(themes.length >= 30, `expected a theme on all 30 entries, got ${themes.length}`);
  assert.deepEqual(new Set(themes), new Set(["路线", "海岸", "酒店", "吃喝", "实用"]));
  assert.equal(new Set(videoIds).size, videoIds.length, "Douyin video ids must be unique");
  for (const [city, minimum] of [["海口", 5], ["万宁", 5], ["陵水", 8], ["三亚", 8]]) {
    const count = [...source.matchAll(new RegExp(`city: "${city}"`, "g"))].length;
    assert.ok(count >= minimum, `${city} should have at least ${minimum} entries, got ${count}`);
  }
  assert.match(source, /open\.douyin\.com\/player\/video/);
  assert.match(source, /xhslink\.cn|xiaohongshu\.com/);
});

test("only mounts the official player after a deliberate click and keeps Xiaohongshu honest", async () => {
  const [component, viewer, routeMap] = await Promise.all([
    readFile(new URL("../app/SocialVideoGallery.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/SocialVideoViewer.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/RouteMap.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(component, /视频旅程库/);
  assert.match(component, /aria-label="视频主题筛选"/);
  assert.match(component, /展开全部/);
  assert.match(component, /收起/);
  assert.match(component, /slice\(0,\s*6\)/);
  assert.match(component, /useState<SocialVideo \| null>\(null\)/);
  assert.match(viewer, /video\.embedUrl/);
  assert.match(viewer, /loading="lazy"/);
  assert.match(viewer, /allowFullScreen/);
  assert.match(viewer, /小红书暂不提供稳定的第三方网页播放器/);
  assert.match(viewer, /去小红书播放/);
  assert.match(routeMap, /SocialVideoGallery/);
});

test("opens social videos in an independent accessible viewer", async () => {
  const [gallery, viewer] = await Promise.all([
    readFile(new URL("../app/SocialVideoGallery.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/SocialVideoViewer.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(gallery, /SocialVideoViewer/);
  assert.match(viewer, /createPortal/);
  assert.match(viewer, /role="dialog"/);
  assert.match(viewer, /aria-modal="true"/);
  assert.match(viewer, /document\.body\.style\.overflow\s*=\s*"hidden"/);
  assert.match(viewer, /event\.key === "Escape"/);
  assert.match(viewer, /aria-label="上一个视频"/);
  assert.match(viewer, /aria-label="下一个视频"/);
});

test("gives the social video viewer a full-screen touch-friendly mobile layout", async () => {
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(styles, /\.social-video-viewer-backdrop\s*\{[^}]*position:\s*fixed[^}]*inset:\s*0/s);
  assert.match(styles, /@media\s*\(max-width:\s*820px\)[\s\S]*\.social-video-viewer\s*\{[^}]*height:\s*100dvh/s);
  assert.match(styles, /safe-area-inset-top/);
  assert.match(styles, /safe-area-inset-bottom/);
  assert.match(styles, /\.social-video-viewer-actions[^}]*min-height:\s*44px/s);
});
