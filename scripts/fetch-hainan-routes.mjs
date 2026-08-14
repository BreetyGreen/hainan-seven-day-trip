import { mkdir, writeFile } from "node:fs/promises";

const fetchedAt = "2026-08-14";
const roadSource = `OSRM / OpenStreetMap, fetched ${fetchedAt}`;
const staticSource = "Verified endpoints, connected by declared travel mode";

const points = {
  wuhanAirport: [114.2171149, 30.7756632],
  haikouAirport: [110.4592869, 19.9442567],
  haikouMarriott: [110.1870672, 20.0618533],
  haikouHoliday: [110.216681, 20.049293],
  haikouCoast: [110.1892, 20.0591],
  hongyuanCrest: [110.475102, 20.02461],
  jiangdongCoast: [110.4788, 20.0278],
  wanningHyatt: [110.340735, 18.673544],
  wanningHoliday: [110.361108, 18.680208],
  shenzhouCoast: [110.3479262, 18.6779739],
  shimeiBay: [110.27209, 18.661922],
  xinglongMarket: [110.19691, 18.73747],
  xinglongGarden: [110.1962942, 18.7327905],
  yuyueArtia: [110.2168, 18.6258],
  riyueBayCoast: [110.2154, 18.6281],
  xincunPort: [109.997, 18.41519],
  clearwaterIndigo: [109.8628, 18.4038],
  kimptonClearwater: [109.8617, 18.4036],
  clearwaterCoast: [109.8686, 18.3978],
  sangemMoon: [109.8064448, 18.4031364],
  sangemCoast: [109.8078, 18.3999],
  cdfSanya: [109.7487, 18.3548],
  sanyaAirport: [109.4125351, 18.3051519],
};

const flight = (dayId, legId, label, coordinates) => ({ dayId, legId, mode: "flight", label, coordinates });
const drive = (dayId, legId, label, waypoints) => ({ dayId, legId, mode: "drive", label, waypoints });
const walk = (dayId, legId, label, coordinates, distanceKm, durationMinutes) => ({
  dayId,
  legId,
  mode: "walk",
  label,
  coordinates,
  distanceKm,
  durationMinutes,
});

const plans = {
  a: [
    flight(1, "A-D1-flight", "武汉天河 → 海口美兰", [points.wuhanAirport, points.haikouAirport]),
    drive(1, "A-D1-drive", "海口美兰 → 江东鸿园雅诗阁臻选", [points.haikouAirport, points.hongyuanCrest]),
    walk(1, "A-D1-walk", "鸿园雅诗阁 → 江东海岸 → 鸿园雅诗阁", [points.hongyuanCrest, points.jiangdongCoast, points.hongyuanCrest], 0.9, 14),
    drive(2, "A-D2-drive", "海口江东 → 万宁日月湾逐浪屿玥", [points.hongyuanCrest, points.yuyueArtia]),
    walk(2, "A-D2-walk", "逐浪屿玥 → 日月湾海岸 → 逐浪屿玥", [points.yuyueArtia, points.riyueBayCoast, points.yuyueArtia], 0.8, 14),
    drive(3, "A-D3-drive", "日月湾 → 石梅湾 → 兴隆市场 → 日月湾", [points.yuyueArtia, points.shimeiBay, points.xinglongMarket, points.yuyueArtia]),
    drive(4, "A-D4-drive", "日月湾 → 新村港 → 清水湾金普顿", [points.yuyueArtia, points.xincunPort, points.kimptonClearwater]),
    walk(5, "A-D5-walk", "清水湾金普顿 → 酒店海岸 → 金普顿", [points.kimptonClearwater, points.clearwaterCoast, points.kimptonClearwater], 1.5, 20),
    drive(6, "A-D6-drive", "清水湾金普顿 → 三亚国际免税城", [points.kimptonClearwater, points.cdfSanya]),
    drive(6, "A-D6-drive-return", "三亚国际免税城 → 清水湾金普顿", [points.cdfSanya, points.kimptonClearwater]),
    drive(7, "A-D7-drive", "清水湾金普顿 → 三亚凤凰机场", [points.kimptonClearwater, points.sanyaAirport]),
    flight(7, "A-D7-flight", "三亚凤凰 → 武汉天河", [points.sanyaAirport, points.wuhanAirport]),
  ],
  b: [
    flight(1, "B-D1-flight", "武汉天河 → 海口美兰", [points.wuhanAirport, points.haikouAirport]),
    drive(1, "B-D1-drive", "海口美兰 → 海口万豪", [points.haikouAirport, points.haikouMarriott]),
    walk(1, "B-D1-walk", "海口万豪 → 西海岸 → 海口万豪", [points.haikouMarriott, points.haikouCoast, points.haikouMarriott], 1.2, 18),
    drive(2, "B-D2-drive", "海口西海岸 → 万宁神州半岛君悦", [points.haikouMarriott, points.wanningHyatt]),
    walk(2, "B-D2-walk", "君悦 → 神州半岛海岸 → 君悦", [points.wanningHyatt, points.shenzhouCoast, points.wanningHyatt], 1.5, 24),
    drive(3, "B-D3-drive", "万宁君悦 → 兴隆热带植物园 → 兴隆市场 → 万宁君悦", [points.wanningHyatt, points.xinglongGarden, points.xinglongMarket, points.wanningHyatt]),
    drive(4, "B-D4-drive", "万宁神州半岛 → 陵水土福湾三正月", [points.wanningHyatt, points.sangemMoon]),
    walk(5, "B-D5-walk", "三正月 → 土福湾海岸 → 三正月", [points.sangemMoon, points.sangemCoast, points.sangemMoon], 1.1, 18),
    drive(6, "B-D6-drive", "土福湾 → 三亚国际免税城", [points.sangemMoon, points.cdfSanya]),
    drive(6, "B-D6-drive-return", "三亚国际免税城 → 土福湾", [points.cdfSanya, points.sangemMoon]),
    drive(7, "B-D7-drive", "土福湾 → 三亚凤凰机场", [points.sangemMoon, points.sanyaAirport]),
    flight(7, "B-D7-flight", "三亚凤凰 → 武汉天河", [points.sanyaAirport, points.wuhanAirport]),
  ],
};

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchRoadGeometry(route) {
  const waypointText = route.waypoints.map(([lng, lat]) => `${lng},${lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${waypointText}?overview=full&geometries=geojson&steps=false`;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(url, { headers: { "user-agent": "HainanSevenDayTrip/2.0 (static route generation)" } });
    if (response.ok) {
      const data = await response.json();
      const routeResult = data.routes?.[0];
      if (data.code === "Ok" && routeResult?.geometry?.coordinates?.length >= 2) {
        const coordinates = routeResult.geometry.coordinates;
        coordinates[0] = route.waypoints[0];
        coordinates[coordinates.length - 1] = route.waypoints.at(-1);
        return {
          coordinates,
          distanceKm: Math.round(routeResult.distance / 100) / 10,
          durationMinutes: Math.round(routeResult.duration / 60),
          routeLegs: routeResult.legs.map((leg, index) => ({
            index,
            distanceKm: Math.round(leg.distance / 100) / 10,
            durationMinutes: Math.round(leg.duration / 60),
          })),
        };
      }
    }
    if (attempt === 3) throw new Error(`${route.legId}: OSRM request failed with ${response.status}`);
    await wait(700 * attempt);
  }
}

async function buildFeature(route) {
  const geometry = route.mode === "drive"
    ? await fetchRoadGeometry(route)
    : { coordinates: route.coordinates, distanceKm: route.distanceKm ?? null, durationMinutes: route.durationMinutes ?? null, routeLegs: [] };
  const durationHours = geometry.durationMinutes === null ? null : Math.round((geometry.durationMinutes / 60) * 10) / 10;

  return {
    type: "Feature",
    properties: {
      dayId: route.dayId,
      legId: route.legId,
      mode: route.mode,
      label: route.label,
      distanceKm: geometry.distanceKm,
      durationMinutes: geometry.durationMinutes,
      durationHours,
      routeLegs: geometry.routeLegs,
      source: route.mode === "drive" ? roadSource : staticSource,
    },
    geometry: { type: "LineString", coordinates: geometry.coordinates },
  };
}

await mkdir(new URL("../public/routes/", import.meta.url), { recursive: true });

for (const [planId, routes] of Object.entries(plans)) {
  const features = [];
  for (const route of routes) {
    features.push(await buildFeature(route));
    if (route.mode === "drive") await wait(350);
  }
  const collection = { type: "FeatureCollection", features };
  await writeFile(new URL(`../public/routes/hainan-plan-${planId}.geojson`, import.meta.url), `${JSON.stringify(collection)}\n`, "utf8");
  console.log(planId.toUpperCase(), features.map((feature) => ({
    leg: feature.properties.legId,
    points: feature.geometry.coordinates.length,
    km: feature.properties.distanceKm,
    minutes: feature.properties.durationMinutes,
  })));
}
