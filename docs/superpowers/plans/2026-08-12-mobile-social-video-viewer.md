# Mobile Social Video Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the cramped in-card mobile player with an independent full-screen mobile viewer and a centered desktop lightbox.

**Architecture:** Keep filtering and selection in `SocialVideoGallery`, and move playback into a focused `SocialVideoViewer` rendered through a React portal to `document.body`. The viewer owns focus, Escape handling, body scroll locking, platform fallback, and previous/next navigation; CSS owns mobile full-screen versus desktop lightbox presentation.

**Tech Stack:** React 19, TypeScript, React DOM portal, CSS media queries, Node test runner.

## Global Constraints

- Do not add a new runtime dependency.
- Douyin iframes mount only after a deliberate card click and unmount on close.
- Xiaohongshu uses a poster and source link without a fake iframe.
- Mobile controls have a minimum 44px touch target and respect safe-area insets.
- Preserve all existing map, place-detail, route, and travel-content behavior.

---

### Task 1: Add the independent viewer contract

**Files:**
- Create: `app/SocialVideoViewer.tsx`
- Modify: `app/SocialVideoGallery.tsx`
- Test: `tests/social-video.test.mjs`

**Interfaces:**
- Consumes: `SocialVideo`, the active filtered video list, `onClose`, and `onSelect`.
- Produces: `SocialVideoViewer({ video, videos, onClose, onSelect })` rendered in a body portal.

- [ ] **Step 1: Write the failing source-contract test**

Add assertions that require `createPortal`, `role="dialog"`, `aria-modal="true"`, body overflow locking, Escape handling, and labelled previous/next controls. Also assert that `SocialVideoGallery` delegates playback to `SocialVideoViewer`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/social-video.test.mjs`

Expected: FAIL because `app/SocialVideoViewer.tsx` does not exist.

- [ ] **Step 3: Implement the minimal viewer**

Create a client component that:

```tsx
export function SocialVideoViewer({ video, videos, onClose, onSelect }: Props) {
  // focus close, lock body scroll, close on Escape
  // render createPortal(<div className="social-video-viewer-backdrop">...</div>, document.body)
}
```

Move iframe/fallback markup out of `SocialVideoGallery`, pass `visibleVideos`, and keep the iframe conditional on `activeVideo.embedUrl`.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `node --test tests/social-video.test.mjs`

Expected: 3 tests pass and 0 fail.

### Task 2: Add responsive full-screen presentation and verify behavior

**Files:**
- Modify: `app/globals.css`
- Test: `tests/social-video.test.mjs`

**Interfaces:**
- Consumes: `.social-video-viewer-*` class names from Task 1.
- Produces: fixed full-screen mobile layout and centered desktop lightbox.

- [ ] **Step 1: Write the failing responsive-style test**

Assert the stylesheet contains a fixed, inset-zero viewer backdrop, a mobile `height: 100dvh`, safe-area padding, and control `min-height: 44px`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/social-video.test.mjs`

Expected: FAIL because the new viewer selectors are missing.

- [ ] **Step 3: Implement the responsive CSS**

Desktop uses a constrained lightbox. At the app's existing mobile breakpoint, `max-width: 820px`, set the viewer to viewport width and `100dvh`, remove radius, keep media in the remaining middle row, and place controls above `env(safe-area-inset-bottom)`.

- [ ] **Step 4: Run automated verification**

Run: `npm test && npm run lint && git diff --check`

Expected: build succeeds, all tests pass, lint exits 0, and diff check is empty.

- [ ] **Step 5: Run browser verification**

At 390 × 844, open a Wanning video and verify: backdrop is 390 × 844, body overflow is locked, player is no longer constrained to 296 × 167, previous/next controls are reachable, close restores the place detail, and Xiaohongshu still shows only a source-linked fallback.

- [ ] **Step 6: Commit**

```powershell
git add -- app/SocialVideoViewer.tsx app/SocialVideoGallery.tsx app/globals.css tests/social-video.test.mjs docs/superpowers/plans/2026-08-12-mobile-social-video-viewer.md
git commit -m "fix: make social videos usable on mobile"
```
