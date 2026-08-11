import assert from "node:assert/strict";
import test from "node:test";

import { cameraForArrival, cameraForTravel } from "../app/trip-camera.ts";

function place(id, city, category, lat, lng) {
  return { id, city, category, coordinates: { lat, lng } };
}

function segment(mode, from, to) {
  return {
    mode,
    from: { place: from },
    to: { place: to },
    coordinates: [
      [from.coordinates.lng, from.coordinates.lat],
      [to.coordinates.lng, to.coordinates.lat],
    ],
  };
}

test("uses overview, intercity, suburban, and city scales for travel", () => {
  const wuhan = place("wuhan-airport", "武汉", "transport", 30.7757, 114.2171);
  const haikou = place("haikou-airport", "海口", "transport", 19.9349, 110.4592);
  const wanning = place("wanning-hyatt", "万宁", "stay", 18.6780, 110.3479);
  const lingshui = place("xincun-port", "陵水", "harbor", 18.4036, 109.9712);
  const dadonghai = place("dadonghai", "三亚", "coast", 18.2206, 109.5252);
  const luhuitou = place("luhuitou", "三亚", "viewpoint", 18.2272, 109.4963);
  const nearCityEdge = place("near-edge", "陵水", "coast", 18.45, 110.15);

  assert.deepEqual(cameraForTravel(segment("flight", wuhan, haikou)), {
    kind: "overview",
    zoom: 6,
    duration: 0.9,
  });
  assert.equal(cameraForTravel(segment("drive", wanning, lingshui)).zoom, 9);
  assert.equal(cameraForTravel(segment("drive", wanning, nearCityEdge)).zoom, 11);
  assert.equal(cameraForTravel(segment("drive", dadonghai, luhuitou)).zoom, 13);
});

test("zooms into meaningful arrivals without over-zooming hotels or airports", () => {
  assert.equal(cameraForArrival({ id: "dadonghai", category: "coast" }).zoom, 15);
  assert.equal(cameraForArrival({ id: "luhuitou", category: "viewpoint" }).zoom, 15);
  assert.equal(cameraForArrival({ id: "sanya-hyatt", category: "stay" }).zoom, 13);
  assert.equal(cameraForArrival({ id: "sanya-airport", category: "transport" }).zoom, 9);
});

