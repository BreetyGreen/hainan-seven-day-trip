import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { days, places } from "../app/trip-data.ts";
import {
  createRouteContext,
  createPlaybackPlan,
  createPlaybackStages,
  playbackKindForPlace,
  requiresManualArrival,
} from "../app/trip-playback.ts";

const routeData = JSON.parse(await readFile(
  new URL("../public/routes/hainan-east-coast.geojson", import.meta.url),
  "utf8",
));

test("builds seven ordered playback days and visits every itinerary node", () => {
  const plan = createPlaybackPlan(days, places, routeData.features);

  assert.deepEqual(plan.map((day) => day.dayId), [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(
    plan.flatMap((day) => day.stops).length,
    days.reduce((total, day) => total + day.placeIds.length, 0),
  );

  for (const playbackDay of plan) {
    const sourceDay = days.find((day) => day.id === playbackDay.dayId);
    assert.deepEqual(playbackDay.stops.map((stop) => stop.place.id), sourceDay.placeIds);
    assert.equal(playbackDay.segments.length, playbackDay.stops.length - 1);
    assert.deepEqual(
      playbackDay.stops.map((stop) => stop.routeIndex),
      [...playbackDay.stops.map((stop) => stop.routeIndex)].sort((a, b) => a - b),
    );
  }
});

test("keeps animated travel segments connected, bounded, and mode-correct", () => {
  const plan = createPlaybackPlan(days, places, routeData.features);
  const segments = plan.flatMap((day) => day.segments);

  assert.equal(segments[0].mode, "flight");
  assert.equal(segments.at(-1).mode, "flight");
  assert.ok(segments.some((segment) => segment.mode === "drive"));

  for (const playbackDay of plan) {
    for (let index = 0; index < playbackDay.segments.length; index += 1) {
      const segment = playbackDay.segments[index];
      assert.ok(segment.coordinates.length >= 2);
      assert.ok(segment.coordinates.length <= 140, "animation must not redraw thousands of raw points per frame");
      assert.ok(segment.durationMs >= 2400 && segment.durationMs <= 4200);
      assert.equal(segment.from.place.id, playbackDay.stops[index].place.id);
      assert.equal(segment.to.place.id, playbackDay.stops[index + 1].place.id);
    }
  }
});

test("gives visible movement enough time to read as travel rather than a jump", () => {
  const segments = createPlaybackPlan(days, places, routeData.features).flatMap((day) => day.segments);
  const firstFlight = segments.find((segment) => segment.mode === "flight");
  const sanyaCityDrive = segments.find((segment) => segment.from.place.id === "xiaodonghai" && segment.to.place.id === "banshan-marina");

  assert.equal(firstFlight.durationMs, 4200);
  assert.ok(sanyaCityDrive.durationMs >= 2400);
});

test("keeps the Haikou hotel visit, Qilou stop, and hotel return on distinct route positions", () => {
  const dayOne = createPlaybackPlan(days, places, routeData.features).find((day) => day.dayId === 1);
  const localStops = dayOne.stops.slice(2);
  const localSegments = dayOne.segments.slice(2);

  assert.deepEqual(localStops.map((stop) => stop.place.id), [
    "haikou-qilou-atour",
    "qilou",
    "haikou-qilou-atour",
  ]);
  assert.ok(localStops[0].routeIndex < localStops[1].routeIndex);
  assert.ok(localStops[1].routeIndex < localStops[2].routeIndex);
  for (const segment of localSegments) {
    assert.notDeepEqual(segment.coordinates[0], segment.coordinates.at(-1));
  }
});

test("maps real itinerary places to transport, explore, meal, and rest choreography", () => {
  const kinds = new Set(places.map(playbackKindForPlace));
  assert.deepEqual([...kinds].sort(), ["explore", "rest", "transport"]);

  assert.equal(playbackKindForPlace(places.find((place) => place.id === "haikou-airport")), "transport");
  assert.equal(playbackKindForPlace(places.find((place) => place.id === "sangem-moon")), "rest");
  assert.equal(playbackKindForPlace(places.find((place) => place.id === "xiaodonghai")), "explore");
});

test("creates an alternating stop and travel timeline for the animation loop", () => {
  const plan = createPlaybackPlan(days, places, routeData.features);
  const stages = createPlaybackStages(plan);
  const stopCount = plan.flatMap((day) => day.stops).length;
  const segmentCount = plan.flatMap((day) => day.segments).length;

  assert.equal(stages.length, stopCount + segmentCount);
  assert.equal(stages[0].type, "stop");
  assert.equal(stages[0].stop.place.id, "wuhan-airport");
  assert.equal(stages[1].type, "travel");
  assert.equal(stages[1].segment.from.place.id, "wuhan-airport");
  assert.equal(stages[1].segment.to.place.id, "haikou-airport");
  assert.equal(stages.at(-1).type, "stop");
  assert.equal(stages.at(-1).stop.place.id, "wuhan-airport");
  assert.equal(stages.at(-1).stopNumber, stopCount);
});

test("pauses only at meaningful arrivals and the first visit to each hotel base", () => {
  const byId = (id) => places.find((place) => place.id === id);

  assert.equal(requiresManualArrival(byId("wuhan-airport"), new Set()), false);
  assert.equal(requiresManualArrival(byId("xiaodonghai"), new Set()), true);
  assert.equal(requiresManualArrival(byId("xincun-port"), new Set()), true);
  assert.equal(requiresManualArrival(byId("sangem-moon"), new Set()), true);
  assert.equal(requiresManualArrival(byId("sangem-moon"), new Set(["sangem-moon"])), false);
  assert.equal(requiresManualArrival(byId("sofitel-sanya"), new Set(["sangem-moon"])), true);
});

test("builds exact previous-current-next context for a middle arrival", () => {
  const day = createPlaybackPlan(days, places, routeData.features).find((item) => item.dayId === 6);
  const context = createRouteContext(day, 2);

  assert.equal(context.position, 3);
  assert.equal(context.total, 5);
  assert.equal(context.previous.place.id, "xiaodonghai");
  assert.equal(context.current.place.id, "banshan-marina");
  assert.equal(context.next.place.id, "luhuitou");
  assert.deepEqual(context.remaining.map((stop) => stop.place.id), ["luhuitou", "sofitel-sanya"]);
  assert.equal(context.nextMode, "drive");
});

test("keeps repeated hotel occurrences and final stops unambiguous", () => {
  const plan = createPlaybackPlan(days, places, routeData.features);
  const dayThree = plan.find((item) => item.dayId === 3);
  const finalHotel = createRouteContext(dayThree, 2);
  const firstHotel = createRouteContext(dayThree, 0);

  assert.equal(firstHotel.current.place.id, "sangem-moon");
  assert.equal(firstHotel.next.place.id, "xincun-port");
  assert.equal(finalHotel.current.place.id, "sangem-moon");
  assert.equal(finalHotel.previous.place.id, "xincun-port");
  assert.equal(finalHotel.next, null);
  assert.deepEqual(finalHotel.remaining, []);
  assert.equal(finalHotel.nextMode, null);
});
