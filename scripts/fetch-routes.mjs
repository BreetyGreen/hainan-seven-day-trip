import { mkdir, writeFile } from "node:fs/promises";

const routes = [
  {
    dayId: 1,
    legId: "D1-flight",
    mode: "flight",
    coordinates: [
      [114.2171149, 30.7756632],
      [110.4592869, 19.9442567],
    ],
    label: "武汉天河 → 海口美兰",
  },
  {
    dayId: 1,
    legId: "D1-drive",
    mode: "drive",
    waypoints: [
      [110.4592869, 19.9442567],
      [110.3299, 20.0318],
      [110.3376498, 20.0447272],
      [110.3299, 20.0318],
    ],
    label: "海口美兰 → 骑楼亚朵 → 骑楼老街 → 骑楼亚朵",
  },
  {
    dayId: 2,
    legId: "D2-drive",
    mode: "drive",
    waypoints: [
      [110.3299, 20.0318],
      [109.8064448, 18.4031364],
    ],
    label: "海口骑楼亚朵 → 海南三正月酒店",
  },
  {
    dayId: 3,
    legId: "D3-drive",
    mode: "drive",
    waypoints: [
      [109.8064448, 18.4031364],
      [109.997, 18.41519],
      [109.8064448, 18.4031364],
    ],
    label: "海南三正月酒店—新村港—海南三正月酒店",
  },
  {
    dayId: 4,
    legId: "D4-walk",
    mode: "walk",
    coordinates: [
      [109.8064448, 18.4031364],
      [109.8078, 18.3999],
      [109.8064448, 18.4031364],
    ],
    label: "三正月酒店 → 土福湾海岸 → 三正月酒店",
  },
  {
    dayId: 5,
    legId: "D5-drive",
    mode: "drive",
    waypoints: [
      [109.8064448, 18.4031364],
      [109.7137, 18.3329],
    ],
    label: "海南三正月酒店 → 三亚理文索菲特",
  },
  {
    dayId: 6,
    legId: "D6-drive",
    mode: "drive",
    waypoints: [
      [109.7137, 18.3329],
      [109.4999353, 18.2061567],
      [109.4818, 18.2108],
      [109.4963, 18.2272],
      [109.7137, 18.3329],
    ],
    label: "海棠湾索菲特—小东海—半山半岛帆船港—鹿回头—索菲特",
  },
  {
    dayId: 7,
    legId: "D7-drive",
    mode: "drive",
    waypoints: [
      [109.7137, 18.3329],
      [109.4125351, 18.3051519],
    ],
    label: "海棠湾 → 三亚凤凰机场",
  },
  {
    dayId: 7,
    legId: "D7-flight",
    mode: "flight",
    coordinates: [
      [109.4125351, 18.3051519],
      [114.2171149, 30.7756632],
    ],
    label: "三亚凤凰 → 武汉天河",
  },
];

async function fetchRoadGeometry(route) {
  const waypointText = route.waypoints
    .map(([lng, lat]) => `${lng},${lat}`)
    .join(";");
  const url =
    `https://router.project-osrm.org/route/v1/driving/${waypointText}` +
    "?overview=full&geometries=geojson&steps=false";
  const response = await fetch(url, {
    headers: { "user-agent": "CodexHainanTravelPlanner/1.0" },
  });
  if (!response.ok) throw new Error(`OSRM Day ${route.dayId}: ${response.status}`);
  const data = await response.json();
  if (data.code !== "Ok" || !data.routes?.[0]?.geometry?.coordinates) {
    throw new Error(`OSRM Day ${route.dayId}: no route`);
  }
  const coordinates = data.routes[0].geometry.coordinates;
  coordinates[0] = route.waypoints[0];
  coordinates[coordinates.length - 1] = route.waypoints.at(-1);
  return {
    coordinates,
    distanceKm: Math.round(data.routes[0].distance / 100) / 10,
    durationHours: Math.round(data.routes[0].duration / 360) / 10,
  };
}

const features = [];
for (const route of routes) {
  const road = route.mode === "drive"
    ? await fetchRoadGeometry(route)
    : { coordinates: route.coordinates, distanceKm: null, durationHours: null };
  features.push({
    type: "Feature",
    properties: {
      dayId: route.dayId,
      legId: route.legId,
      mode: route.mode,
      label: route.label,
      distanceKm: road.distanceKm,
      durationHours: road.durationHours,
      source: route.mode === "drive"
        ? "OSRM / OpenStreetMap, fetched 2026-08-11"
        : "Verified endpoints, connected by declared travel mode",
    },
    geometry: { type: "LineString", coordinates: road.coordinates },
  });
}

const collection = { type: "FeatureCollection", features };
await mkdir(new URL("../public/routes/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../public/routes/hainan-east-coast.geojson", import.meta.url),
  `${JSON.stringify(collection)}\n`,
  "utf8",
);

console.log(features.map((feature) => ({
  day: feature.properties.dayId,
  mode: feature.properties.mode,
  points: feature.geometry.coordinates.length,
  km: feature.properties.distanceKm,
})));
