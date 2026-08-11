# Hainan Island Camera and Route Marker Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Keep cross-city playback framed around Hainan and make the transport icon occupy the exact same geographic point as the animated route head.

**Architecture:** Extend the pure camera policy with a Hainan-island intent at zoom 10. During route movement, render one Leaflet traveler marker from the same `head` coordinate used to slice the route polyline, and follow it with immediate, non-overlapping camera updates instead of a fixed screen-center overlay.

**Tech Stack:** Next.js, React, TypeScript, Leaflet, Node test runner, CSS.

**Global constraints:** Preserve flight, short-suburban, same-city, and arrival camera behavior. Keep reduced-motion support. Do not change trip content or route geography.

---

### Task 1: Add the Hainan island camera policy

**Files:**
- Modify: `tests/trip-camera.test.mjs`
- Modify: `app/trip-camera.ts`

**Step 1: Write the failing test**

Change the Wanning-to-Lingshui expectation to:

```js
assert.deepEqual(cameraForTravel(segment("drive", wanning, lingshui)), {
  kind: "island",
  zoom: 10,
  duration: 0.8,
});
```

Also keep assertions proving Wuhan-to-Haikou stays at zoom 6, short suburban routes stay at zoom 11, and same-city routes stay at zoom 13.

**Step 2: Run the focused test and confirm RED**

Run: `node --test tests/trip-camera.test.mjs`
Expected: failure because the existing policy returns `intercity` at zoom 9.

**Step 3: Implement the smallest policy change**

Add `island` to `CameraIntent.kind`, define the supported Hainan cities, and return `{ kind: "island", zoom: 10, duration: 0.8 }` for cross-city Hainan routes after the flight, same-city, and short-suburban checks.

**Step 4: Run the focused test and confirm GREEN**

Run: `node --test tests/trip-camera.test.mjs`
Expected: all camera tests pass.

### Task 2: Bind the traveler icon to the route head

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/RouteMap.tsx`
- Modify: `app/globals.css`

**Step 1: Replace fixed-overlay expectations with map-marker expectations**

Add source-level assertions that:

```js
assert.doesNotMatch(routeMap, /journey-camera-lock/);
assert.match(routeMap, /traveler\.setLatLng\(position\)/);
assert.match(routeMap, /traveler\.setOpacity\(1\)/);
assert.match(routeMap, /map\.panTo\(position, \{ animate: false/);
```

Remove the CSS assertion requiring a fixed `left: 50%; top: 50%` overlay.

**Step 2: Run the focused test and confirm RED**

Run: `node --test tests/rendered-html.test.mjs`
Expected: failure while the fixed center overlay still renders and the Leaflet marker stays hidden.

**Step 3: Implement the shared-coordinate marker**

- Remove the rendered `.journey-camera-lock` JSX and its unused state calculation.
- In `renderTravel`, calculate `head` once, use it for both the partial route and `traveler.setLatLng(position)`, then show the Leaflet marker.
- Follow the marker at roughly 90 ms using `map.panTo(position, { animate: false, noMoveStart: true })` so camera easings never queue behind the route animation.
- For reduced motion, set the final camera position immediately.
- Hide the traveler when opening a place detail, arriving, resetting, or stopping playback; resuming playback naturally shows it again on the next route frame.
- Remove unused fixed-overlay CSS while preserving `.journey-traveler` marker styling.

**Step 4: Run the focused test and confirm GREEN**

Run: `node --test tests/rendered-html.test.mjs`
Expected: all rendered-source tests pass.

### Task 3: Document and verify the complete behavior

**Files:**
- Modify: `PRODUCT.md`
- Modify: `DESIGN.md`

**Step 1: Update durable behavior notes**

Document the zoom hierarchy (flight 6, Hainan cross-city 10, short suburban 11, same-city 13) and the invariant that the route head and traveler marker use the same Leaflet coordinate.

**Step 2: Run the complete automated suite**

Run: `npm test`
Expected: all tests pass.

Run: `npm run lint`
Expected: no errors; only the existing image warnings are acceptable.

**Step 3: Verify in the local browser**

Play through a cross-city Hainan segment and confirm:

- the map remains framed around Hainan rather than a multi-province region;
- the marker sits on the visible route tip throughout movement;
- the marker stays in view while the camera follows;
- pause, detail, continue, and reduced-motion paths remain usable.

**Step 4: Commit the implementation**

```powershell
git add app tests PRODUCT.md DESIGN.md docs/superpowers/plans/2026-08-11-hainan-island-camera-route-marker.md
git commit -m "fix: align Hainan route camera and traveler"
```

### Task 4: Publish the verified build

**Step 1: Push the verified commit to the existing Sites source repository**

Use the existing hosting project and a fresh repository credential.

**Step 2: Package and deploy a new site version**

Deploy the exact verified commit to project `appgprj_6a79a0cceb50819185151484197a5f7f`.

**Step 3: Confirm deployment status**

Wait until the deployment reports success and verify the public URL loads.
