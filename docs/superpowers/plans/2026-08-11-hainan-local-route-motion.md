# Hainan Local Route Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Hainan short-distance playback as stable and legible as the reference site without changing the accepted intercity animation.

**Architecture:** Add a pure distance-based route sampler and a pure camera comfort-zone policy, then integrate both into the existing Leaflet playback loop. Extend the existing camera policy so walking gets street-level zoom while the current island and intercity branches remain unchanged.

**Tech Stack:** TypeScript, React 19, Leaflet 1.9, Node test runner, vinext.

## Global Constraints

- Preserve existing arrival dialogs, pause/resume, photo rail, timeline, content, and intercity camera behavior.
- The progressive line and traveler marker must share one sampled route-head coordinate.
- Walking uses zoom 16; same-city driving remains zoom 13.
- Normal camera follow runs only outside the central 30%–70% comfort zone.
- Reduced motion keeps immediate map positioning.

---

### Task 1: Distance-based route sampling

**Files:**
- Create: `app/trip-motion.ts`
- Create: `tests/trip-motion.test.mjs`

**Interfaces:**
- Consumes: `RouteCoordinate` from `app/trip-playback.ts`.
- Produces: `sampleRouteAtProgress(coordinates, progress)` returning `{ visibleCoordinates, point, bearing }`.

- [ ] **Step 1: Write the failing sampler tests**

Test an uneven route `[[0,0],[9,0],[10,0]]` and assert that progress `0.5` returns `[5,0]`, not the second coordinate. Also test progress `0` and `1`, visible coordinates, and bearing.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/trip-motion.test.mjs`

Expected: FAIL because `app/trip-motion.ts` does not exist.

- [ ] **Step 3: Implement the minimal sampler**

Compute latitude-adjusted segment lengths, find the segment containing `totalLength * progress`, interpolate the route head, and return the partial coordinate list plus bearing.

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/trip-motion.test.mjs`

Expected: all sampler tests pass.

### Task 2: Mode-aware local camera and comfort zone

**Files:**
- Modify: `app/trip-camera.ts`
- Modify: `tests/trip-camera.test.mjs`

**Interfaces:**
- Produces: `cameraForTravel(segment)` with walking zoom 16.
- Produces: `pointOutsideCameraComfortZone(point, viewport, band?)` for projected container coordinates.
- Produces: a throttled follow policy whose interval is used only for comfort-zone checks.

- [ ] **Step 1: Write failing camera tests**

Add a same-city walking segment assertion for `{ kind: "local", zoom: 16, duration: 0.72 }`. Add viewport tests proving points inside `[30%,70%]` are accepted and points outside trigger follow.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/trip-camera.test.mjs`

Expected: walking zoom test fails with 13 and the comfort-zone export is missing.

- [ ] **Step 3: Implement the minimal camera policy**

Check `segment.mode === "walk"` before the same-city branch. Implement the comfort-zone helper using projected `x/y` and viewport `width/height` values.

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/trip-camera.test.mjs`

Expected: all camera tests pass while the existing flight, island, suburban, arrival, and timing assertions remain green.

### Task 3: Integrate stable local motion into Leaflet playback

**Files:**
- Modify: `app/RouteMap.tsx:9-25`
- Modify: `app/RouteMap.tsx:866-900`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `sampleRouteAtProgress` and `pointOutsideCameraComfortZone`.
- Preserves: `traveler.setLatLng(position)` and `setModeLine(mode, partial)`.

- [ ] **Step 1: Write failing source-contract assertions**

Require `RouteMap` to call `sampleRouteAtProgress`, use `sample.visibleCoordinates`, project through `map.latLngToContainerPoint`, call the comfort-zone helper, and remove coordinate-index interpolation and unconditional cadence-based `panTo`.

- [ ] **Step 2: Verify RED**

Run: `npm run build && node --test tests/rendered-html.test.mjs`

Expected: FAIL because `RouteMap` still calculates `scaled = progress * (coordinates.length - 1)`.

- [ ] **Step 3: Implement the integration**

Use one sample per frame for the partial line and marker. On each throttled camera check, project the sampled point and call `panTo` only when it is outside the comfort zone. Use a gentle 0.42 second pan with `easeLinearity: 0.22` and `noMoveStart: true`.

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/trip-motion.test.mjs tests/trip-camera.test.mjs tests/rendered-html.test.mjs`

Expected: all focused tests pass.

### Task 4: Full verification and browser acceptance

**Files:**
- Modify: `DESIGN.md`

**Interfaces:**
- Consumes: local site `http://localhost:5173/`.
- Produces: verified local short-distance playback.

- [ ] **Step 1: Document the new motion contract**

Update `DESIGN.md` to describe distance-based sampling, walking zoom 16, and comfort-zone camera follow.

- [ ] **Step 2: Run automated gates**

Run: `npm test`

Expected: build succeeds and every test passes.

Run: `npm run lint`

Expected: zero errors.

- [ ] **Step 3: Run the production build separately**

Run: `npm run build`

Expected: exit code 0.

- [ ] **Step 4: Browser acceptance**

Play a short local leg on `http://localhost:5173/`. Confirm street-scale zoom for walking, stable speed along the route, no camera pan while the traveler remains in the central comfort zone, and no regression in an intercity leg.

- [ ] **Step 5: Commit the verified implementation**

Stage only the motion-related source, tests, documentation, and this plan. Commit with `fix: stabilize Hainan local route motion`.
