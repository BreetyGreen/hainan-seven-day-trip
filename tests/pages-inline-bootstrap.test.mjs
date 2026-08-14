import assert from "node:assert/strict";
import test from "node:test";

import { inlineInitialScripts } from "../scripts/inline-pages-bootstrap.mjs";

test("inlines same-origin Next startup scripts in document order", async () => {
  const html = [
    "<!doctype html><html><head>",
    '<script src="/hainan-seven-day-trip/_next/static/chunks/runtime.js" async=""></script>',
    '<script src="/hainan-seven-day-trip/_next/static/chunks/app.js" id="_R_" async=""></script>',
    "</head><body></body></html>",
  ].join("");
  const sources = new Map([
    ["/_next/static/chunks/runtime.js", "globalThis.order=['runtime'];"],
    ["/_next/static/chunks/app.js", "globalThis.order.push('app');"],
  ]);

  const result = await inlineInitialScripts(html, "/hainan-seven-day-trip", async (path) => sources.get(path));

  assert.doesNotMatch(result, /<script[^>]+src=/);
  assert.match(result, /data-pages-inline-bootstrap="runtime\.js"/);
  assert.match(result, /data-pages-inline-bootstrap="app\.js"/);
  assert.ok(result.indexOf("order=['runtime']") < result.indexOf("order.push('app')"));
});

test("leaves third-party and non-script resources untouched", async () => {
  const html = '<script src="https://example.com/embed.js"></script><link href="/asset.css" rel="stylesheet">';

  const result = await inlineInitialScripts(html, "/hainan-seven-day-trip", async () => {
    throw new Error("must not resolve third-party scripts");
  });

  assert.equal(result, html);
});

test("preserves JavaScript replacement tokens and patches the real currentScript URL", async () => {
  const html = '<script src="/hainan-seven-day-trip/_next/static/chunks/runtime.js" async=""></script>';
  const source = 'globalThis.token="$&-$`-$\'";globalThis.chunk=document.currentScript.src;';

  const result = await inlineInitialScripts(html, "/hainan-seven-day-trip", async () => source);

  assert.match(result, /globalThis\.token="\$&-\$`-\$'"/);
  assert.doesNotMatch(result, /<script[^>]+src=/);
  assert.doesNotMatch(result, /<script type="module"/);
  assert.match(result, /const __pagesInlineScript=document\.currentScript/);
  assert.match(result, /__pagesInlineScript\.getAttribute=\(name\)=>name==="src"/);
  assert.match(result, /name==="src"\?"\/hainan-seven-day-trip\/_next\/static\/chunks\/runtime\.js"/);
  assert.match(result, /new URL\("\/hainan-seven-day-trip\/_next\/static\/chunks\/runtime\.js",document\.baseURI\)\.href/);
});

test("keeps oversized framework chunks external and raises their fetch priority", async () => {
  const html = [
    '<script src="/hainan-seven-day-trip/_next/static/chunks/framework.js" async=""></script>',
    '<script src="/hainan-seven-day-trip/_next/static/chunks/app.js" async=""></script>',
  ].join("");
  const sources = new Map([
    ["/_next/static/chunks/framework.js", "x".repeat(20)],
    ["/_next/static/chunks/app.js", "app();"],
  ]);

  const result = await inlineInitialScripts(
    html,
    "/hainan-seven-day-trip",
    async (path) => sources.get(path),
    { maxInlineBytes: 10 },
  );

  assert.match(result, /framework\.js" async="" fetchpriority="high"><\/script>/);
  assert.match(result, /data-pages-inline-bootstrap="app\.js"/);
});
