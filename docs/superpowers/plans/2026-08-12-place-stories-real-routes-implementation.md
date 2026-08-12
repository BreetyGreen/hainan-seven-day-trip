# 地点多图故事与真实道路 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让海南旅行页面的地点弹框具备真实多图故事，让所有自驾动画沿真实道路运行，并增强安静慢游活动的记忆点。

**Architecture:** `trip-data.ts` 继续承载地点、图片和活动数据；`PlacePhotoGallery` 只负责弹框图片切换；预生成脚本负责把 OSRM 路由持久化到静态 GeoJSON，运行时不请求导航服务。路线状态与 Leaflet 初始化状态解耦。

**Tech Stack:** React 19、TypeScript、Leaflet、GeoJSON、OSRM、Node test、Vinext。

## Global Constraints

- 只有三家酒店和 Day 2 / Day 4 两次换宿。
- 所有可见图片对应真实地点并保留来源。
- 公网首屏不依赖实时导航 API。
- 不用生成图替代真实旅行照片。
- 不把免税购物包装成旅行高潮。

---

### Task 1: 锁定图片与路线行为

**Files:**
- Modify: `tests/trip-data.test.mjs`
- Modify: `tests/rendered-html.test.mjs`
- Modify: `tests/trip-playback.test.mjs`

**Interfaces:**
- Consumes: `places`, 两份 Hainan route GeoJSON。
- Produces: 多图、OSRM 路线密度和 loading 竞态的回归约束。

- [ ] 写入重点地点至少三张不同图片、来源 URL 完整的失败测试。
- [ ] 写入所有 drive feature 使用 OSRM 来源且至少 20 个坐标的失败测试。
- [ ] 写入弹框图片轮播控件与图片计数的失败渲染测试。
- [ ] 写入 Leaflet 初始化不再调用 `setStatus("loading")` 的失败回归测试。
- [ ] 运行目标测试并确认因缺少新能力而失败。

### Task 2: 生成真实道路 GeoJSON

**Files:**
- Create: `scripts/fetch-hainan-routes.mjs`
- Modify: `public/routes/hainan-plan-a.geojson`
- Modify: `public/routes/hainan-plan-b.geojson`

**Interfaces:**
- Consumes: 每个计划的端点和途经点。
- Produces: 带 `source`, `distanceKm`, `durationMinutes` 的高密度 LineString feature。

- [ ] 实现单段 OSRM 请求和返回值校验。
- [ ] 依次生成两个计划的自驾段，保持既有 `legId`, `dayId`, `mode`, `label`。
- [ ] 保留航班与短步行 feature，确保相邻 feature 端点连通。
- [ ] 运行路线测试并确认通过。

### Task 3: 实现地点图片轮播

**Files:**
- Create: `app/PlacePhotoGallery.tsx`
- Modify: `app/RouteMap.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `primary: PhotoSource`, `gallery?: PhotoSource[]`。
- Produces: 图片切换、缩略图、计数、来源链接和键盘控制。

- [ ] 为组件编写失败的服务端渲染测试。
- [ ] 实现单图与多图两种状态。
- [ ] 把 `PlaceDetailDialog` 的静态 hero 替换为组件。
- [ ] 增加桌面和手机样式，确保缩略图不遮住正文。
- [ ] 运行渲染与 lint 测试。

### Task 4: 补齐真实图片故事

**Files:**
- Modify: `app/trip-data.ts`
- Add: `public/hainan/shimei-bay-*.webp`
- Add: `public/hainan/xincun-port-*.webp`
- Add: `public/hainan/xinglong-*.webp`

**Interfaces:**
- Consumes: 官网、媒体、携程和小红书的真实地点图片。
- Produces: 石梅湾、新村港、兴隆植物园等重点地点 3–5 张图片故事。

- [ ] 下载并压缩地点全貌、活动和细节图片，最长边不超过 1600px。
- [ ] 为每张图片登记平台、作者／机构、标题和来源 URL。
- [ ] 删除重复文件和不适合做首图的石梅湾招牌图引用。
- [ ] 运行图片存在性、唯一性和来源测试。

### Task 5: 增强活动记忆点并修复加载竞态

**Files:**
- Modify: `app/trip-data.ts`
- Modify: `app/trip-details.ts`
- Modify: `app/RouteMap.tsx`
- Modify: `PRODUCT.md`
- Modify: `DESIGN.md`

**Interfaces:**
- Consumes: 已核验的石梅湾、新村港和兴隆活动资料。
- Produces: 更具体的步骤、节奏、天气替代和稳定的路线 ready 状态。

- [ ] 更新石梅湾、新村港、清水湾和兴隆植物园的活动步骤。
- [ ] 把免税城标记为可选采购窗口而非核心高潮。
- [ ] 删除 Leaflet 初始化对路线 loading 状态的反向覆盖。
- [ ] 运行全部测试和 lint。

### Task 6: 视觉验证与发布

**Files:**
- Modify only if browser verification finds a concrete defect.

**Interfaces:**
- Consumes: 本地生产页面。
- Produces: 经桌面、手机、Plan A/B 和动画验证的公网版本。

- [ ] 执行 `npm test`, `npm run lint`, `git diff --check`。
- [ ] 浏览器验证总览、石梅湾图库、新村港图库、Plan B 兴隆和 Day 4 道路线。
- [ ] 检查动画图标沿同一 GeoJSON 路径运动。
- [ ] 提交并推送 `github/main`。
- [ ] 等待 GitHub Pages 成功并验证公网 HTML、GeoJSON 与新图片返回 200。
