import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("renders five evidence-backed decision tabs inside every place dialog", async () => {
  const [component, routeMap] = await Promise.all([
    readFile(new URL("../app/PlaceDecisionTabs.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/RouteMap.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(component, /role="tablist"/);
  for (const category of ["吃", "穿", "住", "行", "玩"]) assert.match(component, new RegExp(category));
  assert.match(component, /evidenceForSource/);
  assert.match(routeMap, /<PlaceDecisionTabs/);
  assert.match(routeMap, /planId={plan\.id}/);
});

test("shows the four-bay hotel guide without turning Sanya into a fourth base", async () => {
  const [component, page] = await Promise.all([
    readFile(new URL("../app/SanyaBayHotelGuide.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(component, /sanyaBayGuide/);
  assert.match(component, /不是第四个住宿基地/);
  assert.match(page, /<SanyaBayHotelGuide/);
});
