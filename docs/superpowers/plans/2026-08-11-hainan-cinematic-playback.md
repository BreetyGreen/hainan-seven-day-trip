# Hainan Cinematic Playback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an auto-playing, replayable seven-day journey animation that draws the real route, follows the traveler, and pauses at every place with activity-specific motion.

**Architecture:** Generate a deterministic playback plan from the existing `days`, `places`, and route GeoJSON, then execute it in `RouteMap` with a ref-driven animation loop. Keep the static route on its existing Canvas and draw progress on one separate Canvas so camera movement and zoom remain responsive.

**Tech Stack:** React 19, TypeScript, Leaflet 1.9 Canvas renderer, CSS animations, Node test runner.

## Global Constraints

- Use only the existing 17 verified places and the existing 9 connected GeoJSON route legs.
- Do not add unrelated or stock imagery.
- Preserve existing click popups, hotel recommendations, one/ two-person guidance, and Day 4 change markers.
- Autoplay must be disabled for `prefers-reduced-motion: reduce`.
- React must not re-render on every animation frame.

---

### Task 1: Deterministic playback plan

**Files:**
- Create: `app/trip-playback.ts`
- Create: `tests/trip-playback.test.mjs`

**Interfaces:**
- Produces: `createPlaybackPlan(days, places, features): PlaybackDay[]`
- Produces: `playbackKindForPlace(place): "transport" | "explore" | "meal" | "rest"`

- [ ] Write tests asserting seven ordered days, every `placeIds` entry represented, monotonic route indices, connected travel segments, and all four activity kinds.
- [ ] Run `node --test tests/trip-playback.test.mjs` and confirm the missing module/API failure.
- [ ] Implement route concatenation, nearest forward coordinate matching, segment downsampling, activity classification, and timing metadata.
- [ ] Re-run the test and confirm it passes.

### Task 2: Leaflet playback engine

**Files:**
- Modify: `app/RouteMap.tsx`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `createPlaybackPlan` and `PlaybackStage` from Task 1.
- Produces: auto start, pause/resume, replay, moving marker, progressive route, and camera-follow behavior.

- [ ] Add source-level tests for autoplay gating, `requestAnimationFrame`, separate `L.canvas` playback renderer, `flyTo`, `panInside`, pause/resume, replay, and selected-day interruption.
- [ ] Run the rendered test and confirm the new assertions fail.
- [ ] Implement two-mode playback polylines, moving traveler marker, cancellable animation loop, auto-start, camera throttling, drag-to-pause, and cleanup.
- [ ] Re-run the rendered test and confirm it passes.

### Task 3: Journey HUD and activity choreography

**Files:**
- Modify: `app/RouteMap.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: playback status, active day, active stop, and overall progress from Task 2.
- Produces: `.playback-timeline`, `.playback-stop-card`, `.activity-motion-*`, and playback control buttons.

- [ ] Add failing assertions for seven progress nodes, activity card content, play/pause/replay copy, and four distinct motion classes/keyframes.
- [ ] Implement compact D1–D7 progress rail, progress bar, responsive stop card, transport/explore/meal/rest motion, and reduced-motion fallbacks.
- [ ] Run rendered tests and lint until the new feature is green without new warnings.

### Task 4: Full verification

**Files:**
- Verify: all affected source, tests, and rendered app.

- [ ] Run `npm test` and require all tests and build to pass.
- [ ] Run `npm run lint` and require no new errors or warnings from playback files.
- [ ] In the browser, verify autoplay starts, route/traveler positions change, D1 becomes active, the activity card changes across at least two stops, pause freezes movement, resume continues, and replay resets to Wuhan.
- [ ] Verify a normal place click still opens its sourced image/detail popup and the hotel side panel remains usable.
- [ ] Verify no console errors and finalize the browser tab.

