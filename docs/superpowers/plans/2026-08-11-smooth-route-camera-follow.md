# Smooth Route Camera Follow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the visible 90 ms hard camera jumps with short continuous Leaflet pans while preserving exact route/marker coordinate alignment.

**Architecture:** Define a testable camera-follow policy in `trip-camera.ts` and consume it from `RouteMap`. Normal motion uses cadence-matched linear pan animations; reduced motion keeps immediate positioning.

**Tech Stack:** TypeScript, React, Leaflet, Node test runner, browser frame sampling.

## Global Constraints

- The route head remains the only geographic source for the partial polyline and traveler marker.
- Preserve Hainan cross-city zoom 10 and all existing arrival zoom behavior.
- Do not change trip data, route geometry, imagery, layout, or hotel content.
- Do not reintroduce a fixed screen-center traveler overlay.

---

### Task 1: Add and consume the smooth follow policy

**Files:**
- Modify: `tests/trip-camera.test.mjs`
- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/trip-camera.ts`
- Modify: `app/RouteMap.tsx`
- Modify: `DESIGN.md`

**Interfaces:**
- Produces: `travelCameraFollow` with `intervalMs`, `duration`, and `easeLinearity`.
- Consumes: Leaflet `map.panTo(position, options)` and the existing route-head `position`.

- [ ] **Step 1: Write the failing policy test**

Add to `tests/trip-camera.test.mjs`:

```js
import {
  cameraForArrival,
  cameraForTravel,
  travelCameraFollow,
  travelStageProgress,
} from "../app/trip-camera.ts";

test("uses a continuous non-overlapping camera follow animation", () => {
  assert.equal(travelCameraFollow.intervalMs, 120);
  assert.equal(travelCameraFollow.duration, 0.12);
  assert.equal(travelCameraFollow.easeLinearity, 1);
  assert.equal(travelCameraFollow.duration * 1000, travelCameraFollow.intervalMs);
});
```

Replace the rendered-source expectation for `map.panTo(position, { animate: false` with expectations for `travelCameraFollow.intervalMs`, `animate: true`, and `travelCameraFollow.duration`.

- [ ] **Step 2: Run focused tests and confirm RED**

Run: `node --test tests/trip-camera.test.mjs tests/rendered-html.test.mjs`

Expected: FAIL because `travelCameraFollow` does not exist and `RouteMap` still uses a 90 ms immediate pan.

- [ ] **Step 3: Implement the minimal policy**

Add to `app/trip-camera.ts`:

```ts
export const travelCameraFollow = {
  intervalMs: 120,
  duration: 0.12,
  easeLinearity: 1,
} as const;
```

Import it into `RouteMap`. Keep the reduced-motion `setView` branch. Replace the normal-motion follow block with:

```ts
} else if (timestamp - lastCameraUpdate >= travelCameraFollow.intervalMs) {
  lastCameraUpdate = timestamp;
  map.panTo(position, {
    animate: true,
    duration: travelCameraFollow.duration,
    easeLinearity: travelCameraFollow.easeLinearity,
    noMoveStart: true,
  });
}
```

- [ ] **Step 4: Document the changed motion contract**

Update `DESIGN.md` to state that normal camera follow uses cadence-matched 120 ms linear pans instead of immediate map resets.

- [ ] **Step 5: Run focused tests and confirm GREEN**

Run: `node --test tests/trip-camera.test.mjs tests/rendered-html.test.mjs`

Expected: all focused tests pass.

### Task 2: Verify motion quality and publish

**Files:**
- No additional production files.

**Interfaces:**
- Consumes: the local site at `http://localhost:5173/` and the existing Sites project.
- Produces: a verified public deployment.

- [ ] **Step 1: Run the complete automated gate**

Run: `npm test`

Expected: 26 or more tests pass with zero failures.

Run: `npm run lint`

Expected: zero errors; the three existing `app/page.tsx` image warnings are acceptable.

- [ ] **Step 2: Repeat the browser frame sample**

On the Haikou-to-Wanning travel stage, sample the first visible tile and traveler bounding boxes every 16 ms for at least 90 samples.

Expected:

- tile positions change across the frames within each follow animation rather than once every five to six frames;
- the traveler stays inside the map viewport and within a tight band around the viewport center;
- the traveler remains on the animated route head;
- arrival details still pause playback and hide the traveler.

- [ ] **Step 3: Commit the verified implementation**

```powershell
git add app/trip-camera.ts app/RouteMap.tsx tests/trip-camera.test.mjs tests/rendered-html.test.mjs DESIGN.md docs/superpowers/plans/2026-08-11-smooth-route-camera-follow.md
git commit -m "fix: smooth route camera follow"
```

- [ ] **Step 4: Deploy the exact commit**

Push, package, save, and deploy the verified commit to the existing Sites project `appgprj_6a79a0cceb50819185151484197a5f7f`, then wait for a succeeded deployment and verify the public URL loads.
