import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the complete Pu'er trip planner", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="zh-CN"/i);
  assert.match(html, /<title>普洱七日慢行/);
  assert.match(html, /武汉出发/);
  assert.match(html, /一个人走/);
  assert.match(html, /两个人走/);
  assert.match(html, /抵达日/);
  assert.match(html, /返程日/);
  assert.match(html, /吃在普洱/);
  assert.match(html, /九月怎么穿/);
  assert.match(html, /住在哪里/);
  assert.match(html, /自驾规则/);
  assert.match(html, /真实地点簿/);
  assert.match(html, /预算账本/);
  assert.match(html, /太阳河/);
  assert.match(html, /景迈山/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Codex is working/i);
});

test("removes the disposable starter and uses accessible controls", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /aria-live/);
  assert.match(page, /aria-pressed/);
  assert.match(page, /<RouteMap/);
  assert.match(page, /selectedDay/);
  assert.match(page, /<main/);
  assert.match(page, /<nav/);
  assert.match(layout, /lang="zh-CN"/);
  assert.match(layout, /普洱七日慢行/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview|codex-preview/);

  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
  await assert.rejects(access(new URL("../public/_sites-preview", templateRoot)));
});
