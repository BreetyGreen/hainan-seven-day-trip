import assert from "node:assert/strict";
import test from "node:test";

test("covers eating, clothing, lodging, transport, and activities on every day of both plans", async () => {
  const { recommendationsForDay, tripRecommendations } = await import("../app/trip-recommendations.ts");

  assert.equal(tripRecommendations.length, 70);
  for (const planId of ["A", "B"]) {
    for (let dayId = 1; dayId <= 7; dayId += 1) {
      const guide = recommendationsForDay(dayId, planId);
      assert.deepEqual(new Set(guide.items.map((item) => item.category)), new Set(["吃", "穿", "住", "行", "玩"]));
      assert.ok(guide.items.every((item) => item.evidenceIds.length >= 2));
      assert.ok(guide.items.every((item) => item.actions.length >= 2));
    }
  }
});

test("links every recommendation to real evidence records", async () => {
  const [{ tripRecommendations }, { researchEvidence }] = await Promise.all([
    import("../app/trip-recommendations.ts"),
    import("../app/research-evidence.ts"),
  ]);
  const ids = new Set(researchEvidence.map((item) => item.sourceId));

  for (const item of tripRecommendations) {
    for (const evidenceId of item.evidenceIds) assert.ok(ids.has(evidenceId), `${item.id} has missing evidence ${evidenceId}`);
  }
});

test("keeps three hotel bases and gives every selected hotel three evidence types", async () => {
  const [{ hotelDecisionProfiles }, { itineraryPlans }, { evidenceForEntity }] = await Promise.all([
    import("../app/trip-recommendations.ts"),
    import("../app/trip-data.ts"),
    import("../app/research-evidence.ts"),
  ]);

  assert.equal(hotelDecisionProfiles.length, 6);
  for (const plan of itineraryPlans) {
    assert.equal(plan.hotels.length, 3);
    assert.deepEqual(plan.hotels.map((hotel) => hotel.city), ["海口", "万宁", "陵水"]);
  }
  for (const hotel of hotelDecisionProfiles) {
    const types = new Set(evidenceForEntity(hotel.id).map((item) => item.sourceType));
    assert.ok(types.has("小红书"));
    assert.ok(types.has("地图"));
    assert.ok(types.has("酒店官网") || types.has("携程"));
  }
});

test("builds an evidence-backed four-bay Sanya comparison without adding a fourth base", async () => {
  const { sanyaBayGuide } = await import("../app/trip-recommendations.ts");

  assert.deepEqual(sanyaBayGuide.map((bay) => bay.name), ["三亚湾", "大东海", "亚龙湾", "海棠湾"]);
  assert.ok(sanyaBayGuide.every((bay) => bay.evidenceIds.length >= 2));
  assert.ok(sanyaBayGuide.every((bay) => Number.isFinite(bay.coordinates.lat) && Number.isFinite(bay.coordinates.lng)));
});
