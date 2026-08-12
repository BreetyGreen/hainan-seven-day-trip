# Three-base Budget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将海南七日站点改为三家酒店与两次换宿，并增加随方案和人数联动的轻量预算模块，同时改善真实图片的展示质量。

**Architecture:** 在 `trip-data.ts` 中把住宿、路线与预算作为方案级数据，页面只消费当前方案和人数并计算总额。地图继续读取方案独立 GeoJSON；照片仍从地点数据生成，但由统一裁切元数据和 CSS 控制画面焦点。

**Tech Stack:** TypeScript、React、Leaflet、CSS、Node test runner、Vinext。

## Global Constraints

- 全程只能有三家酒店和两次换宿。
- 图片必须对应真实地点并保留来源。
- 预算为 2026 年 9 月估算，不包含免税购物。
- 地图保持页面主视觉。

---

### Task 1: 锁定三基地数据约束

**Files:**
- Modify: `tests/trip-data.test.mjs`
- Modify: `tests/trip-playback.test.mjs`
- Modify: `app/trip-data.ts`
- Modify: `public/routes/hainan-plan-a.geojson`
- Modify: `public/routes/hainan-plan-b.geojson`

- [ ] 写入两个方案只有三家酒店、两次换宿、Day 6 不换宿的失败测试。
- [ ] 运行相关测试并确认因当前四家酒店失败。
- [ ] 删除索菲特住宿节点，把 Day 6 改成陵水往返免税城，Day 7 从陵水去机场。
- [ ] 更新两套 GeoJSON 并运行数据、路线和播放测试。

### Task 2: 增加方案预算模型

**Files:**
- Modify: `tests/trip-data.test.mjs`
- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/trip-data.ts`
- Modify: `app/page.tsx`

- [ ] 写入预算类别、共享费用和一人/二人总额的失败测试。
- [ ] 运行测试并确认预算 API 缺失。
- [ ] 增加 `BudgetEstimate`、`calculatePlanBudget()` 和两个方案的估算区间。
- [ ] 添加语义化预算摘要，并与现有人数/方案状态连接。

### Task 3: 预算与图片视觉完善

**Files:**
- Modify: `app/globals.css`
- Modify: `app/page.tsx`
- Modify: `app/trip-data.ts`
- Modify: `public/hainan/*`

- [ ] 设计紧凑的总额、分项和估算说明，不采用重复卡片网格。
- [ ] 统一酒店与图片轨道的画幅、对象焦点和来源标签。
- [ ] 检查现有真实图的清晰度与构图，只在真实来源明确时替换。
- [ ] 验证 360px、桌面和减少动态效果状态。

### Task 4: 完整验证与发布

**Files:**
- Modify: `PRODUCT.md`
- Modify: `DESIGN.md`

- [ ] 更新产品文档中的三基地、两次换宿与预算规则。
- [ ] 运行 `npm test`、`npm run lint` 和 `git diff --check`。
- [ ] 在本地浏览器检查两套方案、人数预算切换、Day 6 与图片概览。
- [ ] 自我品鉴后修正明显问题，提交并推送 GitHub Pages。

