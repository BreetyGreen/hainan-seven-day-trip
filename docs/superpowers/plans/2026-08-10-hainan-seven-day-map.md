# 海南东线 7 日地图实施计划

1. 先改数据与服务端渲染测试，断言海南路线、酒店、小红书图片来源和无预算，再运行看到旧普洱实现失败。
2. 重写 `app/trip-data.ts`：海南地点、7 天路线、酒店真实评价、单人/双人建议与来源元数据。
3. 更新 `scripts/fetch-routes.mjs`，通过 OSRM / OpenStreetMap 生成 `public/routes/hainan-east-coast.geojson`。
4. 把小红书筛选后的 5 张原图复制到 `public/hainan/`，页面展示作者、笔记标题和原始链接。
5. 重构 `app/page.tsx` 与 `app/RouteMap.tsx`，完成地图主导、点线联动、酒店详情和响应式底部面板。
6. 重写 `app/globals.css`、`app/layout.tsx`、`PRODUCT.md`、`DESIGN.md`，移除普洱与预算遗留。
7. 运行测试、lint、生产构建；启动本地页后在桌面和手机视口验证路线、节点、人数切换和图片加载。
