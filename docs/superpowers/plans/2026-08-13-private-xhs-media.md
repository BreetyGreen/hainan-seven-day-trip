# Private Xiaohongshu Media Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-only private Xiaohongshu image library for the Hainan map site without changing its public deployment.

**Architecture:** A local environment flag selects a private gallery data module. Downloaded WebP files live in a Git-ignored public directory, while a local-only branch contains the loader, UI, tests, and reproducible fetch script.

**Tech Stack:** React 19, TypeScript, Next.js 16, Sharp, Node test runner.

## Global Constraints

- Never push this branch or private media to a remote.
- `public/private-hainan/` and `.env.local` must remain Git-ignored.
- Use only publicly accessible images without bypassing login or technical controls.
- Provide at least 60 images across four cities and four themes.
- Every local preview must be WebP and below 400 KB.

---

### Task 1: Lock down private-mode isolation

**Files:**
- Modify: `.gitignore`
- Create: `.env.local`
- Create: `tests/private-social-gallery.test.mjs`

**Interfaces:**
- Produces: `NEXT_PUBLIC_PRIVATE_MEDIA=1` locally and an ignored media directory.

- [ ] Write a failing test asserting the flag, ignore rule, source module, image count, four cities and four themes.
- [ ] Run `node --test tests/private-social-gallery.test.mjs` and confirm it fails because private mode is absent.
- [ ] Add the ignore rule and local environment flag.

### Task 2: Collect and compress the private image set

**Files:**
- Create: `scripts/fetch-private-xhs-images.mjs`
- Create: `app/private-social-gallery.ts`
- Create ignored files: `public/private-hainan/*.webp`

**Interfaces:**
- Produces: `privateSocialImages`, `privateSocialImagesForCity(city)`, and a source-linked manifest.

- [ ] Define source notes and download publicly accessible image URLs.
- [ ] Normalize orientation and write WebP previews with Sharp.
- [ ] Generate at least 60 metadata entries across the required cities and themes.
- [ ] Run the focused test and confirm data and asset checks pass.

### Task 3: Add the private gallery experience

**Files:**
- Create: `app/PrivateSocialGallery.tsx`
- Modify: `app/RouteMap.tsx`
- Modify: `app/globals.css`
- Test: `tests/private-social-gallery.test.mjs`

**Interfaces:**
- Consumes: `privateSocialImagesForCity(city)` when `NEXT_PUBLIC_PRIVATE_MEDIA` equals `1`.
- Produces: city/theme filters, 12-image progressive disclosure, large preview, and private-mode badge.

- [ ] Extend the failing test with UI and lazy-loading assertions.
- [ ] Mount the private gallery only while the local flag is enabled.
- [ ] Implement filters, expansion, preview and previous/next controls.
- [ ] Add desktop and mobile styles and verify the focused test passes.

### Task 4: Verify locally without publishing

**Files:**
- Modify: none expected.

**Interfaces:**
- Consumes: local development server.
- Produces: a verified private local experience and evidence that the remote main commit is unchanged.

- [ ] Run the complete test suite and ESLint.
- [ ] Start the local server and verify the gallery at 1280px and 390px widths.
- [ ] Confirm the private media directory is ignored and absent from `git status`.
- [ ] Confirm `git ls-remote github refs/heads/main` still resolves to `d167861`.
- [ ] Commit local branch code only and do not push.
