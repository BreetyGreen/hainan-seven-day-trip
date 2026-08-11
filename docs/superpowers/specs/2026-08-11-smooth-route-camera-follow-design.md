# Smooth Route Camera Follow Design

## Problem

The real Leaflet traveler marker now shares the animated route head coordinate, which fixes line/icon drift. However, the camera currently calls a non-animated `panTo` every 90 ms. Browser sampling on the Haikou-to-Wanning leg shows the tile layer changing only every five to six display frames while the marker moves between those changes and then snaps back toward center. This produces the reported shaking.

## Approved direction

Keep the actual Leaflet traveler marker and the shared route-head coordinate. Replace hard camera resets with short, linear, non-overlapping Leaflet pan animations.

- The route head remains the only geographic source for both the partial polyline and traveler marker.
- Camera follow uses an explicit cadence and a matching animation duration, so one pan finishes as the next begins instead of queueing or being interrupted.
- The marker may move slightly around the viewport center between follow updates, but it must remain inside a tight central band and never leave the map.
- Camera preparation, Hainan zoom 10, arrival zooms, details, pause/resume, and reduced-motion behavior remain unchanged.
- Reduced-motion continues to use immediate positioning because smooth camera animation is intentionally disabled for that preference.

## Implementation boundary

Expose the follow cadence and animation options from the camera policy module so they can be tested directly. `RouteMap` consumes that policy and removes the current 90 ms `animate: false` branch. No trip data, route geometry, imagery, layout, or hotel content changes are included.

## Verification

Automated checks must prove that normal-motion follow is animated, linear, and cadence-matched, while reduced-motion remains immediate. Browser sampling must show tile-layer positions changing across animation frames rather than only at hard reset boundaries, with the traveler remaining visible and within the map viewport.
