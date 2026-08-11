# 海南旅程照片概览 · Design QA

Status: **PASS**

final result: passed

## Visual target and implementation

- Reference: `C:\Users\17358\AppData\Local\Temp\codex-clipboard-c155e685-d0d1-4952-a55d-8e4359bc2b16.png`
- Verified local capture: `docs/design-qa/hainan-photo-rail-desktop.png`
- Comparison viewport/state: 1280 × 720, full seven-day route, idle before playback.

## Comparison result

- The map remains the dominant canvas; the photo overview is a compact floating rail at the bottom.
- The rail starts after the left itinerary card, matching the reference hierarchy and avoiding obstruction of the hotel summary.
- Nine real itinerary photos appear in day order, with visible Day and source badges.
- The start gate has clear space above the rail and does not overlap it.
- Thumbnail crop, spacing, radius, shadow and active outline are visually consistent with the existing site rather than introducing a second design system.
- Clicking the Day 2 hotel photo opened the in-page 海南三正月酒店 dialog and moved the map to that place.
- Collapsing and reopening the rail worked; browser console inspection returned no errors.
- The rail hides while the detail dialog is open, preserving one clear visual focus.

## Intentional differences from the reference

- The reference shows a world-scale route. This itinerary keeps the established Wuhan-to-Hainan framing and then focuses the island, because the product's core content is the Haikou–Lingshui–Sanya route.
- Source badges remain mixed between 小红书 and 官网. Only place-identifiable, clean Xiaohongshu photography was promoted; weaker text-heavy or ambiguous images were not used simply to increase the platform count.

## Responsive contract

- Under 820 px the rail sits above the bottom itinerary card while idle.
- During playback or pause, the itinerary card leaves the canvas and the rail moves to the bottom edge; the route control moves above it.
- On small screens card width stays fixed for a horizontal 2–3 card glimpse, with touch scrolling and snap behavior.
- Reduced-motion users receive instant rail scrolling and existing motion reductions.
