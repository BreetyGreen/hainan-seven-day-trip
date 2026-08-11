import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Hainan map-first trip", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="zh-CN"/i);
  assert.match(html, /<title>海南东线七日地图/);
  assert.match(html, /武汉 → 海南/);
  assert.match(html, /海口/);
  assert.match(html, /万宁/);
  assert.match(html, /陵水/);
  assert.match(html, /三亚/);
  assert.match(html, /一人/);
  assert.match(html, /二人/);
  assert.match(html, /旅程地图/);
  assert.match(html, /全程路线/);
  assert.match(html, /只换一次酒店/);
  assert.match(html, /点击地图节点/);
  assert.match(html, /九月怎么穿/);
  assert.match(html, /小红书原笔记/);
  assert.match(html, /DAY 4 唯一换宿/);
  assert.match(html, /为什么选它/);
  assert.match(html, /入住提醒/);
  assert.match(html, /\/hainan\/grand-hyatt-wanning-xhs\.webp/);
  assert.match(html, /\/hainan\/grand-hyatt-sanya-xhs\.webp/);
  assert.doesNotMatch(html, /预算账本|预算|普洱|景迈山/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Codex is working/i);
});

test("keeps the map controls accessible and removes starter artifacts", async () => {
  const [page, routeMap, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/RouteMap.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /aria-live/);
  assert.match(page, /aria-pressed/);
  assert.match(page, /<RouteMap/);
  assert.match(page, /useState<number \| null>\(null\)/);
  assert.match(page, /journey-shell/);
  assert.match(page, /selectedDay/);
  assert.doesNotMatch(page, /selectedPlaceId|step-sheet|onSelectPlace/);
  assert.doesNotMatch(routeMap, /bindPopup/);
  assert.match(routeMap, /transport-icon/);
  assert.match(routeMap, /hotel-change-marker/);
  assert.match(routeMap, /mode === "flight"/);
  assert.match(routeMap, /\.on\("click"/);
  assert.match(routeMap, /updateWhenZooming:\s*false/);
  assert.match(routeMap, /wheelDebounceTime:\s*60/);
  assert.match(routeMap, /fadeAnimation:\s*true/);
  assert.match(routeMap, /const routeRenderer = L\.canvas/);
  assert.match(routeMap, /renderer:\s*routeRenderer/);
  assert.match(routeMap, /map\.on\("zoomstart"/);
  assert.match(routeMap, /is-map-zooming/);
  assert.doesNotMatch(routeMap, /getTotalLength|strokeDasharray|strokeDashoffset/);
  assert.match(routeMap, /createPlaybackPlan/);
  assert.match(routeMap, /requestAnimationFrame/);
  assert.match(routeMap, /createPane\("playbackPane"\)/);
  assert.match(routeMap, /panTo/);
  assert.doesNotMatch(routeMap, /panInside/);
  assert.match(routeMap, /flyTo/);
  assert.match(routeMap, /autoplayStartedRef/);
  assert.match(routeMap, /prefers-reduced-motion:\s*reduce/);
  assert.match(routeMap, /playback-timeline/);
  assert.match(routeMap, /playback-stop-card/);
  assert.match(routeMap, /role="dialog"/);
  assert.match(routeMap, /aria-modal="true"/);
  assert.match(routeMap, /查看完整图文/);
  assert.match(routeMap, /资料来源/);
  assert.match(routeMap, /openPlaceDetail/);
  assert.match(routeMap, /className="playback-day-button"/);
  assert.match(routeMap, /onClick=\{\(\) => openDayDetail/);
  assert.match(routeMap, /journey-camera-lock/);
  assert.match(routeMap, /播放|暂停/);
  assert.match(routeMap, /继续/);
  assert.match(routeMap, /重播/);
  assert.match(layout, /lang="zh-CN"/);
  assert.match(layout, /海南东线七日地图/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /\.hotel-story/);
  assert.match(css, /\.transport-icon/);
  assert.match(css, /\.hotel-change-marker/);
  assert.match(css, /\.map-marker-wrap:hover \.map-marker/);
  assert.match(css, /\.transport-icon-wrap[^}]*pointer-events:\s*none/s);
  assert.match(css, /@keyframes detail-panel-enter/);
  assert.match(css, /journey-shell:has\(\.place-detail-backdrop\)/);
  assert.match(css, /\.hotel-story\s*\{[^}]*grid-template-columns:/s);
  assert.match(css, /@media \(max-height:\s*820px\) and \(min-width:\s*821px\)/);
  assert.doesNotMatch(css, /\.map-marker:hover\s*\{[^}]*rotate\(-45deg\)/s);
  assert.doesNotMatch(css, /\.leaflet-popup-content\s*\{[^}]*width:\s*auto\s*!important/s);
  assert.doesNotMatch(css, /\.leaflet-tile-pane\s*\{[^}]*filter:/s);
  assert.match(css, /\.leaflet-zoom-anim \.leaflet-zoom-animated\s*\{[^}]*transition:\s*transform \.25s/s);
  assert.match(css, /canvas\.leaflet-zoom-animated\s*\{[^}]*will-change:\s*transform/s);
  assert.match(css, /\.route-map-canvas\.is-map-zooming \.map-marker/s);
  assert.match(css, /\.route-map-canvas\.is-map-zooming \.transport-icon-wrap/s);
  assert.match(css, /@keyframes route-replay/);
  assert.match(css, /\.playback-timeline/);
  assert.match(css, /\.playback-stop-card/);
  assert.match(css, /\.place-detail-backdrop/);
  assert.match(css, /\.place-detail-panel/);
  assert.match(css, /\.playback-day-button/);
  assert.match(css, /\.leaflet-tooltip\s*\{[^}]*position:\s*absolute[^}]*white-space:\s*nowrap/s);
  assert.match(css, /\.journey-camera-lock\s*\{[^}]*left:\s*50%[^}]*top:\s*50%[^}]*transform:\s*translate\(-50%,-50%\)/s);
  assert.match(css, /data-playback-status="playing"[^}]*\.journey-card\s*\{[^}]*opacity:\s*0[^}]*pointer-events:\s*none/s);
  assert.match(css, /data-playback-status="paused"[^}]*\.journey-card\s*\{[^}]*opacity:\s*0[^}]*pointer-events:\s*none/s);
  assert.match(css, /\.activity-motion-transport/);
  assert.match(css, /\.activity-motion-explore/);
  assert.match(css, /\.activity-motion-meal/);
  assert.match(css, /\.activity-motion-rest/);
  assert.match(css, /@keyframes travel-flow/);
  assert.match(css, /@keyframes explore-pulse/);
  assert.match(css, /@keyframes meal-steam/);
  assert.match(css, /@keyframes rest-breathe/);
  assert.match(css, /\.journey-shell:has\(\.place-detail-backdrop\) \.journey-card\s*\{[^}]*opacity:\s*0/s);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview|codex-preview/);

  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
  await assert.rejects(access(new URL("../public/_sites-preview", templateRoot)));
});
