# Haikou–Lingshui–Sanya Slow Trip Content Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Wanning-based Hainan itinerary with a verified seven-day Haikou–Lingshui–Sanya slow trip and show transport duration directly on selected route legs.

**Architecture:** Keep the existing Leaflet playback, camera, arrival dialog, and continuous GeoJSON animation. Extend the trip content model with index-addressed `RouteLeg` records, render lightweight duration badges for the selected day, and rewrite the existing data/research assets around three lodging cities and two hotel-change days.

**Tech Stack:** TypeScript 5.9, React 19, Leaflet 1.9, Vinext/Vite, Node test runner, GeoJSON generated through OSRM/OpenStreetMap.

## Global Constraints

- Travel dates are 2026-09-12 through 2026-09-18 for two adults departing Wuhan.
- The default lodging rhythm is Haikou 1 night, Lingshui 3 nights, and Sanya 2 nights; hotel changes occur only on Day 2 and Day 5.
- Lingshui is the primary sea-view stay; Haikou does not pay a sea-view premium and Sanya upgrades only when the room-rate difference is reasonable.
- Budget is a filtering constraint around CNY 8,000 for two people, not a primary page module.
- Default playback excludes Monkey Island, Boundary Island, Wuzhizhou Island, Houhai, Nanshan, and Coconut Dream Corridor.
- Existing camera and playback state-machine behavior must not be refactored.
- Route duration labels must remain lightweight during zooming and must not reduce the current map smoothness.

---

## File Structure

- `app/trip-data.ts`: canonical places, hotels, days, and new route-leg metadata.
- `app/trip-details.ts`: food and optional-activity guidance for the new cities.
- `app/trip-legs.ts`: pure helpers that resolve index-addressed legs and format transport modes.
- `app/RouteMap.tsx`: selected-day route-duration markers and next-leg information in dialogs.
- `app/globals.css`: route-leg badge styling and responsive/zooming behavior.
- `public/routes/hainan-east-coast.geojson`: continuous coordinates for the revised default itinerary.
- `public/hainan/*`: verified hotel and place imagery with source metadata in `trip-data.ts`.
- `PRODUCT.md`: current product truth.
- `tests/trip-data.test.mjs`: itinerary, hotel, leg, and GeoJSON contract tests.
- `tests/rendered-html.test.mjs`: UI wiring and route-label rendering tests.
- `tests/trip-playback.test.mjs`: playback compatibility for the new places.

### Task 1: Lock the New Trip and Route-Leg Contracts with Tests

**Files:**
- Modify: `tests/trip-data.test.mjs`
- Modify: `tests/rendered-html.test.mjs`
- Create: `tests/trip-legs.test.mjs`

**Interfaces:**
- Consumes: existing exports `days`, `places`, `hotels`, and `getDayRoute` from `app/trip-data.ts`.
- Produces: required exports `getDayLegs(dayId)`, `getLegAfter(dayId, placeIndex)`, and `modeLabel(mode)` from `app/trip-legs.ts`.

- [ ] **Step 1: Write failing itinerary assertions**

Add assertions that encode the approved content:

```js
assert.deepEqual(days.map((day) => day.sleep), [
  "海口万国大都会骑楼亚朵酒店",
  "海南三正月酒店",
  "海南三正月酒店",
  "海南三正月酒店",
  "三亚理文索菲特酒店",
  "三亚理文索菲特酒店",
  "回家",
]);
assert.deepEqual(days.filter((day) => day.isHotelChange).map((day) => day.id), [2, 5]);
assert.equal(places.some((place) => place.city === "万宁"), false);
assert.equal(hotels.some((hotel) => hotel.city === "万宁"), false);
assert.match(hotels.find((hotel) => hotel.id === "sangem-moon").fit, /海景/);
for (const day of days) assert.equal(day.legs.length, day.placeIds.length - 1);
```

- [ ] **Step 2: Add route-leg helper tests**

```js
import { getDayLegs, getLegAfter, modeLabel } from "../app/trip-legs.ts";

test("resolves repeated hotel stops by route index", () => {
  const legs = getDayLegs(3);
  assert.equal(legs[0].fromIndex, 0);
  assert.equal(legs.at(-1).toIndex, 2);
  assert.equal(getLegAfter(3, 1), legs[1]);
});

test("formats transport modes for map badges", () => {
  assert.equal(modeLabel("flight"), "✈ 航班");
  assert.equal(modeLabel("drive"), "🚙 自驾");
  assert.equal(modeLabel("walk"), "步行");
  assert.equal(modeLabel("boat"), "乘船");
});
```

- [ ] **Step 3: Add render-contract assertions**

```js
assert.match(routeMap, /route-leg-duration-marker/);
assert.match(routeMap, /getDayLegs/);
assert.match(routeMap, /getLegAfter/);
assert.match(routeMap, /durationLabel/);
assert.match(css, /\.route-leg-duration-marker/);
assert.match(css, /\.is-map-zooming \.route-leg-duration-marker/);
```

- [ ] **Step 4: Run tests and confirm they fail for missing new contracts**

Run: `node --test tests/trip-data.test.mjs tests/trip-legs.test.mjs tests/rendered-html.test.mjs`

Expected: FAIL because `Day.legs`, `app/trip-legs.ts`, and route-duration marker markup do not exist.

- [ ] **Step 5: Commit the contract tests**

```bash
git add tests/trip-data.test.mjs tests/trip-legs.test.mjs tests/rendered-html.test.mjs
git commit -m "test: define slow trip route leg contracts"
```

### Task 2: Replace the Itinerary, Hotels, Food, and Product Truth

**Files:**
- Modify: `app/trip-data.ts`
- Modify: `app/trip-details.ts`
- Modify: `PRODUCT.md`
- Create: `app/trip-legs.ts`

**Interfaces:**
- Produces `TravelLegMode = "flight" | "drive" | "walk" | "boat" | "optional"`.
- Produces `RouteLeg` on each `Day` and pure helper functions for the UI.
- Keeps `getDayRoute(dayId): Place[]` and `getHotel(hotelId)` backward compatible.

- [ ] **Step 1: Add the route-leg types to `app/trip-data.ts`**

```ts
export type TravelLegMode = "flight" | "drive" | "walk" | "boat" | "optional";

export type RouteLeg = {
  fromIndex: number;
  toIndex: number;
  mode: TravelLegMode;
  durationLabel: string;
  distanceLabel?: string;
  timingNote?: string;
  fallback: string;
};

export type PhotoSource = {
  src: string;
  alt: string;
  platform: "小红书" | "官网";
  credit: string;
  creditUrl: string;
  noteTitle: string;
};

export type Day = {
  id: number;
  title: string;
  dateLabel: string;
  pace: string;
  summary: string;
  placeIds: string[];
  legs: RouteLeg[];
  distanceLabel: string;
  driveLabel: string;
  sleep: string;
  meals: string[];
  weatherPlan: string;
  isHotelChange?: boolean;
};
```

- [ ] **Step 2: Replace the place and hotel dataset**

The default route must use these IDs and real locations:

```ts
const approvedPlaceIds = [
  "wuhan-airport", "haikou-airport", "haikou-qilou-atour", "qilou",
  "sangem-moon", "xincun-port", "sangem-beach", "sofitel-sanya",
  "xiaodonghai", "banshan-marina", "luhuitou", "sanya-airport",
];

const approvedHotelIds = ["haikou-qilou-atour", "sangem-moon", "sofitel-sanya"];
```

Hotel records must include the approved primary properties and comparison cautions:

```ts
{
  id: "sangem-moon",
  name: "海南三正月酒店",
  shortName: "陵水海景基地",
  city: "陵水",
  checkInDay: 2,
  nights: "Day 2–4 · 连住 3 晚",
  fit: "全程主要海景住宿；优先高楼层海景大床、独立阳台和双早。",
  reasons: ["土福湾一线海岸", "三晚有足够时间使用阳台、泳池和海滩"],
  cautions: ["亲子客群明显", "景观房、池景房不能替代真正海景房"],
  officialUrl: "https://www.sangemmoon.com/",
}
```

- [ ] **Step 3: Replace all seven day records**

Use the route order and leg durations below:

```ts
const routeSkeleton = [
  { id: 1, places: ["wuhan-airport", "haikou-airport", "haikou-qilou-atour", "qilou", "haikou-qilou-atour"], durations: ["约 2 小时 30 分", "约 35–50 分钟", "约 10–15 分钟", "约 10–15 分钟"] },
  { id: 2, places: ["haikou-qilou-atour", "sangem-moon"], durations: ["约 2 小时 30 分–3 小时"] },
  { id: 3, places: ["sangem-moon", "xincun-port", "sangem-moon"], durations: ["约 35–50 分钟", "约 35–50 分钟"] },
  { id: 4, places: ["sangem-moon", "sangem-beach", "sangem-moon"], durations: ["步行约 5–10 分钟", "步行约 5–10 分钟"] },
  { id: 5, places: ["sangem-moon", "sofitel-sanya"], durations: ["约 25–40 分钟"] },
  { id: 6, places: ["sofitel-sanya", "xiaodonghai", "banshan-marina", "luhuitou", "sofitel-sanya"], durations: ["约 50–65 分钟", "约 10–15 分钟", "约 10–15 分钟", "约 45–60 分钟"] },
  { id: 7, places: ["sofitel-sanya", "sanya-airport", "wuhan-airport"], durations: ["约 50–70 分钟", "约 2 小时 30 分"] },
];
```

Every leg must include a concrete weather or delay fallback from the approved design.

- [ ] **Step 4: Implement `app/trip-legs.ts`**

```ts
import { days, type RouteLeg, type TravelLegMode } from "./trip-data";

export function getDayLegs(dayId: number): RouteLeg[] {
  return days.find((day) => day.id === dayId)?.legs ?? [];
}

export function getLegAfter(dayId: number, placeIndex: number): RouteLeg | undefined {
  return getDayLegs(dayId).find((leg) => leg.fromIndex === placeIndex);
}

export function modeLabel(mode: TravelLegMode): string {
  if (mode === "flight") return "✈ 航班";
  if (mode === "drive") return "🚙 自驾";
  if (mode === "boat") return "乘船";
  if (mode === "walk") return "步行";
  return "可选";
}
```

- [ ] **Step 5: Rewrite `trip-details.ts` and `PRODUCT.md`**

Remove Wanning-only research and make the seven day guides match the approved route. Keep user-provided Sanya food notes only when they are geographically compatible with Day 6. Update product truth to three lodging cities, two hotel changes, and route-leg durations.

- [ ] **Step 6: Run data and helper tests**

Run: `node --test tests/trip-data.test.mjs tests/trip-legs.test.mjs`

Expected: PASS.

- [ ] **Step 7: Commit the content model**

```bash
git add app/trip-data.ts app/trip-details.ts app/trip-legs.ts PRODUCT.md tests/trip-data.test.mjs tests/trip-legs.test.mjs
git commit -m "feat: replace Hainan plan with three-city slow trip"
```

### Task 3: Regenerate a Continuous Route for the New Stops

**Files:**
- Modify: `scripts/fetch-routes.mjs`
- Modify: `public/routes/hainan-east-coast.geojson`
- Modify: `tests/trip-data.test.mjs`

**Interfaces:**
- Consumes the approved place coordinates and day order from `app/trip-data.ts`.
- Produces GeoJSON features with `dayId`, `legId`, `mode`, `label`, `distanceKm`, and `durationHours`.

- [ ] **Step 1: Update GeoJSON expectations**

```js
const expectedDays = new Set([1, 2, 3, 4, 5, 6, 7]);
assert.deepEqual(new Set(routeData.features.map((feature) => feature.properties.dayId)), expectedDays);
assert.equal(routeData.features.some((feature) => /万宁/.test(feature.properties.label)), false);
assert.equal(routeData.features.filter((feature) => feature.properties.mode === "flight").length, 2);
```

- [ ] **Step 2: Update route generation inputs**

Generate road geometry for the new drive legs, direct lines for flights, and short direct geometry for hotel-to-beach walking legs. Each feature must begin at the preceding place coordinate and end at the next place coordinate.

- [ ] **Step 3: Regenerate the file**

Run: `node scripts/fetch-routes.mjs`

Expected: a valid `FeatureCollection` with all seven days and no Wanning label.

- [ ] **Step 4: Verify continuity**

Run: `node --test tests/trip-data.test.mjs tests/trip-playback.test.mjs`

Expected: PASS with each playback stop mapped to a forward GeoJSON coordinate.

- [ ] **Step 5: Commit the new route**

```bash
git add scripts/fetch-routes.mjs public/routes/hainan-east-coast.geojson tests/trip-data.test.mjs
git commit -m "feat: route Haikou Lingshui and Sanya journey"
```

### Task 4: Render Transport Durations on the Map and in Arrival Details

**Files:**
- Modify: `app/RouteMap.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes `getDayLegs`, `getLegAfter`, and `modeLabel` from `app/trip-legs.ts`.
- Reuses existing selected-day route features and Leaflet marker groups.

- [ ] **Step 1: Import leg helpers and create one label per selected-day leg**

```tsx
import { getDayLegs, getLegAfter, modeLabel } from "./trip-legs";

function legBadgeHtml(mode: TravelLegMode, durationLabel: string) {
  return `<span class="route-leg-duration-marker"><b>${modeLabel(mode)}</b><em>${durationLabel}</em></span>`;
}
```

For each selected-day route leg, calculate the midpoint from its rendered polyline and create a non-interactive `L.divIcon`. Skip `optional` legs and hide overview labels when `selectedDay === null`.

- [ ] **Step 2: Add next-leg content to route context**

```tsx
const nextLeg = getLegAfter(routeContext.dayId, routeContext.current.index);

{nextLeg && (
  <span className="place-detail-next-leg">
    {modeLabel(nextLeg.mode)} · {nextLeg.durationLabel}
  </span>
)}
```

The context index must come from the current occurrence in the day's `placeIds`, not from `findIndex(place.id)`.

- [ ] **Step 3: Add lightweight and responsive styles**

```css
.route-leg-duration-marker {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.42rem 0.62rem;
  border: 1px solid rgb(255 255 255 / 45%);
  border-radius: 999px;
  background: rgb(12 36 43 / 88%);
  color: #fffaf0;
  box-shadow: 0 8px 24px rgb(6 25 31 / 18%);
  white-space: nowrap;
  pointer-events: none;
}

.route-map-canvas.is-map-zooming .route-leg-duration-marker {
  opacity: 0;
}

@media (max-width: 720px) {
  .route-leg-duration-marker b { font-size: 0; }
  .route-leg-duration-marker b::first-letter { font-size: 0.78rem; }
}
```

- [ ] **Step 4: Run render and playback tests**

Run: `node --test tests/rendered-html.test.mjs tests/trip-playback.test.mjs`

Expected: PASS and no change to camera-follow assertions.

- [ ] **Step 5: Commit transport labels**

```bash
git add app/RouteMap.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: show transport time on selected route legs"
```

### Task 5: Add Verified Images and Complete End-to-End Verification

**Files:**
- Create or replace: `public/hainan/*-verified.webp`
- Modify: `app/trip-data.ts`
- Modify: `docs/research/2026-08-11-hainan-xhs-activity-notes.md`
- Modify: `tests/trip-data.test.mjs`

**Interfaces:**
- Each local image is referenced by a `PhotoSource` that records platform, author/owner, title, and source URL.
- Primary hotels expose exterior/garden, room, target sea view/balcony, and pool/coast imagery where verified source material is available.

- [ ] **Step 1: Add image-source assertions**

```js
for (const place of places.filter((place) => !["transport"].includes(place.category))) {
  assert.ok(place.image, `${place.id} needs a verified local image`);
  assert.match(place.image.src, /^\/hainan\//);
  assert.match(place.image.creditUrl, /^https:\/\//);
}
```

- [ ] **Step 2: Acquire and verify the approved visual set**

Use location-matched official or user-provided Xiaohongshu imagery. For each primary hotel, retain separate visual roles: exterior/garden, room, sea-view balcony, pool/coast. Do not use an unrelated stock photo when a role cannot be verified; keep the source link visible instead.

- [ ] **Step 3: Update source notes**

Record the exact hotel/place, visual role, page title, owner/author, URL, and verification date in `docs/research/2026-08-11-hainan-xhs-activity-notes.md`.

- [ ] **Step 4: Run the full verification suite**

Run: `npm test`

Expected: build succeeds and all rendered HTML, data, camera, and playback tests pass.

Run: `npm run lint`

Expected: exit code 0.

- [ ] **Step 5: Start the local site and visually verify**

Run: `npm run dev`

Verify at `http://localhost:5173/`:

- Start gate remains still until clicked.
- Seven days show only Haikou, Lingshui, and Sanya lodging.
- Day 2 and Day 5 are marked as hotel changes.
- Selecting a day shows route-leg duration labels without cluttering overview mode.
- Playback transport icon follows the route while the corresponding duration badge remains aligned.
- Arrival dialog shows next transport mode and duration.
- Mobile layout does not cover the traveler marker or primary controls.

- [ ] **Step 6: Commit verified content and sources**

```bash
git add public/hainan app/trip-data.ts docs/research/2026-08-11-hainan-xhs-activity-notes.md tests/trip-data.test.mjs
git commit -m "content: add verified slow trip hotel and place imagery"
```
