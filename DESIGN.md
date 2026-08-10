# Design System

## Physical Scene

九月午后，旅行者在租来的车旁用手机确认下一段山路；阳光强、网络可能不稳定，需要一眼看清方向、时长和风险。

## Direction

“公路记录册”而非旅游杂志：大幅真实地图承担主视觉，行程像折叠路线单一样展开。使用清晰的线路色、短句和路标式数字，让页面既有云南的植物与土壤感，又不落入茶绿色配米色的常见模板。

## Color Strategy

Full palette。背景使用纯白与近黑，品牌锚点为晚夏蜂蜜橙，雨林使用深青蓝，茶山使用沉稳紫红；三种颜色只承担路线和状态语义。

```css
:root {
  --bg: oklch(1 0 0);
  --surface: oklch(0.965 0.006 70);
  --ink: oklch(0.17 0.018 60);
  --muted: oklch(0.45 0.018 60);
  --primary: oklch(0.72 0.18 65);
  --forest: oklch(0.38 0.09 195);
  --tea: oklch(0.36 0.10 15);
  --line: oklch(0.86 0.012 65);
}
```

## Typography

中文优先使用系统无衬线字体栈 `"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif`，保证在 Windows 与手机上稳定显示。标题使用 700–800 字重、较紧但不小于 `-0.03em` 的字距；正文限制在 72ch 内。数字使用 tabular figures，方便比较里程和预算。

## Layout

- 首屏是 42/58 的不对称分栏：左侧说明“武汉出发 · 普洱 7 日”，右侧为动态地图。
- 地图桌面端保持粘性，手机端变为可折叠的 48vh 区域。
- 7 天行程使用真正的时间轴，而不是同质化卡片网格。
- 单人/双人切换是全页主控件，同步预算、住宿、车辆和安全提示。
- “吃穿住行”用四条横向信息带呈现，减少嵌套卡片。

## Motion

选择某一天时，道路线从起点向终点绘制，标记依次点亮，文字面板同步切换。首次加载仅做一次短促的路线描边；`prefers-reduced-motion` 下立即显示最终状态。

## Components

- `ModeToggle`: 单人/双人模式切换，并通过 `aria-live` 宣告预算变化。
- `RouteMap`: OpenStreetMap 底图、真实坐标、预先核验的道路 GeoJSON、路线动画和图例。
- `DayTimeline`: 七天时间轴，驱动地图与当天详情。
- `BudgetLedger`: 交通、租车、住宿、餐食、门票、机动金的逐项对比。
- `TravelBands`: 吃、穿、住、行的高频决策信息。
- `RealityNotes`: 预约、雨季、山路、价格波动与来源日期。

## Responsive and States

360px 起可用；触摸目标不小于 44px。地图脚本或瓦片加载失败时显示静态路线摘要和地点列表。外部图片失败时保持布局并显示文字说明，不以空白色块代替。
