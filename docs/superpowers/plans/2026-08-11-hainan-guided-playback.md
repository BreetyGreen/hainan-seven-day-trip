# 海南七日引导式地图播放 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将海南七日地图改为手动开始、关键到站自动弹出图文详情并等待继续的引导式旅程，同时补齐真实地点图片。

**Architecture:** 在 `trip-playback.ts` 中集中定义“哪些站需要人工确认”的纯函数，由 `RouteMap.tsx` 负责把播放阶段映射为弹窗和继续动作。图片继续使用本地静态资源与 `PhotoSource` 元数据，避免外链图片不稳定；现有 Leaflet 实例和单一动画循环保持不变。

**Tech Stack:** React 19、TypeScript、Leaflet、CSS、Vite/Vinext、Node test runner

## Global Constraints

- 首屏不自动播放，只有用户点击“开始七日旅程”才开始。
- 只在景点、海湾海岸、餐饮、首次住宿基地和 Day 4 换酒店时自动暂停。
- 机场、纯交通节点和重复酒店返回自动继续。
- 关键节点必须在站内自动展示完整图文，并由用户点击“继续前往下一站”。
- 图片必须与真实地点匹配且保留来源；无法核验时不冒用图片。
- 本轮只修改和验证本地项目，不发布。

---

### Task 1: 播放决策模型

**Files:**
- Modify: `app/trip-playback.ts`
- Test: `tests/trip-playback.test.mjs`

**Interfaces:**
- Consumes: `Place`, `PlaybackStage`
- Produces: `requiresManualArrival(place: Place, previouslyVisitedStayIds: ReadonlySet<string>): boolean`

- [ ] **Step 1: Write the failing test**

```js
assert.equal(requiresManualArrival(coastPlace, new Set()), true);
assert.equal(requiresManualArrival(airportPlace, new Set()), false);
assert.equal(requiresManualArrival(hotelPlace, new Set()), true);
assert.equal(requiresManualArrival(hotelPlace, new Set([hotelPlace.id])), false);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/trip-playback.test.mjs`
Expected: FAIL because `requiresManualArrival` is not exported.

- [ ] **Step 3: Write minimal implementation**

```ts
const interactiveCategories = new Set(["oldtown", "coast", "garden", "food", "culture", "harbor", "viewpoint"]);

export function requiresManualArrival(place: Place, visitedStays: ReadonlySet<string>) {
  if (place.category === "stay") return !visitedStays.has(place.id);
  return interactiveCategories.has(place.category);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/trip-playback.test.mjs`
Expected: PASS.

### Task 2: 手动开始和自动到站详情

**Files:**
- Modify: `app/RouteMap.tsx`
- Modify: `app/globals.css`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `requiresManualArrival`, current `PlaybackStage`
- Produces: start gate, arrival detail state, `continueFromArrival()`

- [ ] **Step 1: Write the failing test**

```js
assert.match(routeMapSource, /开始七日旅程/);
assert.match(routeMapSource, /继续前往下一站/);
assert.doesNotMatch(routeMapSource, /autoplayStartedRef/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/rendered-html.test.mjs`
Expected: FAIL because autoplay still exists and the new controls do not.

- [ ] **Step 3: Implement start gate and decision boundary**

```tsx
{playbackStatus === "idle" && selectedDay === null && (
  <JourneyStartGate onStart={() => startPlaybackRef.current(true)} />
)}
```

When `enterStage()` reaches an interactive stop, set `playbackStatus` to `paused`, open `PlaceDetailDialog` with `arrivalMode: true`, and record the stage index. `continueFromArrival()` acknowledges that index, closes the detail, then advances to the next stage without reopening the same stop.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/rendered-html.test.mjs tests/trip-playback.test.mjs`
Expected: PASS.

### Task 3: 真实地点图片和来源

**Files:**
- Modify: `app/trip-data.ts`
- Create: `public/hainan/<matched-place>.webp`
- Modify: `docs/research/2026-08-11-hainan-xhs-activity-notes.md`
- Test: `tests/trip-data.test.mjs`

**Interfaces:**
- Consumes: verified Xiaohongshu note URLs and downloaded image files
- Produces: at least 11 places with `PhotoSource`

- [ ] **Step 1: Write the failing test**

```js
assert.ok(imageStops.length >= 11, `expected at least 11 matched place images, got ${imageStops.length}`);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/trip-data.test.mjs`
Expected: FAIL with the current image count.

- [ ] **Step 3: Add only verified matching images**

For each image, add a local `/hainan/*.webp` path and complete `PhotoSource` attribution. Do not add a photo when the exact place cannot be confirmed from the note.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/trip-data.test.mjs`
Expected: PASS with at least 11 local image sources.

### Task 4: Product documentation and full verification

**Files:**
- Modify: `PRODUCT.md`
- Modify: `DESIGN.md`

**Interfaces:**
- Consumes: completed guided playback behavior
- Produces: durable product/design truth aligned with the implementation

- [ ] **Step 1: Update product and design contracts**

Replace auto-play requirements with manual start, meaningful-stop pauses, in-page details, explicit continuation and verified-photo coverage.

- [ ] **Step 2: Run the full suite**

Run: `npm test`
Expected: build and all Node tests PASS.

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: PASS with no errors.

- [ ] **Step 4: Verify in a local browser**

Check idle after 1.5 seconds, click start, observe automatic key-stop detail, click continue, click a later map marker while paused, and inspect a mobile viewport.

- [ ] **Step 5: Inspect the final diff**

Run: `git diff --check && git status --short`
Expected: no whitespace errors; only scoped local changes are listed.

