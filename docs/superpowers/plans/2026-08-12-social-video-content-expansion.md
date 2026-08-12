# Social Video Content Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the Hainan trip site to 30 sourced social entries with theme filters, mobile-friendly progressive disclosure, and lightweight local posters.

**Architecture:** Keep `social-videos.ts` as the single video metadata source, add a typed five-theme taxonomy, and derive Douyin inspiration images from that data to prevent drift. The gallery filters in memory, mounts the official player only after a click, and initially renders six cards per city.

**Tech Stack:** React 19, TypeScript, Next.js 16, Node test runner, Sharp, official Douyin iframe player.

## Global Constraints

- At least 26 verified Douyin videos plus 4 user-provided Xiaohongshu notes.
- Themes are exactly 路线、海岸、酒店、吃喝、实用.
- Video files are never downloaded or re-hosted.
- Posters are local WebP files below 260 KB each.
- No iframe is mounted until the user opens a card.

---

### Task 1: Encode the expansion contract

**Files:**
- Modify: `tests/social-video.test.mjs`
- Modify: `tests/social-gallery.test.mjs`

**Interfaces:**
- Consumes: source files as UTF-8 text.
- Produces: regression checks for counts, themes, disclosure controls, unique IDs, and local poster assets.

- [ ] **Step 1: Raise the content threshold and add theme/disclosure assertions.**
- [ ] **Step 2: Run `node --test tests/social-video.test.mjs tests/social-gallery.test.mjs`.**
- [ ] **Step 3: Confirm failure reports the old 10-video baseline or missing theme UI.**

### Task 2: Add verified content and local posters

**Files:**
- Modify: `app/social-videos.ts`
- Create: `public/hainan/social-douyin-*.webp`
- Modify: `scripts/fetch-social-images.mjs`

**Interfaces:**
- Produces: `SocialVideoTheme`, 30 unique `SocialVideo` entries, local poster paths, and official player URLs.

- [ ] **Step 1: Download and compress the 16 newly verified Douyin cover images.**
- [ ] **Step 2: Add `theme` to the type and every existing entry.**
- [ ] **Step 3: Add 16 new videos across all four cities and the full route.**
- [ ] **Step 4: Run the focused tests and confirm the data checks pass.**

### Task 3: Add theme filters and progressive disclosure

**Files:**
- Modify: `app/SocialVideoGallery.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `SocialVideoTheme` and `socialVideosForCity(city)`.
- Produces: platform plus theme filtering, six-card collapsed view, and expand/collapse controls.

- [ ] **Step 1: Filter by platform and theme with memoized results.**
- [ ] **Step 2: Reset the expanded state when a filter changes.**
- [ ] **Step 3: Keep the viewer sequence bound to the complete filtered result.**
- [ ] **Step 4: Style horizontal theme chips and a 44px mobile-safe expand button.**
- [ ] **Step 5: Run focused tests and lint.**

### Task 4: Derive the expanded inspiration library

**Files:**
- Modify: `app/social-gallery.ts`
- Test: `tests/social-gallery.test.mjs`

**Interfaces:**
- Consumes: all Douyin entries from `socialVideos`.
- Produces: one image item per Douyin poster plus the existing 29 Xiaohongshu images.

- [ ] **Step 1: Preserve the four user-supplied Xiaohongshu collections.**
- [ ] **Step 2: Derive Douyin image items from video metadata instead of duplicating them manually.**
- [ ] **Step 3: Run the gallery test and confirm at least 55 source-linked images.**

### Task 5: Verify and publish

**Files:**
- Modify: none expected.

**Interfaces:**
- Consumes: the complete production build.
- Produces: verified local site and updated GitHub Pages deployment.

- [ ] **Step 1: Run focused tests, ESLint, the complete test suite, and the GitHub Pages build.**
- [ ] **Step 2: Inspect desktop and phone-size layouts in the browser.**
- [ ] **Step 3: Confirm cards do not preload iframes and the viewer can move through the filtered result.**
- [ ] **Step 4: Commit only intended source, tests, docs, and poster assets.**
- [ ] **Step 5: Push the branch and verify the public GitHub Pages URL.**
