import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("counts independent evidence sources rather than image pages", async () => {
  const { researchEvidence, researchMetrics } = await import("../app/research-evidence.ts");

  assert.ok(researchMetrics.candidateCount >= 100, `expected at least 100 candidates, got ${researchMetrics.candidateCount}`);
  assert.ok(researchMetrics.deepReadCount >= 40 && researchMetrics.deepReadCount <= 60, `expected 40-60 deep reads, got ${researchMetrics.deepReadCount}`);
  assert.equal(researchMetrics.candidateCount, researchEvidence.length);
  assert.equal(new Set(researchEvidence.map((item) => item.sourceId)).size, researchEvidence.length);
  assert.equal(new Set(researchEvidence.map((item) => item.url)).size, researchEvidence.length);
  assert.deepEqual(new Set(researchEvidence.map((item) => item.category)), new Set(["吃", "穿", "住", "行", "玩"]));
});

test("keeps the linked four-bay hotel note as one high-value source", async () => {
  const { researchEvidence } = await import("../app/research-evidence.ts");
  const note = researchEvidence.find((item) => item.sourceId === "xhs-6a7c01e500000000220162ab");

  assert.ok(note);
  assert.equal(note.sourceType, "小红书");
  assert.equal(note.media.length, 11);
  assert.equal(note.engagementSnapshot.likes, 545);
  assert.equal(note.engagementSnapshot.collects, 779);
  assert.equal(note.promoRisk.level, "高");
  assert.ok(note.entityIds.includes("haitang-bay"));
  assert.ok(note.entityIds.includes("yalong-bay"));
  assert.ok(note.entityIds.includes("dadonghai"));
  assert.ok(note.entityIds.includes("sanya-bay"));
});

test("every selected hotel has experience, official or OTA, and map evidence", async () => {
  const { evidenceForEntity } = await import("../app/research-evidence.ts");
  const selectedHotels = [
    "haikou-marriott",
    "haikou-west-coast-holiday",
    "grand-hyatt-wanning",
    "wanning-holiday-inn",
    "clearwater-indigo",
    "sangem-moon",
  ];

  for (const hotelId of selectedHotels) {
    const evidence = evidenceForEntity(hotelId);
    assert.ok(evidence.some((item) => item.sourceType === "小红书"), `${hotelId} needs an experience source`);
    assert.ok(evidence.some((item) => ["携程", "酒店官网"].includes(item.sourceType)), `${hotelId} needs hotel or OTA evidence`);
    assert.ok(evidence.some((item) => item.sourceType === "地图"), `${hotelId} needs map evidence`);
  }
});

test("ships a repeatable public-page collector and a matching snapshot", async () => {
  const script = await readFile(new URL("../scripts/collect-hainan-evidence.mjs", import.meta.url), "utf8");
  const snapshot = JSON.parse(await readFile(new URL("../build/hainan-evidence-snapshot.json", import.meta.url), "utf8"));
  const { researchMetrics } = await import("../app/research-evidence.ts");

  assert.match(script, /window\.__INITIAL_STATE__/);
  assert.match(script, /noteDetailMap/);
  assert.match(script, /sourceId/);
  assert.equal(snapshot.metrics.candidateCount, researchMetrics.candidateCount);
  assert.equal(snapshot.metrics.deepReadCount, researchMetrics.deepReadCount);
  assert.equal(snapshot.metrics.independentSourceCount, researchMetrics.independentSourceCount);
});
