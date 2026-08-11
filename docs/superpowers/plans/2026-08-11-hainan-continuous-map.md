# Hainan Continuous Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a default continuous Day 1–7 Hainan route with per-day filters, concrete map popups, and exactly one hotel change.

**Architecture:** Keep itinerary truth in `trip-data.ts`, route geometry in one local GeoJSON collection, and all marker popup behavior inside `RouteMap.tsx`. `page.tsx` becomes a thin shell with only mode and route-filter state.

**Tech Stack:** Next 16, React 19, TypeScript, Leaflet 1.9, local GeoJSON, Node test runner, Vinext.

## Global Constraints

- Default view is the complete Day 1–7 route.
- Preserve Day 1–7 filtering.
- Use exactly two hotels and one Day 4 hotel change.
- Every activity popup contains concrete steps and practical cautions.
- No budget UI and no unrelated decorative imagery.

---

### Task 1: Data contract and route invariants

**Files:**
- Modify: `tests/trip-data.test.mjs`
- Modify: `app/trip-data.ts`

**Interfaces:**
- Produces: `Place.activity`, `hotels`, `days`, `getDayRoute(dayId)`.

- [ ] Add failing assertions for exactly two hotels, two unique overnight bases, one `isHotelChange` day, and detailed activity steps.
- [ ] Run `node --test tests/trip-data.test.mjs` and confirm the old four-hotel data fails.
- [ ] Replace the route and activity data with the two-base itinerary.
- [ ] Re-run the data tests and confirm they pass.

### Task 2: Continuous and per-day geometry

**Files:**
- Modify: `scripts/fetch-routes.mjs`
- Modify: `public/routes/hainan-east-coast.geojson`
- Test: `tests/trip-data.test.mjs`

**Interfaces:**
- Produces: seven ordered, endpoint-continuous route features.

- [ ] Add endpoint-continuity assertions for adjacent day features.
- [ ] Run the route test and confirm the old geometry fails.
- [ ] Generate Day 1–7 geometry from the new daily stops.
- [ ] Run the route tests and inspect feature labels/distances.

### Task 3: Leaflet popup interaction

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/RouteMap.tsx`

**Interfaces:**
- Consumes: `selectedDay: number | null`, `Place.activity`.
- Produces: marker-bound activity popups and complete-route initial rendering.

- [ ] Add failing source/SSR assertions for `bindPopup`, popup semantics, and removal of `selectedPlaceId` callback state.
- [ ] Run the rendered tests and confirm failure.
- [ ] Implement escaped popup HTML, all-route rendering, per-day filtering and stable Leaflet lifecycle.
- [ ] Run tests and lint.

### Task 4: Simplified application shell

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `PRODUCT.md`
- Modify: `DESIGN.md`

**Interfaces:**
- Consumes: `days`, `hotels`, `RouteMap`.
- Produces: compact header, full/day segmented filter, two-base summary.

- [ ] Replace the right story sheet and long day rail with the compact map shell.
- [ ] Update responsive styles for desktop and 390px mobile viewports.
- [ ] Update product and design documents to the popup-first interaction.
- [ ] Run SSR tests, lint and production build.

### Task 5: Browser verification

**Files:**
- No production files unless a reproduced issue requires a TDD fix.

- [ ] Open the local app with the full route selected.
- [ ] Click an activity marker and verify the popup includes time, steps and source.
- [ ] Select Day 4 and verify only the move-day route/nodes are emphasized.
- [ ] Return to full route and verify all seven segments.
- [ ] Switch one/two-person mode and verify guidance updates.
- [ ] Test 390×844 and desktop viewport; inspect console logs.
