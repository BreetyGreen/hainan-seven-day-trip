# 海南七日行程证据矩阵重建 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用可追溯的多源证据重新生成海南七日行程的吃、穿、住、行、玩内容，并在地图地点详情中直接呈现可执行结论。

**Architecture:** 将来源记录、推荐实体和页面展示分开。`research-evidence.ts` 保存去重后的来源证据，`trip-recommendations.ts` 保存按地点与日期聚合的最终结论，采集脚本只负责解析公开页面和生成研究清单；React 组件只消费稳定的数据接口。现有地图路线、Plan A/B 和三基地结构继续作为骨架。

**Tech Stack:** Next.js 16、React 19、TypeScript 5.9、Leaflet 1.9、Node.js 24 test runner、公开网页 SSR 数据、OSRM/OpenStreetMap 路线。

## Global Constraints

- 行程固定为武汉出发、2026 年 9 月 12 日左右、7 天 6 晚、自驾、海口 → 万宁 → 陵水 → 三亚。
- Plan A 与 Plan B 均为海口、万宁、陵水三个住宿基地，最多两次换宿。
- 候选池不少于 100 条独立记录，深读池为 40–60 篇代表内容；同一篇多图笔记只计一次。
- 最终推荐至少包含体验来源与事实来源；酒店必须同时具有体验、酒店/OTA 和地图三类证据。
- 本轮只更新本地版本，不执行公网部署。
- 先写失败测试并确认按预期失败，再写生产代码。

---

### Task 1: 建立可审计的来源数据模型与去重统计

**Files:**
- Create: `app/research-evidence.ts`
- Create: `tests/research-evidence.test.mjs`
- Create: `scripts/collect-hainan-evidence.mjs`
- Create: `build/hainan-evidence-snapshot.json`

**Interfaces:**
- Produces: `ResearchEvidence`, `researchEvidence`, `researchMetrics`, `evidenceForEntity(entityId)`。
- Consumes: 公开小红书笔记 SSR、酒店/景区官网、地图和天气页面 URL。

- [ ] **Step 1: Write the failing test**

```js
test("counts independent sources instead of image pages", async () => {
  const source = await readFile(new URL("../app/research-evidence.ts", import.meta.url), "utf8");
  assert.match(source, /candidateCount:\s*(?:10[0-9]|1[1-9][0-9]|[2-9][0-9]{2,})/);
  assert.match(source, /deepReadCount:\s*(?:4[0-9]|5[0-9]|60)/);
  assert.match(source, /new Set\(researchEvidence\.map\(\(item\) => item\.sourceId\)\)/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/research-evidence.test.mjs`

Expected: FAIL because `app/research-evidence.ts` does not exist.

- [ ] **Step 3: Implement the evidence model and collector**

```ts
export type ResearchCategory = "吃" | "穿" | "住" | "行" | "玩";
export type SourceType = "小红书" | "携程" | "酒店官网" | "景区官网" | "地图" | "天气";

export type ResearchEvidence = {
  sourceId: string;
  category: ResearchCategory;
  city: string;
  entityIds: string[];
  sourceType: SourceType;
  title: string;
  author: string;
  url: string;
  publishedAt?: string;
  engagementSnapshot?: { likes?: number; collects?: number; comments?: number; shares?: number; capturedAt: string };
  claims: string[];
  promoRisk: { level: "低" | "中" | "高"; reason: string };
  media: Array<{ url: string; kind: "image" | "video"; entityId?: string }>;
  verifiedAt: string;
  deepRead: boolean;
};

export const evidenceForEntity = (entityId: string) =>
  researchEvidence.filter((item) => item.entityIds.includes(entityId));
```

The collector must resolve short links, parse `window.__INITIAL_STATE__`, extract note ID, author, title, engagement and image list, normalize canonical URLs, and write one record per note ID.

- [ ] **Step 4: Run the collector and test**

Run: `node scripts/collect-hainan-evidence.mjs && node --test tests/research-evidence.test.mjs`

Expected: collector reports at least 100 unique candidates, 40–60 deep reads, and the test passes.

- [ ] **Step 5: Commit**

```bash
git add app/research-evidence.ts tests/research-evidence.test.mjs scripts/collect-hainan-evidence.mjs build/hainan-evidence-snapshot.json
git commit -m "feat: add auditable Hainan evidence catalog"
```

### Task 2: 生成吃穿住行玩最终推荐数据

**Files:**
- Create: `app/trip-recommendations.ts`
- Create: `tests/trip-recommendations.test.mjs`
- Modify: `app/trip-details.ts`
- Modify: `app/trip-data.ts`
- Create: `docs/research/2026-08-14-hainan-evidence-matrix.md`

**Interfaces:**
- Consumes: `researchEvidence`, `evidenceForEntity(entityId)`, existing `places`, `itineraryPlans`。
- Produces: `recommendationsForPlace(placeId)`, `recommendationsForDay(dayId, planId)`, `sanyaBayGuide`。

- [ ] **Step 1: Write the failing coverage test**

```js
test("covers five categories at every executable day", () => {
  for (const planId of ["A", "B"]) {
    for (let dayId = 1; dayId <= 7; dayId += 1) {
      const guide = recommendationsForDay(dayId, planId);
      assert.deepEqual(new Set(guide.items.map((item) => item.category)), new Set(["吃", "穿", "住", "行", "玩"]));
    }
  }
});

test("keeps exactly three hotel bases and two changes", () => {
  for (const plan of itineraryPlans) {
    assert.equal(plan.hotels.length, 3);
    assert.deepEqual(plan.hotels.map((hotel) => hotel.city), ["海口", "万宁", "陵水"]);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/trip-recommendations.test.mjs`

Expected: FAIL because the recommendation module and five-category coverage are missing.

- [ ] **Step 3: Implement typed recommendations**

```ts
export type TripRecommendation = {
  id: string;
  category: ResearchCategory;
  dayIds: number[];
  planIds: Array<"A" | "B">;
  entityId: string;
  title: string;
  summary: string;
  actions: string[];
  fallback?: string;
  price?: string;
  evidenceIds: string[];
  verifiedAt: string;
};

export function recommendationsForDay(dayId: number, planId: "A" | "B") {
  return {
    dayId,
    planId,
    items: tripRecommendations.filter((item) => item.dayIds.includes(dayId) && item.planIds.includes(planId)),
  };
}
```

Populate food with a primary and fallback choice per day; clothing with day-specific top, bottom, shoes, sun/rain items; lodging with room/view/parking/breakfast/caution; transport with duration/parking/fuel; activities with timing, quietness, booking and weather fallback.

- [ ] **Step 4: Add the Sanya four-bay decision guide**

```ts
export const sanyaBayGuide = [
  { id: "sanya-bay", name: "三亚湾", fit: "机场衔接与市区便利", swim: "一般", quietness: "低" },
  { id: "dadonghai", name: "大东海", fit: "餐饮方便与短途活动", swim: "中", quietness: "低" },
  { id: "yalong-bay", name: "亚龙湾", fit: "沙滩与安静度假", swim: "好", quietness: "中高" },
  { id: "haitang-bay", name: "海棠湾", fit: "泡酒店与免税城", swim: "风浪大", quietness: "高" },
].map((bay) => ({
  ...bay,
  evidenceIds: evidenceForEntity(bay.id).map((item) => item.sourceId),
}));
```

Every bay record must receive real `evidenceIds`, map coordinates and hotel candidates before the test can pass.

- [ ] **Step 5: Run tests and commit**

Run: `node --test tests/research-evidence.test.mjs tests/trip-recommendations.test.mjs tests/trip-data.test.mjs`

Expected: all selected tests pass.

```bash
git add app/trip-recommendations.ts app/trip-details.ts app/trip-data.ts tests/trip-recommendations.test.mjs docs/research/2026-08-14-hainan-evidence-matrix.md
git commit -m "feat: rebuild Hainan trip recommendations from evidence"
```

### Task 3: 将证据矩阵放入地点弹窗和酒店选择界面

**Files:**
- Create: `app/PlaceDecisionTabs.tsx`
- Create: `app/SanyaBayHotelGuide.tsx`
- Modify: `app/RouteMap.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Create: `tests/evidence-ui.test.mjs`

**Interfaces:**
- Consumes: `recommendationsForPlace(placeId)`, `recommendationsForDay(dayId, planId)`, `sanyaBayGuide`。
- Produces: `PlaceDecisionTabs`, `SanyaBayHotelGuide` React components。

- [ ] **Step 1: Write the failing UI structure test**

```js
test("renders five in-page decision tabs with evidence metadata", async () => {
  const source = await readFile(new URL("../app/PlaceDecisionTabs.tsx", import.meta.url), "utf8");
  for (const label of ["怎么玩", "吃什么", "住哪里", "怎么去", "怎么穿"]) assert.match(source, new RegExp(label));
  assert.match(source, /来源\s*\{item\.evidenceIds\.length\}/);
  assert.match(source, /核验/);
  assert.match(source, /推广风险/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/evidence-ui.test.mjs`

Expected: FAIL because `PlaceDecisionTabs.tsx` does not exist.

- [ ] **Step 3: Implement the place decision tabs**

```tsx
const tabOrder = [
  ["玩", "怎么玩"],
  ["吃", "吃什么"],
  ["住", "住哪里"],
  ["行", "怎么去"],
  ["穿", "怎么穿"],
] as const;

export function PlaceDecisionTabs({ placeId }: { placeId: string }) {
  const [active, setActive] = useState<ResearchCategory>("玩");
  const items = recommendationsForPlace(placeId).filter((item) => item.category === active);
  return (
    <section className="place-decision-tabs">
      <nav>{tabOrder.map(([category, label]) => <button key={category} onClick={() => setActive(category)}>{label}</button>)}</nav>
      {items.map((item) => (
        <article key={item.id}>
          <h4>{item.title}</h4><p>{item.summary}</p>
          <small>来源 {item.evidenceIds.length} · 核验 {item.verifiedAt}</small>
        </article>
      ))}
    </section>
  );
}
```

Mount it inside the existing map detail modal below the primary image. Keep the external source link as a secondary action.

- [ ] **Step 4: Implement the four-bay hotel map and comparison matrix**

Render four bay markers, fit/quietness/swim/transport labels, candidate hotels and a clear note that the default itinerary keeps the Lingshui base instead of adding a fourth hotel.

- [ ] **Step 5: Run tests and commit**

Run: `node --test tests/evidence-ui.test.mjs tests/rendered-html.test.mjs tests/private-social-gallery.test.mjs`

Expected: all selected tests pass.

```bash
git add app/PlaceDecisionTabs.tsx app/SanyaBayHotelGuide.tsx app/RouteMap.tsx app/page.tsx app/globals.css tests/evidence-ui.test.mjs
git commit -m "feat: show five-part trip decisions on the map"
```

### Task 4: 重新生成真实道路、交通时间和换宿链路

**Files:**
- Modify: `scripts/fetch-hainan-routes.mjs`
- Modify: `public/routes/hainan-plan-a.geojson`
- Modify: `public/routes/hainan-plan-b.geojson`
- Modify: `app/trip-motion.ts`
- Modify: `tests/trip-legs.test.mjs`
- Modify: `tests/trip-motion.test.mjs`

**Interfaces:**
- Consumes: itinerary day place order and OSRM route responses。
- Produces: continuous route features with `distanceKm`, `durationMinutes`, `mode`, `legId`, parking/timing metadata。

- [ ] **Step 1: Add failing route assertions**

```js
assert.ok(feature.properties.durationMinutes > 0);
assert.ok(feature.properties.distanceKm > 0);
assert.match(feature.properties.source, /OSRM.*OpenStreetMap/i);
assert.deepEqual(markerCoordinate, interpolatedRouteCoordinate);
```

- [ ] **Step 2: Run tests to verify the mismatch or missing metadata fails**

Run: `node --test tests/trip-legs.test.mjs tests/trip-motion.test.mjs`

Expected: FAIL on the new timing, parking or coordinate identity assertions.

- [ ] **Step 3: Regenerate route features and reuse the same coordinates for animation**

Drive animation must consume the exact GeoJSON coordinate array. Camera following may interpolate progress but may not recompute a separate straight-line path.

```ts
export function routeCoordinateAtProgress(coordinates: [number, number][], progress: number) {
  const safe = Math.min(1, Math.max(0, progress));
  const scaled = safe * (coordinates.length - 1);
  const index = Math.min(coordinates.length - 2, Math.floor(scaled));
  const fraction = scaled - index;
  const [fromLng, fromLat] = coordinates[index];
  const [toLng, toLat] = coordinates[index + 1];
  return [fromLng + (toLng - fromLng) * fraction, fromLat + (toLat - fromLat) * fraction] as [number, number];
}
```

- [ ] **Step 4: Run tests and commit**

Run: `node scripts/fetch-hainan-routes.mjs && node --test tests/trip-legs.test.mjs tests/trip-motion.test.mjs tests/trip-camera.test.mjs`

Expected: all selected tests pass.

```bash
git add scripts/fetch-hainan-routes.mjs public/routes app/trip-motion.ts tests/trip-legs.test.mjs tests/trip-motion.test.mjs
git commit -m "fix: align Hainan route timing and marker geometry"
```

### Task 5: 优化地点素材加载和移动端浏览

**Files:**
- Modify: `app/PlacePhotoGallery.tsx`
- Modify: `app/PrivateSocialGallery.tsx`
- Modify: `app/RouteMap.tsx`
- Modify: `app/globals.css`
- Create: `tests/media-performance.test.mjs`

**Interfaces:**
- Consumes: place-bound media and the active place ID。
- Produces: one eager primary image, four lazy thumbnails, incremental gallery expansion。

- [ ] **Step 1: Write the failing performance test**

```js
test("does not preload the complete social library", async () => {
  const gallery = await readFile(new URL("../app/PrivateSocialGallery.tsx", import.meta.url), "utf8");
  assert.match(gallery, /slice\(0,\s*4\)/);
  assert.match(gallery, /loading="lazy"/);
  assert.doesNotMatch(gallery, /cityImages\.map/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/media-performance.test.mjs`

Expected: FAIL because the current gallery renders 8 or 12 initial items.

- [ ] **Step 3: Implement staged image loading and mobile layout**

Show one primary image in the modal, four thumbnails for the active place, and load four more per user request. The city library must not mount until the user opens it. On 390px widths use a bottom sheet with a fixed close control and no horizontal overflow.

```tsx
const [visibleCount, setVisibleCount] = useState(4);
const visibleImages = placeImages.slice(0, visibleCount);
return <>{visibleImages.map((image) => <img key={image.id} src={withBasePath(image.src)} loading="lazy" alt={image.title} />)}
  {visibleCount < placeImages.length && <button onClick={() => setVisibleCount((count) => count + 4)}>再看 4 张</button>}
</>;
```

- [ ] **Step 4: Run tests and commit**

Run: `node --test tests/media-performance.test.mjs tests/private-social-gallery.test.mjs tests/rendered-html.test.mjs`

Expected: all selected tests pass.

```bash
git add app/PlacePhotoGallery.tsx app/PrivateSocialGallery.tsx app/RouteMap.tsx app/globals.css tests/media-performance.test.mjs tests/private-social-gallery.test.mjs
git commit -m "perf: stage place media loading"
```

### Task 6: 完整验证与本地交付

**Files:**
- Modify: `docs/design-qa.md`
- Modify: `docs/research/2026-08-14-hainan-evidence-matrix.md`

**Interfaces:**
- Consumes: all completed tasks。
- Produces: verified local build and QA evidence。

- [ ] **Step 1: Run the full automated suite**

Run: `npm test`

Expected: build succeeds and every Node test reports PASS with zero failures.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: exit code 0 with no ESLint errors.

- [ ] **Step 3: Verify desktop and mobile in the local browser**

Check full route, Plan A/B, seven day filters, three hotel bases, two hotel changes, every map point, five decision tabs, four-bay guide, gallery expansion, playback, and 390px mobile bottom sheet. Record screenshots and observations in `docs/design-qa.md`.

- [ ] **Step 4: Verify evidence counts against the snapshot**

Run: `node scripts/collect-hainan-evidence.mjs --verify`

Expected: candidate, deep-read, independent-source and category counts exactly match `build/hainan-evidence-snapshot.json` and the page copy.

- [ ] **Step 5: Commit the verification record**

```bash
git add docs/design-qa.md docs/research/2026-08-14-hainan-evidence-matrix.md
git commit -m "docs: record Hainan evidence rebuild verification"
```
