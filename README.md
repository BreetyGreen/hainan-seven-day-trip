# 普洱七日慢行

一份为 2026 年 9 月从武汉出发、普洱 7 天 6 晚自驾设计的交互式旅行网页。页面包含单人版和双人版预算、每日路线、吃穿住行、真实地点来源以及可重播的道路动画。

## 使用

需要 Node.js `>=22.13.0`。

```bash
npm install
npm run dev
```

浏览器打开终端显示的本地地址。正式验证使用：

```bash
npm test
```

## 路线与地点数据

- `app/trip-data.ts`：七天行程、真实地点、经纬度、来源链接和单双人预算。
- `public/routes/puer-loop.geojson`：Day 1–7 的本地路线数据。
- `scripts/fetch-routes.mjs`：使用 OSRM / OpenStreetMap 重新生成 Day 2–6 道路折线。
- Day 1 与 Day 7 是飞机、动车衔接示意线；没有伪装成公路。
- Day 2–6 的道路数据生成于 2026-08-10，共约 738 km；它用于行程规划，不替代出发当天导航和交通管制。

## 内容来源

主要核验来源包括：

- [UNESCO：普洱景迈山古茶林文化景观](https://whc.unesco.org/en/list/1665/)
- [云南省林业和草原局：太阳河省级自然保护区](https://lcj.yn.gov.cn/special/2025/0508/6583.html)
- [文化和旅游部：普洱咖啡庄园乡村旅游线路](https://zhuanti.mct.gov.cn/xcsshfghlxj/jpxl/detail/9148.html)
- [云南网：思茅老街与戴家巷](https://m.yunnan.cn/system/2026/05/04/033993822.shtml)
- [普洱日报：五一农贸市场](https://www.puerw.cn/perb/html/2022-01/06/content_6310.htm)

首屏照片为 Wikimedia Commons 的 [Old Tea Forest of the Jingmai Mountain](https://commons.wikimedia.org/wiki/File:Old_Tea_Forest_of_the_Jingmai_Mountain.jpg)，作者 919sth，采用 CC BY-SA 4.0 许可。

## 价格与开放状态

机票、动车、租车、住宿、门票和体验费用均使用规划区间，不代表锁价。出发前应再次确认：

1. 航空公司与 12306 的实际班次。
2. “景迈山预约服务”的入园和车辆要求。
3. 咖啡庄园、民宿的参观、晚餐与停车安排。
4. 普洱、澜沧和景迈山的天气、道路与景区公告。

## 技术结构

页面使用 React 19、TypeScript、Vinext/Vite 与 Leaflet 构建，底图来自 OpenStreetMap。地图瓦片加载失败时，本地路线数据与完整文字行程仍然可用。
