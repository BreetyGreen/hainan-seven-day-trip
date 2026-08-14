import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

import {
  calculatePlanBudget,
  days,
  getDayRoute,
  hotels,
  itineraryPlans,
  places,
} from "../app/trip-data.ts";
import {
  dayGuides,
  researchSummary,
  userResearchSources,
} from "../app/trip-details.ts";

test("defines the complete Wuhan to Hainan seven-day route", () => {
  assert.equal(days.length, 7);
  assert.deepEqual(days.map((day) => day.id), [1, 2, 3, 4, 5, 6, 7]);
  assert.match(days[0].title, /武汉.*海口/);
  assert.match(days.at(-1).title, /三亚.*武汉/);

  for (const day of days) {
    assert.ok(day.title.length > 0);
    assert.ok(day.placeIds.length > 0);
    assert.equal(getDayRoute(day.id).length, day.placeIds.length);
    assert.equal(day.legs.length, day.placeIds.length - 1);
  }
});

test("every mapped point is a sourced real Hainan or Wuhan place", () => {
  assert.ok(places.length >= 12);
  const ids = new Set(places.map((place) => place.id));
  assert.equal(ids.size, places.length);

  for (const day of days) {
    for (const placeId of day.placeIds) assert.ok(ids.has(placeId));
  }

  for (const place of places) {
    const isWuhan = place.id === "wuhan-airport";
    if (isWuhan) {
      assert.ok(place.coordinates.lat > 30 && place.coordinates.lat < 31);
      assert.ok(place.coordinates.lng > 114 && place.coordinates.lng < 115);
    } else {
      assert.ok(place.coordinates.lat > 18 && place.coordinates.lat < 21);
      assert.ok(place.coordinates.lng > 109 && place.coordinates.lng < 111);
    }
    assert.match(place.sourceUrl, /^https:\/\//);
    assert.match(place.verifiedAt, /^2026-08-11$/);
  }
});

test("hotel recommendations keep official and visual evidence", async () => {
  assert.equal(hotels.length, 3, "the trip must use three overnight bases and at most two hotel changes");
  assert.deepEqual(hotels.map((hotel) => hotel.checkInDay), [1, 2, 4]);

  for (const hotel of hotels) {
    assert.ok(hotel.opened >= 2024, `${hotel.name} must be a 2024+ Plan A hotel`);
    assert.ok(hotel.reasons.length >= 2);
    assert.ok(hotel.cautions.length >= 1);
    assert.match(hotel.officialUrl, /^https:\/\//);
    assert.match(hotel.xhsSource.url, /^https:\/\//);
    assert.ok(hotel.xhsSource.author.length > 0);
    assert.ok(hotel.xhsSource.title.length > 0);
    assert.match(hotel.image.src, /^\/hainan\/.+\.webp$/i);
    assert.match(hotel.image.creditUrl, /^https:\/\//);
    await access(new URL(`../public${hotel.image.src}`, import.meta.url));

    const photos = [hotel.image, ...(hotel.gallery ?? [])];
    assert.ok(photos.length >= 3, `${hotel.name} needs at least three matched hotel photos`);
    assert.equal(new Set(photos.map((photo) => photo.src)).size, photos.length);
    for (const photo of photos) await access(new URL(`../public${photo.src}`, import.meta.url));
  }
});

test("uses one Haikou night, two Wanning nights, and three Lingshui nights", () => {
  const overnightBases = new Set(days.slice(0, 6).map((day) => day.sleep));
  assert.equal(overnightBases.size, 3);
  assert.deepEqual([...overnightBases], [
    "海口鸿园酒店公寓·雅诗阁臻选",
    "万宁日月湾中旅逐浪屿玥酒店",
    "海南清水湾金普顿酒店",
  ]);
  assert.deepEqual(days.filter((day) => day.isHotelChange).map((day) => day.id), [2, 4]);
  assert.equal(days.filter((day) => /换宿/.test(day.pace)).length, 2);
  assert.equal(places.some((place) => place.city === "万宁"), true);
  assert.equal(hotels.some((hotel) => hotel.city === "万宁"), true);
  assert.deepEqual(days.slice(0, 6).map((day) => day.city), ["海口", "万宁", "万宁", "陵水", "陵水", "陵水"]);
  assert.deepEqual(hotels.map((hotel) => hotel.id), ["hongyuan-crest", "yuyue-artia", "kimpton-clearwater"]);
  assert.deepEqual(hotels.map((hotel) => hotel.opened), [2024, 2025, 2025]);
  assert.match(hotels.find((hotel) => hotel.id === "yuyue-artia")?.fit ?? "", /日月湾|海景|安静/);
  assert.match(hotels[0].fit, /江东|海景|安静/);
});

test("offers complete and visually distinct Plan A and Plan B itineraries", () => {
  assert.deepEqual(itineraryPlans.map((plan) => plan.id), ["A", "B"]);
  assert.equal(new Set(itineraryPlans.map((plan) => plan.color)).size, 2);

  for (const plan of itineraryPlans) {
    assert.equal(plan.days.length, 7);
    assert.deepEqual(plan.days.map((day) => day.dayId), [1, 2, 3, 4, 5, 6, 7]);
    assert.match(plan.days.map((day) => `${day.title}${day.summary}${day.highlights.join("")}`).join(""), /万宁/);
    assert.equal(plan.schedule.length, 7, `${plan.id} needs its own seven-day schedule`);
    assert.equal(plan.hotels.length, 3, `${plan.id} needs exactly three hotel bases`);
    assert.deepEqual(plan.hotels.map((hotel) => hotel.checkInDay), [1, 2, 4]);
    assert.deepEqual(plan.schedule.filter((day) => day.isHotelChange).map((day) => day.id), [2, 4]);
    assert.equal(plan.schedule[5].isHotelChange, undefined, "Day 6 must return to the Lingshui base instead of changing hotel");
    assert.equal(plan.schedule[5].sleep, plan.hotels[2].name);
    assert.match(plan.routePath, /^\/routes\/hainan-plan-[ab]\.geojson$/);
  }

  const planA = itineraryPlans.find((plan) => plan.id === "A");
  const planB = itineraryPlans.find((plan) => plan.id === "B");
  assert.deepEqual(planA?.hotels.map((hotel) => hotel.id), ["hongyuan-crest", "yuyue-artia", "kimpton-clearwater"]);
  assert.deepEqual(planB?.hotels.map((hotel) => hotel.id), ["haikou-marriott", "grand-hyatt-wanning", "sangem-moon"]);
  assert.match(`${planA?.name}${planA?.description}`, /晴天|海岸/);
  assert.match(planA?.days.find((day) => day.dayId === 3)?.summary ?? "", /海岸|石梅湾|神州半岛/);
  assert.match(`${planB?.name}${planB?.description}`, /雨天|酒店|免税/);
  assert.match(planB?.days.find((day) => day.dayId === 3)?.summary ?? "", /酒店|兴隆|雨/);
  assert.match(planB?.days.find((day) => day.dayId === 6)?.summary ?? "", /免税/);

  assert.notDeepEqual(
    planA?.hotels.map((hotel) => hotel.id),
    planB?.hotels.map((hotel) => hotel.id),
    "Plan A and Plan B must not render the same hotel list",
  );
  assert.notDeepEqual(
    planA?.schedule.flatMap((day) => day.placeIds),
    planB?.schedule.flatMap((day) => day.placeIds),
    "Plan A and Plan B must not render the same map nodes",
  );
  assert.equal(planA?.hotels[0].city, "海口");
  assert.match(planA?.hotels[0].fit ?? "", /江东|海景|安静/);
  assert.equal(planB?.hotels[0].city, "海口");
  assert.match(planB?.hotels[0].fit ?? "", /西海岸|海景|安静/);
  assert.notEqual(planA?.routePath, planB?.routePath);
  assert.equal(planA?.schedule[2].placeIds.includes("shimei-bay"), true);
  assert.equal(planB?.schedule[2].placeIds.includes("xinglong-garden"), true);
  assert.equal(planB?.schedule[3].placeIds.includes("sangem-moon"), true);
  assert.equal(planB?.schedule[3].placeIds.includes("xincun-port"), false);
});

test("calculates a transparent September budget for one or two travelers", () => {
  for (const plan of itineraryPlans) {
    assert.equal(plan.budget.target, 8000);
    assert.deepEqual(plan.budget.items.map((item) => item.id), ["flights", "hotels", "car", "food", "activities", "buffer"]);

    const solo = calculatePlanBudget(plan, "solo");
    const duo = calculatePlanBudget(plan, "duo");
    assert.equal(solo.travelers, 1);
    assert.equal(duo.travelers, 2);
    assert.ok(solo.total.min > plan.budget.target);
    assert.ok(duo.total.min > solo.total.min);
    assert.ok(duo.perPerson.min < duo.total.min);

    const perPersonMinimum = plan.budget.items
      .filter((item) => item.sharing === "per-person")
      .reduce((sum, item) => sum + item.range.min, 0);
    assert.equal(duo.total.min - solo.total.min, perPersonMinimum);
    assert.equal(duo.overTarget.min, duo.total.min - plan.budget.target);
  }
});

test("both plan route files exist and contain different geometry", async () => {
  const routeTexts = await Promise.all(itineraryPlans.map(async (plan) => {
    const routeUrl = new URL(`../public${plan.routePath}`, import.meta.url);
    await access(routeUrl);
    return readFile(routeUrl, "utf8");
  }));

  assert.notEqual(routeTexts[0], routeTexts[1]);
});

test("every activity point contains specific playable instructions", () => {
  const activityPlaces = places.filter((place) => !["transport", "stay"].includes(place.category));
  assert.ok(activityPlaces.length >= 6);

  for (const place of activityPlaces) {
    assert.ok(place.activity.time.length > 0, `${place.name} needs a time`);
    assert.ok(place.activity.duration.length > 0, `${place.name} needs a duration`);
    assert.ok(place.activity.steps.length >= 2, `${place.name} needs concrete steps`);
    assert.ok(place.activity.practical.length >= 1, `${place.name} needs practical advice`);
    assert.match(place.activity.source.url, /^https:\/\//);
    assert.ok(place.activity.source.title.length > 0);
  }
});

test("ships local verified images with attribution", async () => {
  const imageStops = places.filter((place) => place.image);
  assert.ok(imageStops.length >= 9, `expected at least 9 matched place images, got ${imageStops.length}`);

  for (const place of imageStops) {
    assert.match(place.image.src, /^\/hainan\/.+\.webp$/i);
    assert.ok(["小红书", "官网", "携程", "媒体"].includes(place.image.platform));
    assert.match(place.image.creditUrl, /^https:\/\//);
    assert.ok(place.image.credit.length > 0);
    await access(new URL(`../public${place.image.src}`, import.meta.url));
  }
});

test("signature places tell a sourced story with at least three distinct photos", async () => {
  const signaturePlaceIds = ["shimei-bay", "xincun-port", "xinglong-garden"];

  for (const placeId of signaturePlaceIds) {
    const place = places.find((item) => item.id === placeId);
    assert.ok(place?.image, `${placeId} needs a primary image`);
    const photos = [place.image, ...(place.gallery ?? [])];
    assert.ok(photos.length >= 3, `${placeId} needs at least three photos`);
    assert.equal(new Set(photos.map((photo) => photo.src)).size, photos.length, `${placeId} photos must be unique`);

    for (const photo of photos) {
      assert.match(photo.src, /^\/hainan\/.+\.webp$/i);
      assert.match(photo.creditUrl, /^https:\/\//);
      assert.ok(photo.noteTitle.length > 0);
      await access(new URL(`../public${photo.src}`, import.meta.url));
    }
  }
});

test("every meaningful activity stop has a matching local image", async () => {
  const activityStops = places.filter((place) => !["transport", "stay"].includes(place.category));
  const missing = activityStops.filter((place) => !place.image).map((place) => place.id);
  assert.deepEqual(missing, []);

  for (const place of activityStops) {
    assert.match(place.image.alt, new RegExp(place.shortName.slice(0, 2)));
    await access(new URL(`../public${place.image.src}`, import.meta.url));
  }
});

test("each airport contains distinct executable travel instructions", () => {
  const airports = places.filter((place) => place.category === "transport");
  assert.equal(airports.length, 3);
  assert.equal(new Set(airports.map((place) => place.activity.source.title)).size, 3);

  for (const airport of airports) {
    assert.notEqual(airport.activity.duration, "交通节点");
    assert.ok(airport.activity.steps.length >= 3, `${airport.id} needs at least three airport steps`);
    assert.ok(airport.activity.practical.length >= 2, `${airport.id} needs airport-specific reminders`);
  }
});

test("locality photos stay attached to the matching real place", () => {
  const xincun = places.find((place) => place.id === "xincun-port");
  const sangemBeach = places.find((place) => place.id === "sangem-beach");

  assert.match(xincun?.image?.src ?? "", /xincun-port-xhs\.webp$/);
  assert.match(xincun?.image?.alt ?? "", /新村港/);
  assert.doesNotMatch(xincun?.image?.src ?? "", /raffles-hainan/);
  assert.match(sangemBeach?.image?.src ?? "", /sangem-beach-official\.webp$/);
  assert.match(sangemBeach?.image?.alt ?? "", /三正月/);
});

test("ships separate flight and drive legs so transport can be mapped honestly", async () => {
  const raw = await readFile(
    new URL("../public/routes/hainan-plan-a.geojson", import.meta.url),
    "utf8",
  );
  const routeData = JSON.parse(raw);

  assert.equal(routeData.type, "FeatureCollection");
  assert.equal(routeData.features.length, 12);
  assert.deepEqual(
    routeData.features.map((feature) => feature.properties.dayId),
    [1, 1, 1, 2, 2, 3, 4, 5, 6, 6, 7, 7],
  );

  assert.deepEqual(
    routeData.features.filter((feature) => feature.properties.dayId === 1).map((feature) => feature.properties.mode),
    ["flight", "drive", "walk"],
  );
  assert.deepEqual(
    routeData.features.filter((feature) => feature.properties.dayId === 7).map((feature) => feature.properties.mode),
    ["drive", "flight"],
  );
  assert.equal(routeData.features.filter((feature) => feature.properties.mode === "flight").length, 2);
  assert.equal(routeData.features.filter((feature) => feature.properties.mode === "drive").length, 7);
  assert.equal(routeData.features.filter((feature) => feature.properties.mode === "walk").length, 3);

  for (const feature of routeData.features) {
    assert.equal(feature.geometry.type, "LineString");
    assert.ok(feature.geometry.coordinates.length >= 2);
    assert.ok(["flight", "drive", "walk"].includes(feature.properties.mode));
    assert.match(feature.properties.legId, /^[AB]-D[1-7]-(flight|drive|walk)(?:-return)?$/);
  }

  for (let index = 1; index < routeData.features.length; index += 1) {
    const previous = routeData.features[index - 1].geometry.coordinates.at(-1);
    const current = routeData.features[index].geometry.coordinates[0];
    assert.deepEqual(current, previous, `Leg ${index} and leg ${index + 1} must connect`);
  }
});

test("every self-drive leg follows cached OSRM road geometry", async () => {
  for (const plan of itineraryPlans) {
    const raw = await readFile(new URL(`../public${plan.routePath}`, import.meta.url), "utf8");
    const routeData = JSON.parse(raw);
    const driveFeatures = routeData.features.filter((feature) => feature.properties.mode === "drive");

    assert.ok(driveFeatures.length > 0, `${plan.id} needs self-drive features`);
    for (const feature of driveFeatures) {
      assert.match(feature.properties.source ?? "", /OSRM.*OpenStreetMap/i, `${feature.properties.legId} needs a route source`);
      assert.ok(feature.geometry.coordinates.length >= 20, `${feature.properties.legId} needs road-level geometry`);
      assert.ok(feature.properties.distanceKm > 0);
      assert.ok(feature.properties.durationMinutes > 0);
      assert.ok(feature.properties.routeLegs.length >= 1);
      assert.ok(feature.properties.routeLegs.every((leg) => leg.distanceKm > 0 && leg.durationMinutes > 0));
    }
  }
});

test("turns the four user-supplied Xiaohongshu notes into structured in-page guidance", () => {
  assert.equal(userResearchSources.length, 4);
  assert.ok(userResearchSources.some((source) => /6QybMpO8y3I/.test(source.url)));
  assert.ok(userResearchSources.some((source) => /2HxyZx28FWw/.test(source.url)));
  assert.ok(userResearchSources.some((source) => /6gqXrkMD9Zk/.test(source.url)));
  assert.ok(userResearchSources.some((source) => /6a71b3a5/.test(source.url)));

  assert.deepEqual(dayGuides.map((guide) => guide.dayId), [1, 2, 3, 4, 5, 6, 7]);
  for (const guide of dayGuides) {
    assert.ok(guide.foodStops.length >= 1, `Day ${guide.dayId} needs a food plan`);
    for (const stop of guide.foodStops) {
      assert.ok(stop.name.length > 0);
      assert.ok(stop.area.length > 0);
      assert.ok(stop.when.length > 0);
      assert.ok(stop.order.length >= 1);
      assert.ok(stop.reason.length > 0);
      assert.match(stop.sourceUrl, /^https:\/\//);
      assert.ok(["high-engagement", "user-note", "map-verified", "hotel-plan"].includes(stop.evidence.kind));
      assert.ok(stop.evidence.label.length > 0);
      assert.ok(stop.caution.length > 0);
      assert.match(stop.mapUrl, /^https:\/\//);
    }
  }

  const xhsStops = dayGuides
    .flatMap((guide) => guide.foodStops)
    .filter((stop) => stop.evidence.kind === "high-engagement");
  assert.ok(xhsStops.length >= 2);
  assert.ok(xhsStops.every((stop) => /小红书/.test(stop.evidence.label)));
  assert.ok(xhsStops.every((stop) => Number.isInteger(stop.evidence.engagement) && stop.evidence.engagement > 0));

  const wanningNames = dayGuides
    .filter((guide) => [2, 3].includes(guide.dayId))
    .flatMap((guide) => guide.foodStops.map((stop) => stop.name));
  assert.ok(wanningNames.includes("兴隆南洋风味／吴记后安粉汤"));

  const lingshuiNames = dayGuides
    .filter((guide) => [4, 5].includes(guide.dayId))
    .flatMap((guide) => guide.foodStops.map((stop) => stop.name));
  assert.ok(lingshuiNames.includes("英姐酸粉热粉"));
  assert.ok(lingshuiNames.includes("酒店或清水湾附近简餐"));

  const sanyaNames = dayGuides
    .filter((guide) => [6, 7].includes(guide.dayId))
    .flatMap((guide) => guide.foodStops.map((stop) => stop.name));
  assert.ok(sanyaNames.includes("免税城内简餐或回酒店晚饭"));
  assert.ok(sanyaNames.includes("酒店早餐与机场简餐"));
});

test("records the breadth and conclusions of the Xiaohongshu research pass", () => {
  assert.ok(researchSummary.scannedCards >= 100);
  assert.ok(researchSummary.deepReads >= 20);
  assert.ok(researchSummary.queryGroups.some((group) => /万宁/.test(group)));
  assert.match(researchSummary.conclusion, /万宁.*两晚|两晚.*万宁/);
});

test("keeps Day 6 and Day 7 on the same Lingshui base without stale fourth-hotel copy", () => {
  const finalGuides = dayGuides.filter((guide) => [6, 7].includes(guide.dayId));
  const copy = JSON.stringify(finalGuides);

  assert.match(copy, /回同一家陵水酒店/);
  assert.match(copy, /陵水酒店至凤凰机场/);
  assert.doesNotMatch(copy, /索菲特|换宿日下午|海棠湾至凤凰机场/);
});
