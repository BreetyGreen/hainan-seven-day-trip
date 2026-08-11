# Hainan Smart Camera and Complete Arrivals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add spatially aware map zooming and complete route context to every meaningful Hainan arrival.

**Architecture:** Keep camera decisions and route-context derivation as pure tested functions, then let `RouteMap` translate those intents into Leaflet operations. Extend existing sourced place data instead of creating a second itinerary model.

**Tech Stack:** TypeScript, React 19, Leaflet 1.9, vinext, Node test runner, CSS.

## Global Constraints

- Use the approved balanced zoom levels: flight 5–6, intercity drive 8–9, near-suburban drive 11, same-city drive 12–13, activity arrival 14–15, stay arrival 13.
- Zoom once when a stage starts; pan during travel without per-frame zoom changes.
- Keep all details in-page; external links are evidence only.
- Do not make costs a primary UI element.
- Do not attach unverified or merely similar images to places.

---

### Task 1: Pure smart-camera policy

**Files:**
- Create: `app/trip-camera.ts`
- Create: `tests/trip-camera.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `cameraForTravel(segment: Pick<PlaybackSegment, "mode" | "from" | "to" | "coordinates">): CameraIntent`
- Produces: `cameraForArrival(place: Pick<Place, "category" | "id">): CameraIntent`
- `CameraIntent` contains `zoom`, `duration`, and `kind`.

- [ ] **Step 1: Write failing tests** covering flight, intercity, near-suburban, same-city, activity arrival, stay arrival, and airport arrival.
- [ ] **Step 2: Run `node --test tests/trip-camera.test.mjs`** and confirm failure because `app/trip-camera.ts` is missing.
- [ ] **Step 3: Implement haversine distance and the two camera policy functions** with the exact approved zoom bands.
- [ ] **Step 4: Add the new test file to `npm test` and rerun the targeted test** expecting all camera cases to pass.

### Task 2: Route context for an exact stop

**Files:**
- Modify: `app/trip-playback.ts`
- Modify: `tests/trip-playback.test.mjs`

**Interfaces:**
- Produces: `createRouteContext(day: PlaybackDay, stopIndex: number): RouteContext`.
- `RouteContext` contains `dayId`, `dayTitle`, `position`, `total`, `previous`, `current`, `next`, `remaining`, and `nextMode`.

- [ ] **Step 1: Write failing tests** for a middle stop, a final stop, and a repeated hotel occurrence.
- [ ] **Step 2: Run `node --test tests/trip-playback.test.mjs`** and confirm failure because `createRouteContext` is absent.
- [ ] **Step 3: Implement `RouteContext` and `createRouteContext`** using the exact `stopIndex`, with an explicit range error for invalid indexes.
- [ ] **Step 4: Rerun the targeted test** expecting all route-context cases to pass.

### Task 3: Apply smart camera and render complete arrival context

**Files:**
- Modify: `app/RouteMap.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `cameraForTravel`, `cameraForArrival`, and `createRouteContext`.
- `PlaceDetailDialog` receives `routeContext: RouteContext`.

- [ ] **Step 1: Add failing render-source assertions** for smart camera imports, `place-detail-route-context`, “上一站”, “下一站”, and “今日剩余”.
- [ ] **Step 2: Run `node --test tests/rendered-html.test.mjs`** and confirm the new assertions fail.
- [ ] **Step 3: Replace fixed click/arrival zoom values** with `cameraForArrival`, and apply `cameraForTravel` once inside `enterStage` for travel stages before normal panning continues.
- [ ] **Step 4: Build exact playback and manual-click route contexts** and render a three-stop route band plus remaining-stop chips in the dialog.
- [ ] **Step 5: Add responsive CSS** so the route band is readable on desktop and becomes a stacked layout below 430px.
- [ ] **Step 6: Rerun rendered HTML and playback tests** expecting them to pass.

### Task 4: Complete missing sourced content

**Files:**
- Modify: `app/trip-data.ts`
- Modify: `docs/research/2026-08-11-hainan-xhs-activity-notes.md`
- Create: `public/hainan/xinglong-garden-xhs.webp`
- Create: `public/hainan/xinglong-market-xhs.webp`
- Create: `public/hainan/xincun-port-xhs.webp`
- Modify: `tests/trip-data.test.mjs`

**Interfaces:**
- Consumes the existing `Place.image` and `Activity` shapes.

- [ ] **Step 1: Add failing content tests** requiring every non-transport/non-stay activity point to have an attributed local image and requiring each airport to have distinct, non-generic activity instructions.
- [ ] **Step 2: Run `node --test tests/trip-data.test.mjs`** and confirm failures name the three missing image points and generic airports.
- [ ] **Step 3: Research and visually verify one matching image for each missing activity point**, retaining platform, author, note title, and URL in the research log.
- [ ] **Step 4: Copy only the three selected images to `public/hainan/`** and connect them to their exact places.
- [ ] **Step 5: Replace generic airport activities** with Wuhan departure, Haikou arrival/collection, and Sanya return/vehicle-return instructions.
- [ ] **Step 6: Rerun the data tests** expecting full image and airport-detail coverage.

### Task 5: Documentation and end-to-end verification

**Files:**
- Modify: `PRODUCT.md`
- Modify: `DESIGN.md`

**Interfaces:**
- Documents the camera policy and complete arrival card contract implemented above.

- [ ] **Step 1: Update product and design documents** with balanced zoom levels, route context, and complete activity-image coverage.
- [ ] **Step 2: Run `npm test`** expecting build success and zero failing tests.
- [ ] **Step 3: Run `npm run lint` and `git diff --check`** expecting zero lint errors and no whitespace errors.
- [ ] **Step 4: In the local browser, verify idle start, flight overview, intercity view, Day 6 city zoom, arrival zoom, route context, and continue behavior.**
- [ ] **Step 5: Review `git status --short`** and confirm only intended project files and verified image assets remain.

