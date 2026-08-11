# Hainan Local Route Motion Design

## Problem

Intercity playback is acceptable, but short urban and hotel-area legs still feel unstable. The current implementation advances by coordinate index, pans the map on a fixed 120 ms cadence, assigns every same-city leg zoom 13, and derives several legs by cutting a whole-day route near each stop. These choices are most visible on short legs: uneven coordinate density changes apparent speed, repeated camera animations fight each other, and walking routes remain too wide.

## Approved direction

Adopt the proven local-motion pattern from the reference site at `http://localhost:5174/` while preserving the existing Hainan interface and intercity behavior.

- Route progress is sampled by cumulative geographic distance. The progressive line head and traveler marker consume the same sample.
- The camera follows only when the traveler leaves a central comfort zone. It does not pan on every cadence tick while the traveler remains comfortably visible.
- Camera policy is transport-aware: walking uses street-level zoom 16, same-city driving uses zoom 13, and the existing intercity and island zoom policies remain unchanged.
- Short local legs retain a readable minimum animation duration.
- Existing arrival dialogs, pause/resume, photo rail, route timeline, intercity camera behavior, and reduced-motion behavior remain intact.

## Components

### Route motion sampler

Add a pure module that calculates cumulative segment lengths and returns the exact point, visible partial route, and bearing at a normalized progress value. Tests cover uneven coordinate spacing and endpoint behavior.

### Camera comfort zone

Add a pure viewport helper that reports whether a projected point is outside a configurable central band. `RouteMap` throttles checks but starts a Leaflet `panTo` only after this condition is true.

### Mode-aware camera policy

Update `cameraForTravel` so walking takes precedence over the generic same-city rule. Preserve existing flight, island, suburban, and arrival policies.

### Playback integration

Replace coordinate-index interpolation in `renderTravel` with the route motion sampler. Use its `visibleCoordinates` for the line and its `point` for the traveler. Keep the current real Leaflet marker and canvas routes.

## Data boundary

This fix does not replace the Hainan itinerary or visual content. Existing detailed OSRM geometry remains in use. The very small Day 4 hotel walk is allowed to stay schematic, because distance-based interpolation and walking zoom make its three-point route legible without introducing fabricated roads.

Stops are mapped onto each ordered day route as one globally monotonic sequence rather than by repeatedly choosing the nearest remaining coordinate. This preserves distinct outward and return occurrences when the same hotel appears more than once, including the Day 1 hotel → Qilou → hotel loop.

## Verification

- Focused tests first fail for distance-based sampling, comfort-zone behavior, and walking zoom 16.
- Focused tests pass after the minimal implementation.
- The full test suite, lint, and production build pass.
- Browser playback confirms a short same-city leg stays at street scale, the traveler follows the revealed line, and the map does not pan while the traveler remains inside the comfort zone.
