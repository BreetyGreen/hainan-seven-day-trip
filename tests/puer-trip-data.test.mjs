import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

import { days, getDayRoute, places, roadWarning, stayAlternatives } from "../app/trip-data.ts";

test("defines the complete Wuhan to Puer seven-day route", () => {
  assert.equal(days.length, 7);
  assert.deepEqual(days.map((day) => day.id), [1, 2, 3, 4, 5, 6, 7]);
  assert.match(days[0].title, /武汉.*普洱/);
  assert.match(days.at(-1).title, /普洱.*武汉/);
  for (const day of days) assert.equal(getDayRoute(day.id).length, day.placeIds.length);
});

test("every editorial source is a Xiaohongshu note", () => {
  assert.ok(places.length >= 15);
  for (const place of places) {
    assert.ok(place.coordinates.lat >= -90 && place.coordinates.lat <= 90);
    assert.ok(place.coordinates.lng >= -180 && place.coordinates.lng <= 180);
    assert.match(place.sourceUrl, /^https:\/\/www\.xiaohongshu\.com\//);
    assert.ok(place.sourceAuthor.length > 0);
    assert.ok(place.sourceTitle.length > 0);
    assert.equal(place.verifiedAt, "2026-08-10");
  }
  assert.match(roadWarning.sourceUrl, /^https:\/\/www\.xiaohongshu\.com\//);
  assert.match(stayAlternatives.special.sourceUrl, /^https:\/\/www\.xiaohongshu\.com\//);
});

test("ships credited local Xiaohongshu note images", async () => {
  const imageStops = places.filter((place) => place.image);
  assert.ok(imageStops.length >= 7);
  for (const place of imageStops) {
    assert.match(place.image.src, /^\/xhs\/.+\.webp$/i);
    assert.match(place.image.noteUrl, /^https:\/\/www\.xiaohongshu\.com\//);
    assert.ok(place.image.creator.length > 0);
    await access(new URL(`../public${place.image.src}`, import.meta.url));
  }
});

test("ships a local route feature for every day", async () => {
  const raw = await readFile(new URL("../public/routes/puer-loop.geojson", import.meta.url), "utf8");
  const routeData = JSON.parse(raw);
  assert.equal(routeData.type, "FeatureCollection");
  assert.deepEqual(routeData.features.map((feature) => feature.properties.dayId), [1, 2, 3, 4, 5, 6, 7]);
  for (const feature of routeData.features) {
    assert.equal(feature.geometry.type, "LineString");
    assert.ok(feature.geometry.coordinates.length >= 2);
  }
});
