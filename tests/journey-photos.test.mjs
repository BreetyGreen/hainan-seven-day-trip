import assert from "node:assert/strict";
import test from "node:test";

import { buildJourneyPhotoItems } from "../app/journey-photos.ts";
import { days, itineraryPlans, places } from "../app/trip-data.ts";

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
    assert.ok([item.place.image, ...(item.place.gallery ?? [])].some((photo) => photo?.src === item.photo.src));
  }
});

test("uses high-quality real hotel images and adds secondary views without repeating files", () => {
  const items = buildJourneyPhotoItems(days, places);
  const wanning = items.find((item) => item.place.id === "yuyue-artia");
  const hongyuanViews = items.filter((item) => item.place.id === "hongyuan-crest");

  assert.equal(wanning?.photo.platform, "携程");
  assert.match(wanning?.photo.src ?? "", /yuyue-artia-aerial-ctrip\.webp$/);
  assert.equal(hongyuanViews.length, 2);
  assert.ok(items.some((item) => item.photo.platform === "小红书"), "real Xiaohongshu place photography remains in the rail");
});

test("Plan B also keeps at least ten curated photos including the Grand Hyatt pool", () => {
  const planB = itineraryPlans.find((plan) => plan.id === "B");
  const items = buildJourneyPhotoItems(planB.schedule, places);

  assert.ok(items.length >= 10);
  assert.ok(items.some((item) => /grand-hyatt-wanning-pool-official\.webp$/.test(item.photo.src)));
});
