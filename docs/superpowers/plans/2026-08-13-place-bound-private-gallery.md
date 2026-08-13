# 地点专属私人图库 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让地点详情默认只展示与当前真实地点精确绑定的小红书图片，同时保留需要主动打开的城市总图库。

**Architecture:** 在抓取规则中显式维护 `placeIds`，由生成模块提供地点和城市两个纯过滤函数。`PrivateSocialGallery` 接收地点上下文，默认渲染地点集合；用户主动切换后才展示城市集合和主题筛选。

**Tech Stack:** Next.js 16、React 19、TypeScript、Node.js test runner、Sharp、CSS

## Global Constraints

- 不根据城市相同关系自动推断地点绑定。
- 无专属素材时不渲染私人图库，不把城市素材当作地点实景。
- 私人图片继续保存在 `public/private-hainan/` 并保持 Git 忽略。
- 不 push、不合并到 GitHub 公网分支。

---

### Task 1: 地点绑定数据模型

**Files:**
- Modify: `tests/private-social-gallery.test.mjs`
- Modify: `scripts/fetch-private-xhs-images.mjs`
- Regenerate: `app/private-social-gallery.ts`

**Interfaces:**
- Produces: `PrivateSocialImage.placeIds: string[]`
- Produces: `privateSocialImagesForPlace(placeId: string): PrivateSocialImage[]`

- [ ] **Step 1: Write the failing test**

增加断言：每条图片包含 `placeIds`；骑楼、神州半岛、石梅湾、兴隆市场、兴隆植物园、新村港、三正月和鹿回头都能返回专属图片；`eastline-seven-days` 不属于骑楼。

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/private-social-gallery.test.mjs`

Expected: FAIL，提示缺少 `placeIds` 或 `privateSocialImagesForPlace`。

- [ ] **Step 3: Write minimal implementation**

为 `localRules` 和 `remoteCollections` 增加显式 `placeIds`，写入生成结果：

```js
items.push({ ..., placeIds: rule.placeIds ?? [] });
```

生成过滤函数：

```ts
export function privateSocialImagesForPlace(placeId: string) {
  return privateSocialImages.filter((image) => image.placeIds.includes(placeId));
}
```

- [ ] **Step 4: Regenerate data and verify test passes**

Run: `node scripts/fetch-private-xhs-images.mjs && node --test tests/private-social-gallery.test.mjs`

Expected: 154 张图片、0 抓取失败、地点绑定测试 PASS。

- [ ] **Step 5: Commit**

```bash
git add scripts/fetch-private-xhs-images.mjs app/private-social-gallery.ts tests/private-social-gallery.test.mjs
git commit -m "feat: bind private images to itinerary places"
```

### Task 2: 地点优先图库交互

**Files:**
- Modify: `tests/private-social-gallery.test.mjs`
- Modify: `app/PrivateSocialGallery.tsx`
- Modify: `app/RouteMap.tsx`

**Interfaces:**
- Consumes: `privateSocialImagesForPlace(placeId)`
- Produces: `PrivateSocialGallery({ placeId, placeName, city })`

- [ ] **Step 1: Write the failing test**

断言组件接收 `placeId` 和 `placeName`、默认使用地点过滤函数、地点集合默认最多 8 张、城市总图库需要按钮主动打开，并且 `RouteMap` 传入三个字段。

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/private-social-gallery.test.mjs`

Expected: FAIL，提示仍使用城市级 props 或缺少地点视图。

- [ ] **Step 3: Write minimal implementation**

组件加入两种视图：

```ts
type GalleryScope = "place" | "city";
const placeImages = privateSocialImagesForPlace(placeId);
const sourceImages = scope === "place" ? placeImages : cityImages;
```

地点无图片时返回 `null`；城市筛选仅在 `scope === "city"` 时渲染；地点模式提供“查看该城市全部素材”，城市模式提供“返回地点专属图片”。

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/private-social-gallery.test.mjs`

Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add app/PrivateSocialGallery.tsx app/RouteMap.tsx tests/private-social-gallery.test.mjs
git commit -m "fix: show private media for the active place"
```

### Task 3: 视觉与完整回归

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `.private-gallery-scope-toggle` and `.private-gallery-return`
- Produces: desktop and 390px responsive styles

- [ ] **Step 1: Add CSS contract assertions before style changes**

断言地点/城市切换按钮样式类存在，并保留 390px 下三列缩略图和全屏预览规则。

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/private-social-gallery.test.mjs`

Expected: FAIL，提示缺少新切换按钮样式。

- [ ] **Step 3: Implement styles**

切换按钮使用浅色描边胶囊；地点标题突出地点名；城市总图库显示独立说明，避免视觉上与专属素材混淆。

- [ ] **Step 4: Run full verification**

Run: `npm test && npm run lint`

Expected: build 成功、全部测试 PASS、ESLint 0 errors。

- [ ] **Step 5: Browser verification**

在 390×844 尺寸验证骑楼只出现骑楼图片，主动进入城市总图库后才出现 19 张海口素材；确认无横向溢出，大图前后切换正常，浏览器控制台无 error/warn。

- [ ] **Step 6: Commit**

```bash
git add app/globals.css tests/private-social-gallery.test.mjs
git commit -m "style: distinguish place and city private galleries"
```
