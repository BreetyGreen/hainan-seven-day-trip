import assert from "node:assert/strict";
import test from "node:test";

import { getDayLegs, getLegAfter, modeLabel } from "../app/trip-legs.ts";

test("resolves repeated hotel stops by route index", () => {
  const legs = getDayLegs(3);
  assert.equal(legs.length, 2);
  assert.equal(legs[0].fromIndex, 0);
  assert.equal(legs.at(-1).toIndex, 2);
  assert.equal(getLegAfter(3, 1), legs[1]);
});

test("formats transport modes for map badges", () => {
  assert.equal(modeLabel("flight"), "✈ 航班");
  assert.equal(modeLabel("drive"), "🚙 自驾");
  assert.equal(modeLabel("walk"), "步行");
  assert.equal(modeLabel("boat"), "乘船");
});
