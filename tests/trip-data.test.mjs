import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  budgets,
  days,
  getBudget,
  getDayRoute,
  places,
} from "../app/trip-data.ts";

test("defines a complete seven-day trip", () => {
  assert.equal(days.length, 7);
  assert.deepEqual(
    days.map((day) => day.id),
    [1, 2, 3, 4, 5, 6, 7],
  );

  for (const day of days) {
    assert.ok(day.title.length > 0);
    assert.ok(day.placeIds.length > 0);
    assert.ok(getDayRoute(day.id).length > 0);
  }
});

test("every mapped place has valid coordinates and a source", () => {
  assert.ok(places.length >= 12);

  for (const place of places) {
    assert.ok(place.coordinates.lat >= -90 && place.coordinates.lat <= 90);
    assert.ok(place.coordinates.lng >= -180 && place.coordinates.lng <= 180);
    assert.match(place.sourceUrl, /^https:\/\//);
    assert.match(place.verifiedAt, /^2026-08-\d{2}$/);
  }
});

test("budget totals are derived from their line items", () => {
  for (const mode of ["solo", "duo"]) {
    const budget = getBudget(mode);
    const expectedMin = budget.items.reduce((sum, item) => sum + item.min, 0);
    const expectedMax = budget.items.reduce((sum, item) => sum + item.max, 0);

    assert.equal(budget.total.min, expectedMin);
    assert.equal(budget.total.max, expectedMax);
  }

  assert.equal(budgets.duo.people, 2);
  assert.ok(budgets.solo.total.max <= 8000);
  assert.ok(budgets.duo.total.max <= 16000);
});

test("ships a local route feature for every day", async () => {
  const raw = await readFile(
    new URL("../public/routes/puer-loop.geojson", import.meta.url),
    "utf8",
  );
  const routeData = JSON.parse(raw);

  assert.equal(routeData.type, "FeatureCollection");
  assert.equal(routeData.features.length, 7);
  assert.deepEqual(
    routeData.features.map((feature) => feature.properties.dayId),
    [1, 2, 3, 4, 5, 6, 7],
  );

  for (const feature of routeData.features) {
    assert.equal(feature.geometry.type, "LineString");
    assert.ok(feature.geometry.coordinates.length >= 2);
    assert.ok(["flight-rail", "drive"].includes(feature.properties.mode));
  }
});
