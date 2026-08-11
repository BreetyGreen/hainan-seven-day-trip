# Hainan Journey Photo Rail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Hainan itinerary imagery and add a responsive, clickable bottom journey-photo rail that follows map playback.

**Architecture:** Keep `trip-data.ts` as the source of truth for attributed photos, add a pure `buildJourneyPhotoItems(days, places)` selector, and render a focused `JourneyPhotoRail` inside the existing map layer. The rail reuses `openPlaceDetail` and derives its playback selection from `visibleStage`, so it does not duplicate the map, modal, or playback state machine.

**Tech Stack:** React 19, TypeScript 5.9, Leaflet 1.9, Vinext/Vite, Node test runner, local WebP assets, Codex in-app browser visual verification.

## Global Constraints

- Keep all places real and every photo source attributable by platform, owner/author, title, and URL.
- Use Xiaohongshu for atmosphere when a stable, location-matched source is available; use official/Ctrip imagery for hotel identity and room/facility verification.
- Show 8–10 non-airport photo nodes in first-appearance day order.
- Clicking a photo pauses playback, flies to the place, and opens the existing in-page detail dialog.
- Playback highlights and scrolls the rail only when the active photo changes, never per animation frame.
- Desktop and 390 px mobile layouts must not cover core map controls or introduce page-level horizontal overflow.
- Do not add a second day navigator, album page, upload system, or new dependency.

---

### Task 1: Lock the Journey Photo Selection Contract

**Files:**
- Create: `app/journey-photos.ts`
- Create: `tests/journey-photos.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `Day[]` and `Place[]` from `app/trip-data.ts`.
- Produces: `JourneyPhotoItem` and `buildJourneyPhotoItems(days, places): JourneyPhotoItem[]`.

- [ ] **Step 1: Write the failing selector tests**

```js
import { days, places } from "../app/trip-data.ts";
import { buildJourneyPhotoItems } from "../app/journey-photos.ts";

test("builds an ordered non-airport journey photo rail", () => {
  const items = buildJourneyPhotoItems(days, places);
  assert.ok(items.length >= 8 && items.length <= 10);
  assert.equal(items.some((item) => item.place.category === "transport"), false);
  assert.deepEqual(items.map((item) => item.dayId), [...items.map((item) => item.dayId)].sort((a, b) => a - b));
  assert.equal(new Set(items.map((item) => item.place.id)).size, items.length);
});

test("keeps every rail image attributable", () => {
  for (const item of buildJourneyPhotoItems(days, places)) {
    assert.match(item.place.image.src, /^\/hainan\/.*\.webp$/);
    assert.match(item.place.image.creditUrl, /^https:\/\//);
  }
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node --test tests/journey-photos.test.mjs`

Expected: FAIL because `app/journey-photos.ts` does not exist.

- [ ] **Step 3: Implement the pure selector**

```ts
export type JourneyPhotoItem = { id: string; dayId: number; place: Place };

export function buildJourneyPhotoItems(allDays: Day[], allPlaces: Place[]): JourneyPhotoItem[] {
  const placeById = new Map(allPlaces.map((place) => [place.id, place]));
  const seen = new Set<string>();
  return allDays.flatMap((day) => day.placeIds.flatMap((placeId) => {
    const place = placeById.get(placeId);
    if (!place?.image || place.category === "transport" || seen.has(place.id)) return [];
    seen.add(place.id);
    return [{ id: `${day.id}-${place.id}`, dayId: day.id, place }];
  })).slice(0, 10);
}
```

- [ ] **Step 4: Add the test to `npm test` and verify GREEN**

Run: `node --test tests/journey-photos.test.mjs`

Expected: 2 passing tests.

### Task 2: Curate and Record the Visual Set

**Files:**
- Modify: `app/trip-data.ts`
- Modify: `docs/research/2026-08-11-hainan-xhs-activity-notes.md`
- Create/replace: `public/hainan/*.webp`
- Modify: `tests/trip-data.test.mjs`

**Interfaces:**
- Produces location-matched `PhotoSource` records consumed by the photo rail and detail dialog.

- [ ] **Step 1: Inspect Xiaohongshu and authoritative hotel sources**

Search the exact current itinerary locations. Reject unrelated hotels, generic Hainan stock images, unstable hotlinks, large watermarks, and images that cannot support a 3:2 thumbnail crop.

- [ ] **Step 2: Download and convert selected public images**

Store source-matched files as WebP under `public/hainan/`. Preserve the original source URL in `PhotoSource`; do not hotlink images from Xiaohongshu or hotel pages.

- [ ] **Step 3: Extend image assertions**

```js
for (const place of places.filter((place) => place.image)) {
  assert.match(place.image.src, /^\/hainan\/.*\.webp$/);
  assert.ok(existsSync(join(process.cwd(), "public", place.image.src)));
  assert.ok(["小红书", "官网"].includes(place.image.platform));
}
```

- [ ] **Step 4: Record each selected image**

Add exact place, visual role, platform, owner/author, source page, local file, and verification date to the research note.

### Task 3: Build the Interactive Bottom Rail

**Files:**
- Modify: `app/RouteMap.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `buildJourneyPhotoItems`, `openPlaceDetail`, `visibleStage`, and `selectedDay`.
- Produces: `JourneyPhotoRail` with expand/collapse, click-to-detail, active state, and playback follow.

- [ ] **Step 1: Write failing render-contract assertions**

```js
assert.match(routeMap, /function JourneyPhotoRail/);
assert.match(routeMap, /journey-photo-rail/);
assert.match(routeMap, /scrollIntoView/);
assert.match(routeMap, /沿着照片看七天/);
assert.match(css, /\.journey-photo-card\.is-active/);
assert.match(css, /scroll-snap-type: x mandatory/);
```

- [ ] **Step 2: Run the render test and verify RED**

Run: `node --test tests/rendered-html.test.mjs`

Expected: FAIL on the missing photo-rail contracts.

- [ ] **Step 3: Implement `JourneyPhotoRail`**

Render semantic buttons with lazy local images, platform labels, Day and place text. Clicking calls a supplied `onOpen(item)` callback. Keep a `Map<string, HTMLButtonElement>` ref and call `scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest", inline: "center" })` only when `activeId` changes.

- [ ] **Step 4: Wire the rail to the existing map**

Derive `activePhotoId` from the visible stop or travel destination. On rail click: pause playback, call `openPlaceDetail(item.place, item.dayId)`, and keep the selected ID for the highlight.

- [ ] **Step 5: Add responsive styles**

Desktop: bottom-centered warm-white rail, left journal label, 6–7 cards visible, arrow controls, active coral outline. Mobile: 12 px side margins, 2.5 cards visible, touch scroll snap, hidden arrow controls, compact state during dialogs/playback.

- [ ] **Step 6: Verify GREEN**

Run: `node --test tests/rendered-html.test.mjs tests/journey-photos.test.mjs`

Expected: all tests pass.

### Task 4: Visual QA and Full Verification

**Files:**
- Create: `design-qa.md`
- Modify as needed: `app/RouteMap.tsx`, `app/globals.css`

**Interfaces:**
- Consumes the user screenshot and the local full-route state.
- Produces a passed design QA report and a clean verified build.

- [ ] **Step 1: Run the complete automated gate**

Run: `npm test`

Expected: build succeeds and all tests pass.

Run: `npm run lint`

Expected: exit code 0 with no warnings.

- [ ] **Step 2: Verify desktop interactions in the in-app browser**

Check rail expansion, horizontal navigation, card click, correct detail image/content, and playback-driven highlight. Confirm no console errors.

- [ ] **Step 3: Verify 390 × 844 mobile layout**

Confirm no page-level overflow, 2.5 thumbnail visibility, touch-scroll layout, and no overlap with primary map controls or detail continuation.

- [ ] **Step 4: Compare reference and prototype**

Capture the prototype in the same “full route + rail expanded” state as the supplied reference. Record visible differences and fixes in `design-qa.md`; finish only when the file says `final result: passed`.

- [ ] **Step 5: Commit the completed feature**

```bash
git add app public/hainan tests docs/research package.json design-qa.md
git commit -m "feat: add interactive Hainan journey photo rail"
```
