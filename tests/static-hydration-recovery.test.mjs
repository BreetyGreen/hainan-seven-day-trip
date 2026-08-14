import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("does not mutate React-owned status markup before hydration", async () => {
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(layout, /hydrationRecoveryScript/);
  assert.doesNotMatch(layout, /<HydrationRecovery/);
  assert.doesNotMatch(layout, /dangerouslySetInnerHTML/);
});
