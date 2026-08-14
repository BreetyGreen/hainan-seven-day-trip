import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("recovers once when GitHub Pages serves stale HTML with replaced hashed chunks", async () => {
  const [layout, recovery] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/HydrationRecovery.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /hydrationRecoveryScript/);
  assert.match(layout, /<HydrationRecovery/);
  assert.match(recovery, /document\.documentElement\.dataset\.tripHydrated/);
  assert.match(recovery, /sessionStorage/);
  assert.match(recovery, /_reconnect/);
  assert.match(recovery, /window\.location\.replace/);
  assert.match(recovery, /重新连接/);
});
