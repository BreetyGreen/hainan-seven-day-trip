import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

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

test("server-renders the Puer map-first trip", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>普洱七日慢行/);
  assert.match(html, /旅程地图/);
  assert.match(html, /沿着路线/);
  assert.match(html, /一个人走/);
  assert.match(html, /两个人走/);
  assert.match(html, /思茅智选假日酒店/);
  assert.match(html, /艾冷人家/);
  assert.match(html, /方物之外/);
  assert.match(html, /小红书博主实拍/);
  assert.match(html, /雨季路况/);
  assert.doesNotMatch(html, /预算账本|海南东线/);
});

test("keeps map controls and source links accessible", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(page, /aria-live/);
  assert.match(page, /aria-pressed/);
  assert.match(page, /<RouteMap/);
  assert.match(page, /selectedPlaceId/);
  assert.match(page, /source-link/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
});
