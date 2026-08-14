import type { ResearchCategory } from "./research-evidence";

export type PlanId = "A" | "B";

export type TripRecommendation = {
  id: string;
  planId: PlanId;
  dayId: number;
  category: ResearchCategory;
  entityId: string;
  title: string;
  summary: string;
  actions: string[];
  fallback?: string;
  price?: string;
  evidenceIds: string[];
  verifiedAt: "2026-08-14";
};

type RecommendationSeed = Omit<TripRecommendation, "id" | "planId" | "dayId" | "category" | "verifiedAt">;

type DailySeed = {
  planId: PlanId;
  dayId: number;
  吃: RecommendationSeed;
  穿: RecommendationSeed;
  住: RecommendationSeed;
  行: RecommendationSeed;
  玩: RecommendationSeed;
};

const item = (
  entityId: string,
  title: string,
  summary: string,
  actions: string[],
  evidenceIds: string[],
  extra: Pick<RecommendationSeed, "fallback" | "price"> = {},
): RecommendationSeed => ({ entityId, title, summary, actions, evidenceIds, ...extra });

const wear = (city: "海口" | "万宁" | "陵水" | "三亚", dayId: number): RecommendationSeed => item(
  `day-${dayId}-clothing`,
  `${city}九月体感装备`,
  "九月仍是高温、高湿和强紫外线季；午后阵雨与台风外围天气需要随时切换室内方案。",
  ["速干短袖、防晒外套、遮阳帽和防滑凉鞋随身", "车内放薄雨衣、干毛巾和一套可替换衣物"],
  [`weather-${city === "海口" ? "haikou" : city === "万宁" ? "wanning" : city === "陵水" ? "lingshui" : "sanya"}`, "weather-hainan-home", "weather-autumn-typhoon"],
  { fallback: "出发前 48 小时按气象预警删减海上与暴晒项目。" },
);

const dailySeeds: DailySeed[] = [
  {
    planId: "A", dayId: 1,
    吃: item("haikou-jiangdong-food", "落地后的江东新区晚餐", "首晚不穿城追店，以酒店餐厅或附近简餐收尾。", ["航班正常就在酒店解决第一餐", "晚点超过 21:00 提前联系酒店确认供餐"], ["map-food-haikou-hengxingfa", "map-food-haikou-xitianmiao"], { price: "两人约 ¥100–240" }),
    穿: wear("海口", 1),
    住: item("hongyuan-crest", "海口鸿园雅诗阁臻选 · 2024 新开", "用一晚江东新区的海景服务式公寓完成落地缓冲，避开市中心折返。", ["预订时确认海景开间或一居室及楼层", "到店先确认窗外视野再放行李"], ["xhs-search-hongyuan-crest", "hotel-hongyuan-crest", "hotel-hongyuan-crest-ctrip", "map-hotel-hongyuan-crest"], { price: "预算带 ¥700–1200/晚，非实时价格" }),
    行: item("route-wuhan-haikou", "武汉飞海口，再取车去江东新区", "武汉天河机场至海口美兰机场，落地取车后约 15–25 分钟到酒店。", ["航班落地后预留 60–90 分钟取行李与取车", "导航先设酒店停车场，不追加骑楼老街"], ["transport-wuhan-airport", "transport-haikou-airport", "transport-haikou-parking"], { fallback: "晚点时直接入住，取消海岸散步。" }),
    玩: item("jiangdong-coast", "只走一段江东海岸", "首日唯一活动是酒店附近短散步，让身体先适应海南湿热。", ["向前台确认当天开放通道", "只走酒店周边 30–45 分钟，不开车二次出门"], ["play-map-west-coast", "xhs-69c4017c0000000023021eb9"], { fallback: "下雨就在酒店泳池或大堂休息。" }),
  },
  {
    planId: "A", dayId: 2,
    吃: item("wanning-wuji", "后安粉汤 + 神州半岛晚餐", "跨城日不排队打卡：中午用后安粉汤快速解决，晚餐回酒店或附近海南菜。", ["避开 12:00–13:00 的集中客流", "海鲜先问时价、称重后再加工"], ["map-food-wanning-wuji", "xhs-6a7070660000000025002e78"], { price: "两人约 ¥120–260" }),
    穿: wear("万宁", 2),
    住: item("yuyue-artia", "逐浪屿玥 · 日月湾连住两晚", "把万宁真正作为基地，在日月湾的新酒店住足两晚再去石梅湾和兴隆。", ["确认海景房型并备注安静朝向", "连住订单备注远离电梯和高铁侧"], ["xhs-search-yuyue-artia", "hotel-yuyue-artia", "hotel-yuyue-artia-ctrip", "map-hotel-yuyue-artia"], { price: "预算带 ¥900–1600/晚，非实时价格" }),
    行: item("route-haikou-wanning", "海口江东 → 日月湾", "自驾约 2.2–2.6 小时，包含一次服务区休息；午后只办理入住。", ["10:00 前离店", "中途服务区休息 15–20 分钟，不临时加景点"], ["transport-haikou-wanning", "xhs-69c4017c0000000023021eb9"], { fallback: "暴雨时降低车速并把海岸活动全部删除。" }),
    玩: item("riyue-bay-coast", "日月湾傍晚短散步", "抵达后只在酒店附近海岸走一小段，不把换酒店日变成景点日。", ["日落前后选择 30–60 分钟散步", "海况红旗时只看海，不下水"], ["play-map-shenzhou", "xhs-69abee14000000000e03ce43"], { fallback: "雷暴时留在酒店。" }),
  },
  {
    planId: "A", dayId: 3,
    吃: item("xinglong-market", "兴隆老味午餐", "把餐饮放在兴隆完成：咖啡、后安粉、菠萝包与清补凉择二，不做六店连吃。", ["先吃正餐再尝甜品，控制每样份量", "市场摊位观察明码标价和食材周转"], ["xhs-68a31c74000000001d034617", "map-food-wanning-xinglong-market-food", "xhs-6a7070660000000025002e78"], { price: "两人约 ¥100–220" }),
    穿: wear("万宁", 3),
    住: item("yuyue-artia", "逐浪屿玥第二晚 · 不换酒店", "石梅湾与兴隆当天往返日月湾，晚间回同一间房彻底休息。", ["上午出发前让房务补水", "傍晚回店后不再安排夜市"], ["xhs-search-yuyue-artia", "hotel-yuyue-artia", "map-hotel-yuyue-artia"], { price: "已计入连住预算" }),
    行: item("route-shimei-xinglong", "日月湾 → 石梅湾 → 兴隆 → 日月湾", "当天是万宁内部小环线，分段约 20–35 分钟，避免地图缩得像跨城。", ["上午先去石梅湾，午间转兴隆", "15:30 前返程，给酒店泳池和日落留时间"], ["transport-shimei-xinglong", "xhs-6a2b733d000000000802544e"], { fallback: "阵雨时直接从兴隆返回酒店。" }),
    玩: item("shimei-bay", "石梅湾青皮林与海岸", "只选青皮林海岸和一处安静停留点，拒绝把沿海公路做成连续拍照任务。", ["上午光线柔和时抵达", "在正规停车点停放，不占路拍摄"], ["play-shimei-bay", "xhs-69abee14000000000e03ce43", "xhs-6a2b733d000000000802544e"], { fallback: "海况差改为兴隆热带植物园。" }),
  },
  {
    planId: "A", dayId: 4,
    吃: item("xincun-port-food", "新村港午餐，清水湾晚餐", "港口午餐以新鲜、清淡为先；入住后在金普顿完成晚餐。", ["渔排海鲜先确认单价、加工费和总重", "晕船或肠胃敏感就改吃陵水酸粉"], ["map-food-lingshui-xincun-seafood", "map-food-lingshui-yingjie", "xhs-6a79ad60000000002202c3da"], { price: "两人约 ¥220–480" }),
    穿: wear("陵水", 4),
    住: item("kimpton-clearwater", "清水湾金普顿 · 连住三晚", "后三晚固定清水湾，设计公区、海景和短距离海岸构成真正的慢住段。", ["优先确认正海景房，不用套房堆预算", "到店确认停车、早餐及泳池时段"], ["xhs-search-kimpton-clearwater", "hotel-kimpton-clearwater", "hotel-kimpton-clearwater-ctrip", "map-hotel-kimpton-clearwater"], { price: "预算带 ¥1700–2600/晚，非实时价格" }),
    行: item("route-wanning-lingshui", "万宁 → 新村港 → 清水湾", "单向南下，万宁到新村港后再到清水湾；不走回头路。", ["退房后先去新村港，活动结束再办理入住", "港口结束前查看降雨和海况，必要时直接去酒店"], ["transport-wanning-lingshui", "transport-xincun-clearwater", "xhs-69c4017c0000000023021eb9"], { fallback: "停航或暴雨时跳过港口，直接入住。" }),
    玩: item("xincun-port", "新村港疍家生活观察", "以正规码头和港口公共区域为主，观察渔排与船流，不把居民生活当表演。", ["现场确认正规运营和救生衣", "控制在 60–90 分钟，不追逐私人渔排"], ["play-xincun-port", "xhs-6a71b3a50000000021020fc8", "xhs-6a79ad60000000002202c3da"], { fallback: "停航就去酒店提前入住。" }),
  },
  {
    planId: "A", dayId: 5,
    吃: item("clearwater-indigo-dining", "酒店早餐 + 清水湾轻食", "完整酒店日不为一顿饭往返镇区，中午轻食，晚餐再选酒店或附近海南菜。", ["早餐晚一点吃，午餐减量", "晚餐如点海鲜先确认份量"], ["map-food-lingshui-indigo-dining", "map-food-lingshui-clearwater-light"], { price: "两人约 ¥180–420" }),
    穿: wear("陵水", 5),
    住: item("kimpton-clearwater", "金普顿第二晚 · 完整酒店日", "这一天的价值来自不挪窝：晨光海岸、午休、设计公区和蓝调时刻。", ["上午先使用海岸，正午回房休息", "泳池时段与酒店活动表到店确认"], ["xhs-search-kimpton-clearwater", "hotel-kimpton-clearwater", "map-hotel-kimpton-clearwater"], { price: "已计入连住预算" }),
    行: item("clearwater-local", "全天短距离步行", "不开长途车，只在酒店与清水湾海岸之间移动。", ["车留在酒店停车场", "海边往返带水和房卡，不带大量物品"], ["map-hotel-kimpton-clearwater", "play-map-clearwater"], { fallback: "高温时把步行缩短为清晨与傍晚两段。" }),
    玩: item("clearwater-coast", "清水湾完整留白日", "不插入蜈支洲、后海或三亚市区，用空白时间换真正的度假感。", ["清晨看海，10:30 前回房", "傍晚再去泳池或海岸，不追日程表"], ["play-map-clearwater", "xhs-6a79ad60000000002202c3da"], { fallback: "红旗或雷暴时只使用室内设施。" }),
  },
  {
    planId: "A", dayId: 6,
    吃: item("clearwater-day6-food", "清水湾慢早餐；购物才去海棠湾吃饭", "不购物就延续酒店餐饮；确有清单才去免税城并顺路吃一顿。", ["出发前先列购物清单和预算", "不购物时不为餐厅单独跨区"], ["map-food-lingshui-indigo-dining", "map-food-sanya-buzai", "xhs-2HxyZx28FWw"], { price: "两人约 ¥180–450" }),
    穿: wear("陵水", 6),
    住: item("kimpton-clearwater", "金普顿第三晚 · 不搬行李", "自由日仍回清水湾，同一基地完成最后一晚。", ["提前整理次日机场用物", "晚间确认航班、油量和还车点"], ["xhs-search-kimpton-clearwater", "hotel-kimpton-clearwater", "map-hotel-kimpton-clearwater"], { price: "已计入连住预算" }),
    行: item("route-clearwater-cdf", "清水湾 ⇄ 海棠湾免税城（可跳过）", "单程约 25–35 分钟，仅在有明确采购任务时往返。", ["按提货截止时间倒推离店", "购物结束立即返酒店，不再叠加后海或蜈支洲"], ["transport-clearwater-cdf", "transport-wanning-lingshui"], { fallback: "暴雨或无清单就留在酒店。" }),
    玩: item("cdf-sanya", "二选一：免税采购或酒店留白", "免税城不是必去景点；这一天的默认答案仍是休息。", ["有清单才选免税城", "不购物就安排泳池、阅读和海岸散步"], ["play-cdf", "play-map-clearwater"], { fallback: "天气差时优先酒店室内活动。" }),
  },
  {
    planId: "A", dayId: 7,
    吃: item("sanya-airport-food", "酒店早餐 + 机场前简餐", "返程日不绕路追店，早餐在酒店，机场附近只补一顿易消化简餐。", ["退房前吃足早餐并带水", "进机场后再决定是否加餐"], ["map-food-sanya-xiaogao", "xhs-6QybMpO8y3I"], { price: "两人约 ¥80–180" }),
    穿: wear("三亚", 7),
    住: item("departure-day-a", "不新增第四家酒店", "第七天直接由清水湾金普顿退房去三亚凤凰机场，保持全程三基地、只换两次酒店。", ["前一晚整理行李和易碎品", "退房时核对押金、充电器和证件"], ["hotel-kimpton-clearwater", "transport-sanya-airport"]),
    行: item("route-lingshui-sanya", "清水湾 → 三亚凤凰机场 → 武汉", "跨区、加油、还车、摆渡与值机合计需留足余量，建议起飞前 4.5–5 小时离店。", ["先导航租车还车点而非航站楼", "加油后拍摄车况与油表留存"], ["transport-lingshui-sanya", "transport-sanya-return-car", "transport-sanya-airport"], { fallback: "台风或积水预警时再提前 60 分钟。" }),
    玩: item("return-home-a", "返程日不补景点", "不在凤凰机场前塞三亚湾、南山或市区餐厅，给返程确定性让路。", ["把候机时间当作缓冲", "在地图旅程里回看七天照片即可"], ["xhs-69c4017c0000000023021eb9", "play-map-sanya-bay"], { fallback: "航班延误按航司通知处理。" }),
  },
  {
    planId: "B", dayId: 1,
    吃: item("haikou-west-coast-food", "西海岸轻预算晚餐", "同样不进市中心，酒店简餐或附近海南粉即可。", ["落地晚就直接酒店用餐", "想吃老爸茶留到下次海口专程，不为一餐折返"], ["map-food-haikou-qilou-breakfast", "map-food-haikou-dadiao"], { price: "两人约 ¥70–160" }),
    穿: wear("海口", 1),
    住: item("haikou-marriott", "海口万豪 · 成熟海景首晚", "Plan B 用成熟服务保留西海岸和海景诉求，避开新酒店磨合期。", ["预订页筛选明确写有海景的房型", "问清早餐、停车和取消规则"], ["xhs-search-haikou-marriott", "hotel-haikou-marriott-overview", "map-hotel-haikou-marriott"], { price: "预算带 ¥700–1200/晚，非实时价格" }),
    行: item("route-wuhan-haikou-b", "武汉飞海口，直接去西海岸", "取车后直达滨海西路，不进入骑楼片区。", ["预留取车与验车时间", "拍摄车辆四周、轮胎和油量"], ["transport-wuhan-airport", "transport-haikou-airport", "transport-haikou-parking"], { fallback: "晚点就删除全部户外活动。" }),
    玩: item("haikou-west-coast", "假日海滩方向短散步", "活动控制在酒店周边，不因为地图上距离看似不远就穿城。", ["日落前 30 分钟再出门", "雨天改酒店泳池或早休息"], ["play-map-west-coast", "xhs-69c4017c0000000023021eb9"]),
  },
  {
    planId: "B", dayId: 2,
    吃: item("wanning-xindazhong", "万宁茶坊午餐", "以茶坊小吃或后安粉作为跨城日主餐，入住后不再远行。", ["点两三样共享，避免一次吃太重", "老盐饮品要求少糖"], ["map-food-wanning-xindazhong", "xhs-6a7070660000000025002e78"], { price: "两人约 ¥100–220" }),
    穿: wear("万宁", 2),
    住: item("grand-hyatt-wanning", "万宁神州半岛君悦 · 连住两晚", "Plan B 用成熟度假服务住进相对安静的神州半岛。", ["预订时逐字确认海景房型名称", "备注安静楼层并核对停车与早餐"], ["xhs-6a33dac0000000002100add2", "hotel-grand-hyatt-wanning", "map-hotel-grand-hyatt-wanning"], { price: "预算带 ¥1000–1800/晚，非实时价格" }),
    行: item("route-haikou-wanning", "海口西海岸 → 万宁神州半岛", "约 2.5 小时含休息，抵达后不再去石梅湾。", ["10:00 前出发", "中途只安排一次服务区休息"], ["transport-haikou-wanning", "xhs-69c4017c0000000023021eb9"], { fallback: "持续大雨就延长休息并直达酒店。" }),
    玩: item("shenzhou-peninsula", "神州半岛酒店周边", "入住后只熟悉酒店和海岸，保存体力给第二天兴隆。", ["选择 30–45 分钟海岸散步", "海风大时改室内公共区"], ["play-map-shenzhou", "xhs-6a2b733d000000000802544e"]),
  },
  {
    planId: "B", dayId: 3,
    吃: item("xinglong-market", "兴隆市场小吃择三", "后安粉、咖啡、菠萝包、清补凉中选三样共享，重点是当地生活感。", ["正餐与甜品错开 60 分钟", "不购买来源不清的散装保健品"], ["xhs-68a31c74000000001d034617", "map-food-wanning-xinglong-market-food", "map-food-wanning-gangjiao"], { price: "两人约 ¥100–230" }),
    穿: wear("万宁", 3),
    住: item("grand-hyatt-wanning", "神州半岛君悦第二晚", "植物园和市场结束后回同一基地，不换酒店。", ["把湿衣物及时晾干", "晚间只使用酒店设施"], ["xhs-6a33dac0000000002100add2", "hotel-grand-hyatt-wanning", "map-hotel-grand-hyatt-wanning"], { price: "已计入连住预算" }),
    行: item("route-shenzhou-xinglong", "神州半岛 ⇄ 兴隆", "单程约 35–50 分钟，上午植物园、午后市场，尽量在雷雨前返回。", ["09:00 左右出发", "15:30 前开始返程"], ["transport-shimei-xinglong", "xhs-6a2b733d000000000802544e"], { fallback: "雷暴时缩成植物园一项或全天酒店。" }),
    玩: item("xinglong-garden", "兴隆热带植物园 + 华侨市场", "Plan B 用林野、咖啡可可和市场替代海岸奔波。", ["上午跟随正规讲解认识热带作物", "下午市场只逛 60–90 分钟"], ["play-xinglong-garden", "xhs-6a786a36000000002202d176", "play-map-xinglong-market"], { fallback: "闭园或雷暴时保留市场短逛。" }),
  },
  {
    planId: "B", dayId: 4,
    吃: item("sangem-dining", "到店后的明月宫晚餐", "换酒店日直接在三正月酒店完成晚餐，不绕去新村港。", ["午餐在高速前后简单解决", "晚餐提前问清餐厅营业时段"], ["map-food-lingshui-sangem-dining", "xhs-68a893f3000000001c032dad"], { price: "两人约 ¥180–420" }),
    穿: wear("陵水", 4),
    住: item("sangem-moon", "海南三正月 · 土福湾连住三晚", "Plan B 第三基地换成土福湾，以较可控预算保留海景、沙滩和泳池。", ["优先比较主楼明确标注海景的房型", "确认房间朝向、楼层和亲子区噪声"], ["xhs-68a893f3000000001c032dad", "hotel-sangem-moon", "map-hotel-sangem-moon"], { price: "预算带 ¥650–1100/晚，非实时价格" }),
    行: item("route-wanning-tufu", "万宁 → 土福湾", "直接南下约 1–1.3 小时，不经新村港，午后尽早入住。", ["退房后导航三正月酒店停车场", "途中只做一次短休，不增加景点"], ["transport-wanning-lingshui", "xhs-69c4017c0000000023021eb9"], { fallback: "暴雨时进一步放慢并取消海岸。" }),
    玩: item("sangem-beach", "到店熟悉土福湾海岸", "换住日下午只认识酒店、沙滩通道和泳池位置。", ["日落前走一段 20–40 分钟", "记录红旗、救生员和泳池开放时间"], ["play-map-tufu", "xhs-68a893f3000000001c032dad"], { fallback: "天气差就留在室内公共区。" }),
  },
  {
    planId: "B", dayId: 5,
    吃: item("sangem-dining", "酒店早餐 + 土福湾海南菜", "完整酒店日不跨区追店，午间减量，晚餐按体力选酒店或附近海南菜。", ["早餐避开最拥挤时段", "外出吃饭只选 15–20 分钟车程内"], ["map-food-lingshui-sangem-dining", "map-food-lingshui-tufu-local"], { price: "两人约 ¥160–380" }),
    穿: wear("陵水", 5),
    住: item("sangem-moon", "三正月第二晚 · 酒店完整日", "晨光海岸、午休、空中泳池和蓝调时刻构成全天。", ["正午回房避晒", "傍晚提前查看泳池客流"], ["xhs-68a893f3000000001c032dad", "hotel-sangem-rooms", "map-hotel-sangem-moon"], { price: "已计入连住预算" }),
    行: item("tufu-local", "全天不开长途车", "车辆留在停车场，活动围绕酒店和约 350 米外海滩展开。", ["步行带水、防晒和拖鞋", "晚上不临时去三亚市区"], ["map-hotel-sangem-moon", "play-map-tufu"], { fallback: "高温时只在早晚出门。" }),
    玩: item("sangem-beach", "土福湾晨光与空中泳池", "比连续跑景点更适合安静度假，也保留足够画面感。", ["清晨先去海岸", "傍晚在泳池等蓝调，不反复往返"], ["play-map-tufu", "xhs-68a893f3000000001c032dad"], { fallback: "红旗时不下海。" }),
  },
  {
    planId: "B", dayId: 6,
    吃: item("tufu-day6-food", "酒店慢早餐；购物日再去海棠湾", "默认留在土福湾用餐，只有购物才向海棠湾移动。", ["出门前确认免税城餐饮排队情况", "无购物任务就不跨区"], ["map-food-lingshui-sangem-dining", "map-food-sanya-qiongxiangge", "xhs-2HxyZx28FWw"], { price: "两人约 ¥160–420" }),
    穿: wear("陵水", 6),
    住: item("sangem-moon", "三正月第三晚 · 行李不动", "最后一个完整日继续住土福湾，保持全程只换两次酒店。", ["白天整理购物与返程物品", "晚间确认次日还车点"], ["xhs-68a893f3000000001c032dad", "hotel-sangem-moon", "map-hotel-sangem-moon"], { price: "已计入连住预算" }),
    行: item("route-tufu-cdf", "土福湾 ⇄ 海棠湾免税城（可跳过）", "距离比清水湾更近，但仍只在有清单时前往。", ["避开午后集中客流", "购物后直接回酒店"], ["transport-clearwater-cdf", "transport-lingshui-sanya"], { fallback: "无清单或天气差就不开车。" }),
    玩: item("cdf-sanya", "二选一：免税城或土福湾留白", "用明确选择替代‘都来海南了必须去’，不让自由日变赶场。", ["购物者预留 3–4 小时", "非购物者选择泳池、阅读或海岸"], ["play-cdf", "play-map-tufu"], { fallback: "营业规则以中免当天通知为准。" }),
  },
  {
    planId: "B", dayId: 7,
    吃: item("sanya-airport-food", "三正月早餐 + 机场简餐", "不在返程日进入三亚城区，吃完早餐直接走。", ["退房前补水", "机场内再按时间决定加餐"], ["map-food-sanya-xiaogao", "xhs-6QybMpO8y3I"], { price: "两人约 ¥80–180" }),
    穿: wear("三亚", 7),
    住: item("departure-day-b", "全程三基地，到此结束", "海口、万宁、陵水各一处基地，总共换两次酒店，不再添加三亚住宿。", ["前一晚完成打包", "离房前按清单检查证件与充电设备"], ["hotel-sangem-moon", "transport-sanya-airport"]),
    行: item("route-tufu-sanya", "土福湾 → 三亚凤凰机场 → 武汉", "建议起飞前 4.5–5 小时离店，雨天再增加一小时。", ["先到还车点验车、加油并留影", "完成摆渡后再办理值机"], ["transport-lingshui-sanya", "transport-sanya-return-car", "transport-sanya-airport"], { fallback: "按台风和航司通知提前调整。" }),
    玩: item("return-home-b", "不补三亚湾或南山", "返程确定性比最后一个景点更重要。", ["利用候机时间整理照片", "到武汉后再补一顿正餐"], ["xhs-69c4017c0000000023021eb9", "play-map-sanya-bay"], { fallback: "延误时留在机场内。" }),
  },
];

const categories: ResearchCategory[] = ["吃", "穿", "住", "行", "玩"];

export const tripRecommendations: TripRecommendation[] = dailySeeds.flatMap((day) => categories.map((category) => ({
  ...day[category],
  id: `${day.planId}-d${day.dayId}-${category}`,
  planId: day.planId,
  dayId: day.dayId,
  category,
  verifiedAt: "2026-08-14" as const,
})));

export function recommendationsForDay(dayId: number, planId: PlanId) {
  return { dayId, planId, items: tripRecommendations.filter((item) => item.dayId === dayId && item.planId === planId) };
}

export function recommendationsForPlace(entityId: string, planId?: PlanId) {
  return tripRecommendations.filter((item) => item.entityId === entityId && (!planId || item.planId === planId));
}

export type HotelDecisionProfile = {
  id: string;
  name: string;
  planId: PlanId;
  base: 1 | 2 | 3;
  city: "海口" | "万宁" | "陵水";
  area: string;
  stay: string;
  room: string;
  view: string;
  dining: string;
  parking: string;
  fit: string;
  cautions: string[];
  priceBand: string;
  evidenceIds: string[];
  verifiedAt: "2026-08-14";
};

export const hotelDecisionProfiles: HotelDecisionProfile[] = [
  { id: "hongyuan-crest", name: "海口鸿园酒店公寓·雅诗阁臻选", planId: "A", base: 1, city: "海口", area: "江东新区", stay: "Day 1 · 1 晚", room: "优先海景开间或一居室；付款前确认窗外朝向与是否含早", view: "官网展示多种海景公寓，但基础房并非全部海景", dining: "首晚建议酒店内用餐，周边餐饮密度低于市中心", parking: "落地后约 15–25 分钟自驾，提前核对停车入口", fit: "2024 新开、设计感强、离机场近且避开市中心", cautions: ["服务式公寓不等同大型度假村", "只住一晚，不为大套房过度加价"], priceBand: "¥700–1200/晚 · 九月预算带，非实时价格", evidenceIds: ["xhs-search-hongyuan-crest", "hotel-hongyuan-crest", "hotel-hongyuan-crest-ctrip", "map-hotel-hongyuan-crest"], verifiedAt: "2026-08-14" },
  { id: "yuyue-artia", name: "万宁日月湾中旅逐浪屿玥酒店", planId: "A", base: 2, city: "万宁", area: "日月湾", stay: "Day 2–3 · 2 晚", room: "优先安静朝向并明确海景的房型；睡眠敏感者备注避开高铁侧", view: "度假区靠近日月湾，公开页展示海岸、冲浪池与度假公区", dining: "长早餐和酒店餐厅适合换宿日与雨天", parking: "自驾进入中旅逐浪度假区，按酒店指引停车", fit: "2025 新开、年轻设计与冲浪度假氛围更强", cautions: ["新开酒店评价样本仍少", "高铁噪声和周末客流需要看近期评价"], priceBand: "¥900–1600/晚 · 九月预算带，非实时价格", evidenceIds: ["xhs-search-yuyue-artia", "hotel-yuyue-artia", "hotel-yuyue-artia-ctrip", "map-hotel-yuyue-artia"], verifiedAt: "2026-08-14" },
  { id: "kimpton-clearwater", name: "海南清水湾金普顿酒店", planId: "A", base: 3, city: "陵水", area: "清水湾", stay: "Day 4–6 · 3 晚", room: "优先明确正海景的基础房；私人泳池套房只在价差合理时考虑", view: "官方与携程公开页展示海景房、无边水景和设计公区", dining: "酒店内餐饮足以覆盖完整留白日", parking: "自驾到清水湾大道海丝路，到店复核充电和停车", fit: "2025 新开，后三晚固定基地，设计、海景与不奔波兼顾", cautions: ["热门新酒店周末公区可能热闹", "海景房须核对楼层、朝向和遮挡"], priceBand: "¥1700–2600/晚 · 九月预算带，非实时价格", evidenceIds: ["xhs-search-kimpton-clearwater", "hotel-kimpton-clearwater", "hotel-kimpton-clearwater-ctrip", "map-hotel-kimpton-clearwater"], verifiedAt: "2026-08-14" },
  { id: "haikou-marriott", name: "海口万豪酒店", planId: "B", base: 1, city: "海口", area: "西海岸", stay: "Day 1 · 1 晚", room: "优先豪华海景大床/双床；付款前核对房型名称与阳台", view: "官方客房页提供 180° 海景阳台房型", dining: "首晚可直接使用酒店餐饮，不进市区", parking: "自驾到酒店停车场；落地时先核对停车入口", fit: "成熟服务、远离市中心，适合落地缓冲和次日南下", cautions: ["楼龄不是新酒店路线", "机场至西海岸需预留 50–70 分钟"], priceBand: "¥700–1200/晚 · 九月预算带，非实时价格", evidenceIds: ["xhs-search-haikou-marriott", "hotel-haikou-marriott-overview", "hotel-haikou-marriott-rooms", "map-hotel-haikou-marriott"], verifiedAt: "2026-08-14" },
  { id: "grand-hyatt-wanning", name: "万宁神州半岛君悦酒店", planId: "B", base: 2, city: "万宁", area: "神州半岛", stay: "Day 2–3 · 2 晚", room: "预订页必须明确标注海景，不用园景房赌视野", view: "酒店位于神州半岛，房型含园景或海景", dining: "酒店内可完成换住日晚餐和第二晚休息", parking: "自驾入半岛，提前确认停车与充电", fit: "成熟服务和相对独立海岸更适合安静慢住", cautions: ["周末亲子客流可能增加", "海边酒店不等于所有房间海景"], priceBand: "¥1000–1800/晚 · 九月预算带，非实时价格", evidenceIds: ["xhs-6a33dac0000000002100add2", "hotel-grand-hyatt-wanning", "map-hotel-grand-hyatt-wanning"], verifiedAt: "2026-08-14" },
  { id: "sangem-moon", name: "海南三正月酒店", planId: "B", base: 3, city: "陵水", area: "土福湾", stay: "Day 4–6 · 3 晚", room: "比较主楼明确海景房；确认楼层、朝向和是否靠近亲子区", view: "官网房型页提供海景房，酒店约 350 米通达沙滩", dining: "明月宫等酒店餐饮可覆盖完整酒店日", parking: "自驾直接到酒店，出发前向酒店复核停车与充电", fit: "预算更可控，仍有海景、海岸和空中泳池", cautions: ["大型亲子度假酒店，安静度取决于楼层与房区", "不要仅凭营销图判断实际视野"], priceBand: "¥650–1100/晚 · 九月预算带，非实时价格", evidenceIds: ["xhs-68a893f3000000001c032dad", "hotel-sangem-moon", "hotel-sangem-rooms", "map-hotel-sangem-moon"], verifiedAt: "2026-08-14" },
];

export type SanyaBayGuide = {
  name: "三亚湾" | "大东海" | "亚龙湾" | "海棠湾";
  fit: string;
  quietness: string;
  swim: string;
  convenience: string;
  tradeoff: string;
  hotelCandidates: string[];
  evidenceIds: string[];
  coordinates: { lat: number; lng: number };
};

export const sanyaBayGuide: SanyaBayGuide[] = [
  { name: "三亚湾", fit: "机场、城市便利和日落优先", quietness: "中低；沿线差异大", swim: "海水与沙质通常不作为四湾首选", convenience: "距机场近，吃饭与补给最方便", tradeoff: "老酒店较多，必须看近期房间实拍与翻新年份", hotelCandidates: ["康年", "海韵"], evidenceIds: ["xhs-6a7c01e500000000220162ab", "xhs-6gqXrkMD9Zk", "play-map-sanya-bay"], coordinates: { lat: 18.278, lng: 109.452 } },
  { name: "大东海", fit: "市区餐饮、夜间散步和短途出行", quietness: "中低；更有生活与游客密度", swim: "公共海湾，先看当天海况与旗帜", convenience: "餐饮密集，去市区景点方便", tradeoff: "安静度与度假封闭感弱于亚龙湾、海棠湾", hotelCandidates: ["山海天JW万豪"], evidenceIds: ["xhs-6a7c01e500000000220162ab", "xhs-6gqXrkMD9Zk", "play-dadonghai", "hotel-jw-dadonghai"], coordinates: { lat: 18.221, lng: 109.518 } },
  { name: "亚龙湾", fit: "沙滩、游泳和传统度假感优先", quietness: "中高；选独立湾区酒店更安静", swim: "通常是四湾中更适合海滩度假的候选", convenience: "酒店内完善，但外出用餐和交通成本更高", tradeoff: "房价与餐饮溢价明显，老牌酒店需看翻新状态", hotelCandidates: ["亚龙湾万豪", "太阳湾柏悦"], evidenceIds: ["xhs-6a7c01e500000000220162ab", "xhs-6gqXrkMD9Zk", "play-map-yalong", "hotel-sanya-marriott-yalong"], coordinates: { lat: 18.226, lng: 109.638 } },
  { name: "海棠湾", fit: "新度假村、免税购物和完整酒店设施", quietness: "中高；酒店内部安静，公共热点客流大", swim: "风浪常较大，不宜把随意下海作为核心诉求", convenience: "距免税城近，距市区和机场更远", tradeoff: "酒店和餐饮预算高；真正体验依赖选对房型与酒店设施", hotelCandidates: ["理文索菲特", "海棠湾喜来登"], evidenceIds: ["xhs-6a7c01e500000000220162ab", "xhs-6gqXrkMD9Zk", "play-haitang-bay", "hotel-sofitel-sanya"], coordinates: { lat: 18.333, lng: 109.747 } },
];
