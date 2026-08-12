import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

test("ships a large sourced Xiaohongshu and Douyin inspiration library", async () => {
  const [source, videos] = await Promise.all([
    readFile(new URL("../app/social-gallery.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/social-videos.ts", import.meta.url), "utf8"),
  ]);
  const imageMatches = [
    ...source.matchAll(/"(\/hainan\/social-[^"]+\.webp)"/g),
    ...videos.matchAll(/poster:\s*"(\/hainan\/social-[^"]+\.webp)"/g),
  ];
  const xhsMatches = imageMatches.filter((match) => match[1].includes("social-xhs-"));
  const douyinMatches = imageMatches.filter((match) => match[1].includes("social-douyin-") || match[1].includes("social-video-douyin-"));

  assert.ok(imageMatches.length >= 55, `expected at least 55 social images, got ${imageMatches.length}`);
  assert.ok(xhsMatches.length >= 29, `expected the 29 user-supplied Xiaohongshu images, got ${xhsMatches.length}`);
  assert.ok(douyinMatches.length >= 26, `expected at least 26 Douyin covers, got ${douyinMatches.length}`);
  assert.match(source, /socialVideos\.filter\(\(video\) => video\.platform === "抖音"\)\.flatMap/);
  assert.match(source, /export type SocialCity = "海口" \| "万宁" \| "陵水" \| "三亚"/);
  assert.match(source, /\["海口", "万宁", "陵水", "三亚"\]/);
  assert.match(source, /xhslink\.cn|xiaohongshu\.com/);
  assert.match(videos, /douyin\.com\/video/);

  for (const match of imageMatches) {
    const asset = new URL(`../public${match[1]}`, import.meta.url);
    await access(asset);
    const info = await stat(asset);
    assert.ok(info.size < 260_000, `${match[1]} should stay a lightweight preview (${info.size} bytes)`);
  }
});

test("renders a separate city-level social gallery instead of mislabeling it as place photography", async () => {
  const [component, routeMap] = await Promise.all([
    readFile(new URL("../app/SocialInspirationGallery.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/RouteMap.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(component, /小红书 × 抖音灵感库/);
  assert.match(component, /城市攻略灵感，不代表当前地点实景/);
  assert.match(component, /查看原笔记|查看原视频/);
  assert.match(component, /loading="lazy"/);
  assert.match(component, /展开全部/);
  assert.match(routeMap, /SocialInspirationGallery/);
});
