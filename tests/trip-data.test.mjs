import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

import {
  days,
  getDayRoute,
  hotels,
  places,
} from "../app/trip-data.ts";
import {
  dayGuides,
  hotelBayGuide,
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
  }
});

test("every mapped point is a sourced real Hainan or Wuhan place", () => {
  assert.ok(places.length >= 14);
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

test("hotel recommendations keep official and Xiaohongshu evidence", async () => {
  assert.equal(hotels.length, 2, "the trip must use exactly two hotel bases");
  assert.deepEqual(hotels.map((hotel) => hotel.checkInDay), [1, 4]);

  for (const hotel of hotels) {
    assert.ok(hotel.reasons.length >= 2);
    assert.ok(hotel.cautions.length >= 1);
    assert.match(hotel.officialUrl, /^https:\/\//);
    assert.match(hotel.xhsSource.url, /^https:\/\/www\.xiaohongshu\.com\//);
    assert.ok(hotel.xhsSource.author.length > 0);
    assert.ok(hotel.xhsSource.title.length > 0);
    assert.match(hotel.image.src, /^\/hainan\/.+\.webp$/i);
    assert.match(hotel.image.creditUrl, /^https:\/\/www\.xiaohongshu\.com\//);
    await access(new URL(`../public${hotel.image.src}`, import.meta.url));
  }
});

test("uses two three-night bases and changes hotel only on Day 4", () => {
  const overnightBases = new Set(days.slice(0, 6).map((day) => day.sleep));
  assert.equal(overnightBases.size, 2);
  assert.deepEqual([...overnightBases], [
    "万宁神州半岛君悦酒店",
    "三亚海棠湾君悦酒店",
  ]);
  assert.deepEqual(days.filter((day) => day.isHotelChange).map((day) => day.id), [4]);
  assert.equal(days.filter((day) => /换宿/.test(day.pace)).length, 1);
});

test("every activity point contains specific playable instructions", () => {
  const activityPlaces = places.filter((place) => !["transport", "stay"].includes(place.category));
  assert.ok(activityPlaces.length >= 12);

  for (const place of activityPlaces) {
    assert.ok(place.activity.time.length > 0, `${place.name} needs a time`);
    assert.ok(place.activity.duration.length > 0, `${place.name} needs a duration`);
    assert.ok(place.activity.steps.length >= 2, `${place.name} needs concrete steps`);
    assert.ok(place.activity.practical.length >= 1, `${place.name} needs practical advice`);
    assert.match(place.activity.source.url, /^https:\/\//);
    assert.ok(place.activity.source.title.length > 0);
  }
});

test("ships local Xiaohongshu images with attribution", async () => {
  const imageStops = places.filter((place) => place.image);
  assert.ok(imageStops.length >= 5);

  for (const place of imageStops) {
    assert.match(place.image.src, /^\/hainan\/.+\.webp$/i);
    assert.equal(place.image.platform, "小红书");
    assert.match(place.image.creditUrl, /^https:\/\/www\.xiaohongshu\.com\//);
    assert.ok(place.image.credit.length > 0);
    await access(new URL(`../public${place.image.src}`, import.meta.url));
  }
});

test("locality photos stay attached to the matching real place", () => {
  const xincun = places.find((place) => place.id === "xincun-port");
  const clearwater = places.find((place) => place.id === "clearwater-bay");

  assert.equal(xincun?.image, undefined, "新村港不能误用清水湾酒店景观图");
  assert.match(clearwater?.image?.src ?? "", /raffles-hainan-xhs\.webp$/);
  assert.match(clearwater?.image?.alt ?? "", /清水湾/);
});

test("ships separate flight and drive legs so transport can be mapped honestly", async () => {
  const raw = await readFile(
    new URL("../public/routes/hainan-east-coast.geojson", import.meta.url),
    "utf8",
  );
  const routeData = JSON.parse(raw);

  assert.equal(routeData.type, "FeatureCollection");
  assert.equal(routeData.features.length, 9);
  assert.deepEqual(
    routeData.features.map((feature) => feature.properties.dayId),
    [1, 1, 2, 3, 4, 5, 6, 7, 7],
  );

  assert.deepEqual(
    routeData.features.filter((feature) => feature.properties.dayId === 1).map((feature) => feature.properties.mode),
    ["flight", "drive"],
  );
  assert.deepEqual(
    routeData.features.filter((feature) => feature.properties.dayId === 7).map((feature) => feature.properties.mode),
    ["drive", "flight"],
  );
  assert.equal(routeData.features.filter((feature) => feature.properties.mode === "flight").length, 2);
  assert.equal(routeData.features.filter((feature) => feature.properties.mode === "drive").length, 7);

  for (const feature of routeData.features) {
    assert.equal(feature.geometry.type, "LineString");
    assert.ok(feature.geometry.coordinates.length >= 2);
    assert.ok(["flight", "drive"].includes(feature.properties.mode));
    assert.match(feature.properties.legId, /^D[1-7]-(flight|drive)$/);
  }

  for (let index = 1; index < routeData.features.length; index += 1) {
    const previous = routeData.features[index - 1].geometry.coordinates.at(-1);
    const current = routeData.features[index].geometry.coordinates[0];
    assert.deepEqual(current, previous, `Leg ${index} and leg ${index + 1} must connect`);
  }
});

test("turns the four user-supplied Xiaohongshu notes into structured in-page guidance", () => {
  assert.equal(userResearchSources.length, 4);
  assert.ok(userResearchSources.some((source) => /6QybMpO8y3I/.test(source.url)));
  assert.ok(userResearchSources.some((source) => /2HxyZx28FWw/.test(source.url)));
  assert.ok(userResearchSources.some((source) => /6gqXrkMD9Zk/.test(source.url)));
  assert.ok(userResearchSources.some((source) => /6a707066/.test(source.url)));

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
    }
  }

  const wanningNames = dayGuides
    .filter((guide) => [2, 3].includes(guide.dayId))
    .flatMap((guide) => guide.foodStops.map((stop) => stop.name));
  assert.ok(wanningNames.includes("新大众茶坊"));
  assert.ok(wanningNames.includes("原辉记清补凉"));

  const sanyaNames = dayGuides
    .filter((guide) => [5, 6, 7].includes(guide.dayId))
    .flatMap((guide) => guide.foodStops.map((stop) => stop.name));
  assert.ok(sanyaNames.includes("正合中西茶店"));
  assert.ok(sanyaNames.includes("小高后安粉餐厅"));
});

test("explains the four Sanya bay choices without making price the main story", () => {
  assert.deepEqual(hotelBayGuide.map((bay) => bay.bay), ["三亚湾", "大东海", "亚龙湾", "海棠湾"]);
  const haitang = hotelBayGuide.find((bay) => bay.bay === "海棠湾");
  assert.match(haitang?.fit ?? "", /连住|自驾|陵水|免税/);
  assert.doesNotMatch(hotelBayGuide.map((bay) => `${bay.fit}${bay.tradeoff}`).join(""), /¥|元\/晚|预算/);
});
