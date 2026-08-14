import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("never interrupts a slow first load and keeps recovery manual", async () => {
  const [layout, recovery] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/HydrationRecovery.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /hydrationRecoveryScript/);
  assert.match(layout, /<HydrationRecovery/);
  assert.match(recovery, /document\.documentElement\.dataset\.tripHydrated/);
  assert.match(recovery, /重新连接/);
  assert.match(recovery, /window\.location\.reload/);
  assert.doesNotMatch(recovery, /_reconnect/);
  assert.doesNotMatch(recovery, /window\.location\.replace/);
  assert.doesNotMatch(recovery, /sessionStorage/);
});
