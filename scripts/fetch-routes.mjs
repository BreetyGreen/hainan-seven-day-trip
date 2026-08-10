import { mkdir, writeFile } from "node:fs/promises";

const routes = [
  {
    dayId: 1,
    mode: "flight-rail",
    coordinates: [
      [114.2171149, 30.7756632],
      [102.9397246, 25.1087786],
      [102.8603804, 24.8733628],
      [100.9412056, 22.7784879],
    ],
    label: "武汉天河—昆明长水—昆明南—普洱站",
  },
  {
    dayId: 2,
    mode: "drive",
    waypoints: [
      [100.9731, 22.7854],
      [100.9722, 22.7868],
      [100.9578162, 22.6610788],
      [100.9731, 22.7854],
    ],
    label: "五一市场—戴家巷—小凹子咖啡庄园—思茅",
  },
  {
    dayId: 3,
    mode: "drive",
    waypoints: [
      [100.9412056, 22.7784879],
      [101.0889865, 22.6200425],
      [100.9412056, 22.7784879],
    ],
    label: "思茅—太阳河犀牛坪—思茅",
  },
  {
    dayId: 4,
    mode: "drive",
    waypoints: [
      [100.9412056, 22.7784879],
      [99.9312377, 22.6720893],
      [100.079, 22.2622],
    ],
    label: "思茅—澜沧县城—惠民镇",
  },
  {
    dayId: 5,
    mode: "drive",
    waypoints: [
      [100.079, 22.2622],
      [99.9998707, 22.2166836],
      [99.99894, 22.1736769],
      [100.0163233, 22.1599536],
      [100.0075, 22.1841667],
      [100.079, 22.2622],
    ],
    label: "惠民—糯岗—翁基—芒景—古茶林—惠民",
  },
  {
    dayId: 6,
    mode: "drive",
    waypoints: [
      [100.079, 22.2622],
      [99.9312377, 22.6720893],
      [100.9748, 22.7816],
    ],
    label: "惠民—澜沧县城—思茅新兴街",
  },
  {
    dayId: 7,
    mode: "flight-rail",
    coordinates: [
      [100.9412056, 22.7784879],
      [102.8603804, 24.8733628],
      [102.9397246, 25.1087786],
      [114.2171149, 30.7756632],
    ],
    label: "普洱站—昆明南—昆明长水—武汉天河",
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
    headers: { "user-agent": "CodexTravelPlanner/1.0" },
  });
  if (!response.ok) {
    throw new Error(`OSRM ${route.dayId} failed with ${response.status}`);
  }
  const data = await response.json();
  if (data.code !== "Ok" || !data.routes?.[0]?.geometry?.coordinates) {
    throw new Error(`OSRM ${route.dayId} returned no route`);
  }
  return {
    coordinates: data.routes[0].geometry.coordinates,
    distanceKm: Math.round(data.routes[0].distance / 100) / 10,
    durationHours: Math.round(data.routes[0].duration / 360) / 10,
  };
}

const features = [];
for (const route of routes) {
  const road =
    route.mode === "drive"
      ? await fetchRoadGeometry(route)
      : { coordinates: route.coordinates, distanceKm: null, durationHours: null };
  features.push({
    type: "Feature",
    properties: {
      dayId: route.dayId,
      mode: route.mode,
      label: route.label,
      distanceKm: road.distanceKm,
      durationHours: road.durationHours,
      source:
        route.mode === "drive"
          ? "OSRM / OpenStreetMap, fetched 2026-08-10"
          : "Verified transport endpoints, connected by travel mode",
    },
    geometry: {
      type: "LineString",
      coordinates: road.coordinates,
    },
  });
}

const collection = { type: "FeatureCollection", features };
await mkdir(new URL("../public/routes/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../public/routes/puer-loop.geojson", import.meta.url),
  `${JSON.stringify(collection)}\n`,
  "utf8",
);

console.log(
  features.map((feature) => ({
    day: feature.properties.dayId,
    mode: feature.properties.mode,
    points: feature.geometry.coordinates.length,
    km: feature.properties.distanceKm,
  })),
);
