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
      [110.3376498, 20.0447272],
      [110.340735, 18.673544],
    ],
    label: "海口美兰 → 骑楼老街 → 万宁神州半岛",
  },
  {
    dayId: 2,
    legId: "D2-drive",
    mode: "drive",
    waypoints: [
      [110.340735, 18.673544],
      [110.1962942, 18.7327905],
      [110.19691, 18.73747],
      [110.27209, 18.661922],
      [110.340735, 18.673544],
    ],
    label: "神州半岛—兴隆植物园—兴隆市场—石梅湾—神州半岛",
  },
  {
    dayId: 3,
    legId: "D3-drive",
    mode: "drive",
    waypoints: [
      [110.340735, 18.673544],
      [110.2148756, 18.6296934],
      [110.3479262, 18.6779739],
      [110.340735, 18.673544],
    ],
    label: "神州半岛—日月湾—神州半岛海岸—君悦",
  },
  {
    dayId: 4,
    legId: "D4-drive",
    mode: "drive",
    waypoints: [
      [110.340735, 18.673544],
      [109.997, 18.41519],
      [109.87799, 18.3920123],
      [109.7357906, 18.3458391],
    ],
    label: "万宁神州半岛—新村港—清水湾—三亚海棠湾",
  },
  {
    dayId: 5,
    legId: "D5-drive",
    mode: "drive",
    waypoints: [
      [109.7357906, 18.3458391],
      [109.2066329, 18.3000907],
      [109.7357906, 18.3458391],
    ],
    label: "海棠湾—南山文化旅游区—海棠湾",
  },
  {
    dayId: 6,
    legId: "D6-drive",
    mode: "drive",
    waypoints: [
      [109.7357906, 18.3458391],
      [109.5251825, 18.2205905],
      [109.4962752, 18.2271541],
      [109.475754, 18.274342],
      [109.7357906, 18.3458391],
    ],
    label: "海棠湾—大东海—鹿回头—三亚湾—海棠湾",
  },
  {
    dayId: 7,
    legId: "D7-drive",
    mode: "drive",
    waypoints: [
      [109.7357906, 18.3458391],
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
        : "Verified flight and road endpoints, connected by travel mode",
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
