import assert from "node:assert/strict";
import test from "node:test";

import { sampleRouteAtProgress } from "../app/trip-motion.ts";

test("samples uneven route coordinates by traveled distance", () => {
  const sample = sampleRouteAtProgress([[0, 0], [9, 0], [10, 0]], 0.5);

  assert.deepEqual(sample.point, [5, 0]);
  assert.deepEqual(sample.visibleCoordinates, [[0, 0], [5, 0]]);
  assert.equal(sample.bearing, 90);
});

test("keeps route endpoints exact", () => {
  const coordinates = [[110, 18], [110.01, 18.01], [110.02, 18.01]];

  assert.deepEqual(sampleRouteAtProgress(coordinates, 0).point, coordinates[0]);
  assert.deepEqual(sampleRouteAtProgress(coordinates, 1).point, coordinates.at(-1));
  assert.deepEqual(sampleRouteAtProgress(coordinates, 1).visibleCoordinates, coordinates);
});
