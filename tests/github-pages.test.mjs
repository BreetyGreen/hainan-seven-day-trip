import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("configures a repository-scoped static GitHub Pages build", async () => {
  const [nextConfig, packageJson, workflow, paths] = await Promise.all([
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/pages.yml", import.meta.url), "utf8"),
    readFile(new URL("../app/site-paths.ts", import.meta.url), "utf8"),
  ]);

  assert.match(nextConfig, /GITHUB_PAGES/);
  assert.match(nextConfig, /output:\s*isGithubPages\s*\?\s*"export"/);
  assert.match(nextConfig, /basePath/);
  assert.match(nextConfig, /assetPrefix/);
  assert.match(packageJson, /"build:pages"/);
  assert.match(packageJson, /SINGLE_CHUNK_BUILD=1/);
  assert.match(packageJson, /next build --webpack/);
  assert.match(nextConfig, /config\.optimization\.splitChunks = false/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /npm run build:pages/);
  assert.match(workflow, /path:\s*\.\/out/);
  assert.match(paths, /NEXT_PUBLIC_BASE_PATH/);
  assert.match(paths, /withBasePath/);
});

test("routes runtime assets through the Pages base path", async () => {
  const [routeMap, tripData, layout] = await Promise.all([
    readFile(new URL("../app/RouteMap.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/trip-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(routeMap, /withBasePath\(plan\.routePath\)/);
  assert.match(routeMap, /withBasePath\(.*image\.src/);
  assert.match(tripData, /withBasePath/);
  assert.match(layout, /withBasePath\("\/favicon\.svg"\)/);
});
