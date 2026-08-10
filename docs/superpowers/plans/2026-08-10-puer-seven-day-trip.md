# 普洱七日旅行网页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一份武汉出发、2026 年 9 月、普洱 7 天自驾的可交互旅行网页，支持单人/双人预算和真实动态路线。

**Architecture:** 使用 Sites 提供的 React/Vinext 单页结构。稳定地点、日程和预算拆入 `app/trip-data.ts`，地图组件只负责渲染与交互；道路数据保存为本地 GeoJSON，外部仅加载 OpenStreetMap 瓦片。

**Tech Stack:** React 19、TypeScript、Leaflet、OpenStreetMap、Node test runner、Vinext/Vite、CSS。

## Global Constraints

- 所有地点必须有真实坐标、来源 URL 和核验日期。
- 7 天 6 晚，武汉出发，普洱为核心，2026 年 9 月，每人预算约 8,000 元。
- 同时生成单人版和双人版；当地自驾。
- 包含茶山古村、雨林动物、咖啡美食，不做纯网红打卡内容。
- 地图失败时仍能通过文字完成行程。

---

### Task 1: 旅行数据契约与预算计算

**Files:**
- Create: `app/trip-data.ts`
- Create: `tests/trip-data.test.mjs`

**Interfaces:**
- Produces: `places`, `days`, `budgets`, `getBudget(mode)` 与 `getDayRoute(dayId)`。

- [ ] **Step 1: 写失败测试**，断言 `days.length === 7`、每个地点坐标在合法范围、来源以 `https://` 开头，并验证双人总预算等于各项相加。
- [ ] **Step 2: 运行 `node --test tests/trip-data.test.mjs`**，预期因 `app/trip-data.ts` 尚不存在而失败。
- [ ] **Step 3: 创建最小数据模块**，导出地点、每日 ID 顺序和以人民币元为单位的预算区间；不在该模块加入 UI 逻辑。
- [ ] **Step 4: 再次运行测试**，预期全部通过。
- [ ] **Step 5: 提交 `test: define verified Pu'er trip data`**。

### Task 2: 页面结构与模式切换

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Delete: `app/_sites-preview/preview.css`
- Delete: `app/_sites-preview/SkeletonPreview.tsx`
- Create: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `places`, `days`, `getBudget(mode)`。
- Produces: 可访问的 `ModeToggle`、七天时间轴、预算账本和吃穿住行内容。

- [ ] **Step 1: 扩展渲染测试**，要求输出包含“一个人走”和“两个人走”、Day 1–7、吃穿住行、预算与真实地点簿。
- [ ] **Step 2: 运行 `npm run build` 后执行测试**，预期因页面仍是启动骨架而失败。
- [ ] **Step 3: 实现页面结构与模式状态**，同步更新预算、车辆、住宿与安全文案；使用真实语义按钮和 `aria-live`。
- [ ] **Step 4: 实现响应式视觉系统**，使用 DESIGN.md 的 OKLCH 变量、时间轴和横向信息带，加入减少动态效果媒体查询。
- [ ] **Step 5: 更新标题、描述和图标，移除启动骨架及无用依赖**。
- [ ] **Step 6: 重新构建并运行测试**，预期通过。
- [ ] **Step 7: 提交 `feat: build Pu'er trip planner experience`**。

### Task 3: 真实路线地图与联动动画

**Files:**
- Create: `app/RouteMap.tsx`
- Create: `public/routes/puer-loop.geojson`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/trip-data.test.mjs`

**Interfaces:**
- Consumes: `places`, `days`, 当前 `selectedDay`。
- Produces: `RouteMap({ selectedDay, onSelectDay })`。

- [ ] **Step 1: 增加失败测试**，验证 GeoJSON 至少包含 7 个日程 feature、每个 feature 有 `dayId`，坐标数组非空。
- [ ] **Step 2: 运行测试**，预期因 GeoJSON 不存在而失败。
- [ ] **Step 3: 通过 OSRM 路由结果生成本地 GeoJSON**，航空和铁路段使用独立线型，普洱自驾段保存真实道路折线。
- [ ] **Step 4: 实现 Leaflet 地图**，加入真实标记、图例、日期选择、路线强调和描画动画；瓦片错误时显示等价文字摘要。
- [ ] **Step 5: 运行测试与构建**，预期全部通过。
- [ ] **Step 6: 提交 `feat: add verified animated route map`**。

### Task 4: 内容核验、可访问性与交付

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `README.md`

**Interfaces:**
- Consumes: 完整页面与数据。
- Produces: 可部署版本与复核清单。

- [ ] **Step 1: 逐条比对设计规格**，确认吃、穿、住、行、单人、双人、7 天、真实地点和地图降级均有对应实现。
- [ ] **Step 2: 运行 `npm test`**，预期零失败。
- [ ] **Step 3: 运行 `npm run build`**，预期退出码 0。
- [ ] **Step 4: 在浏览器检查 360px、768px、1440px**，验证无溢出、地图控件可触摸、键盘焦点可见。
- [ ] **Step 5: 更新 README**，记录地图数据来源、价格口径和出发前复核事项。
- [ ] **Step 6: 提交 `docs: add trip verification and handoff notes`**。

## Plan Self-review

规格中的路线、两种人数模式、预算、吃穿住行、真实地点、地图动画、失败降级、响应式与可访问性均有任务覆盖。文件接口命名一致，无占位符或未定义模块。
