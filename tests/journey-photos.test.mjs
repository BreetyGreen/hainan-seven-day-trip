import assert from "node:assert/strict";
import test from "node:test";

import { buildJourneyPhotoItems } from "../app/journey-photos.ts";
import { days, places } from "../app/trip-data.ts";

test("builds a compact, ordered photo journey from the real itinerary", () => {
  const items = buildJourneyPhotoItems(days, places);

  assert.ok(items.length >= 10 && items.length <= 14, `expected 10–14 journey photos, got ${items.length}`);
  assert.deepEqual(items.map((item) => item.dayId), [...items.map((item) => item.dayId)].sort((a, b) => a - b));
  assert.equal(new Set(items.map((item) => item.photo.src)).size, items.length, "the rail should not repeat the same photo");
  assert.equal(items.some((item) => item.place.category === "transport"), false);
  assert.ok(items.some((item) => item.kind === "hotel"));
  assert.ok(items.some((item) => item.kind === "place"));

  for (const item of items) {
    assert.match(item.id, /^day-\d+-/);
    assert.match(item.photo.src, /^\/hainan\/.+\.webp$/i);
    assert.match(item.photo.creditUrl, /^https:\/\//);
    assert.equal(item.place.image?.src, item.photo.src);
  }
});

test("keeps the requested Xiaohongshu hotel photography in the journey rail", () => {
  const items = buildJourneyPhotoItems(days, places);
  const wanning = items.find((item) => item.place.id === "wanning-hyatt");
  const sofitel = items.find((item) => item.place.id === "sofitel-sanya");

  assert.equal(wanning?.photo.platform, "小红书");
  assert.match(wanning?.photo.src ?? "", /grand-hyatt-wanning-xhs\.webp$/);
  assert.equal(sofitel?.photo.platform, "小红书");
  assert.match(sofitel?.photo.src ?? "", /sofitel-pool-xhs\.webp$/);
});
