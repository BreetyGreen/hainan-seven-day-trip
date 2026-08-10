export type TravelMode = "solo" | "duo";
export type PlaceCategory =
  | "transport"
  | "food"
  | "coffee"
  | "forest"
  | "tea"
  | "village"
  | "stay";

export type Coordinates = { lat: number; lng: number };

export type Place = {
  id: string;
  name: string;
  shortName: string;
  category: PlaceCategory;
  coordinates: Coordinates;
  why: string;
  visitNote: string;
  sourceLabel: string;
  sourceUrl: string;
  verifiedAt: string;
};

export type Day = {
  id: number;
  dateLabel: string;
  title: string;
  area: string;
  summary: string;
  placeIds: string[];
  distanceLabel: string;
  driveLabel: string;
  sleep: string;
  meals: string[];
  pace: "转场" | "松弛" | "步行" | "山路";
  weatherPlan: string;
};

export type BudgetItem = {
  label: string;
  min: number;
  max: number;
  note: string;
};

export type Budget = {
  people: number;
  items: BudgetItem[];
  total: { min: number; max: number };
};

const verifiedAt = "2026-08-10";

export const places: Place[] = [
  {
    id: "wuhan-airport",
    name: "武汉天河国际机场",
    shortName: "武汉天河",
    category: "transport",
    coordinates: { lat: 30.7756632, lng: 114.2171149 },
    why: "武汉出发的推荐航空起点。",
    visitNote: "9 月具体航班和价格以航空公司出票页为准。",
    sourceLabel: "OpenStreetMap 实体",
    sourceUrl: "https://www.openstreetmap.org/search?query=%E6%AD%A6%E6%B1%89%E5%A4%A9%E6%B2%B3%E5%9B%BD%E9%99%85%E6%9C%BA%E5%9C%BA",
    verifiedAt,
  },
  {
    id: "kunming-airport",
    name: "昆明长水国际机场",
    shortName: "昆明长水",
    category: "transport",
    coordinates: { lat: 25.1087786, lng: 102.9397246 },
    why: "衔接武汉航班与昆明南站的稳定中转点。",
    visitNote: "机场到昆明南站需预留市内交通和安检缓冲。",
    sourceLabel: "OpenStreetMap 实体",
    sourceUrl: "https://www.openstreetmap.org/search?query=%E6%98%86%E6%98%8E%E9%95%BF%E6%B0%B4%E5%9B%BD%E9%99%85%E6%9C%BA%E5%9C%BA",
    verifiedAt,
  },
  {
    id: "kunming-south",
    name: "昆明南站",
    shortName: "昆明南",
    category: "transport",
    coordinates: { lat: 24.8733628, lng: 102.8603804 },
    why: "乘中老铁路动车前往普洱。",
    visitNote: "动车班次仅作交通结构，不在网页写死时刻。",
    sourceLabel: "OpenStreetMap 实体",
    sourceUrl: "https://www.openstreetmap.org/search?query=%E6%98%86%E6%98%8E%E5%8D%97%E7%AB%99",
    verifiedAt,
  },
  {
    id: "puer-station",
    name: "普洱站",
    shortName: "普洱站",
    category: "transport",
    coordinates: { lat: 22.7784879, lng: 100.9412056 },
    why: "进入思茅城区并开始当地自驾的落地点。",
    visitNote: "建议次日白天取车，抵达晚时不赶山路。",
    sourceLabel: "OpenStreetMap 铁路站点",
    sourceUrl: "https://www.openstreetmap.org/node/8359782369",
    verifiedAt,
  },
  {
    id: "wuyi-market",
    name: "思茅五一集贸市场",
    shortName: "五一市场",
    category: "food",
    coordinates: { lat: 22.7854, lng: 100.9731 },
    why: "先从本地人的早市认识野菜、米干和当季食材。",
    visitNote: "早上去，尊重摊主，不把市场当摄影棚。",
    sourceLabel: "普洱日报：五一农贸市场",
    sourceUrl: "https://www.puerw.cn/perb/html/2022-01/06/content_6310.htm",
    verifiedAt,
  },
  {
    id: "simao-old-street",
    name: "思茅老街与戴家巷",
    shortName: "戴家巷",
    category: "food",
    coordinates: { lat: 22.7868, lng: 100.9722 },
    why: "老城区生活、茶咖小店与晚饭可以自然串在一起。",
    visitNote: "工作日下午比节假日晚间更安静。",
    sourceLabel: "云南网：思茅老街与戴家巷",
    sourceUrl: "https://m.yunnan.cn/system/2026/05/04/033993822.shtml",
    verifiedAt,
  },
  {
    id: "xiaoaozi-coffee",
    name: "小凹子咖啡庄园",
    shortName: "小凹子咖啡",
    category: "coffee",
    coordinates: { lat: 22.6610788, lng: 100.9578162 },
    why: "三代种植者经营的原产地庄园，重点是种植、处理和杯测。",
    visitNote: "九月不是鲜果主采季；务必提前电话确认参观与讲解。",
    sourceLabel: "文化和旅游部乡村旅游线路",
    sourceUrl: "https://zhuanti.mct.gov.cn/xcsshfghlxj/jpxl/detail/9148.html",
    verifiedAt,
  },
  {
    id: "rhinoceros-plain",
    name: "普洱太阳河森林公园犀牛坪景区",
    shortName: "太阳河·犀牛坪",
    category: "forest",
    coordinates: { lat: 22.6200425, lng: 101.0889865 },
    why: "完整的季风常绿阔叶林环境与科普步道，承担雨林和动物体验。",
    visitNote: "只走开放步道；人工照护动物不等于野外偶遇。",
    sourceLabel: "云南省林业和草原局",
    sourceUrl: "https://lcj.yn.gov.cn/special/2025/0508/6583.html",
    verifiedAt,
  },
  {
    id: "huimin-town",
    name: "澜沧县惠民镇",
    shortName: "惠民镇",
    category: "stay",
    coordinates: { lat: 22.2622, lng: 100.079 },
    why: "进入景迈山前的住宿与补给节点，避免夜驾村寨山路。",
    visitNote: "油量过半再上山，雨天先问民宿当日道路情况。",
    sourceLabel: "联合国教科文组织遗产地位置说明",
    sourceUrl: "https://whc.unesco.org/en/list/1665/",
    verifiedAt,
  },
  {
    id: "nuogang",
    name: "糯岗古寨",
    shortName: "糯岗",
    category: "village",
    coordinates: { lat: 22.2166836, lng: 99.9998707 },
    why: "保存完整的傣族村落空间，是理解茶林与村寨关系的一站。",
    visitNote: "慢走、低声，不进入未开放民居。",
    sourceLabel: "UNESCO：糯岗傣族村寨",
    sourceUrl: "https://whc.unesco.org/en/documents/200162",
    verifiedAt,
  },
  {
    id: "wengji",
    name: "翁基古寨",
    shortName: "翁基",
    category: "village",
    coordinates: { lat: 22.1736769, lng: 99.99894 },
    why: "布朗族村寨与古茶林紧密相连，适合预约茶农坐下来聊。",
    visitNote: "停车服从现场管理；不追逐日落机位。",
    sourceLabel: "UNESCO：翁基古茶树",
    sourceUrl: "https://whc.unesco.org/en/documents/200172",
    verifiedAt,
  },
  {
    id: "mangjing",
    name: "芒景村",
    shortName: "芒景",
    category: "tea",
    coordinates: { lat: 22.1599536, lng: 100.0163233 },
    why: "布朗族茶祖信仰与古茶林生活传统的重要组成部分。",
    visitNote: "宗教和祭祀空间先询问再拍摄。",
    sourceLabel: "UNESCO：芒景古茶林景观",
    sourceUrl: "https://whc.unesco.org/en/documents/200168",
    verifiedAt,
  },
  {
    id: "jingmai-tea-forest",
    name: "景迈山古茶林开放游览区",
    shortName: "景迈古茶林",
    category: "tea",
    coordinates: { lat: 22.1841667, lng: 100.0075 },
    why: "世界遗产的核心不是一棵网红古树，而是茶林、森林、村寨和治理体系。",
    visitNote: "提前一个月通过“景迈山预约服务”核验入园；不进入非开放茶林。",
    sourceLabel: "UNESCO 世界遗产中心",
    sourceUrl: "https://whc.unesco.org/en/list/1665/",
    verifiedAt,
  },
  {
    id: "lancang-county",
    name: "澜沧拉祜族自治县县城",
    shortName: "澜沧县城",
    category: "stay",
    coordinates: { lat: 22.6720893, lng: 99.9312377 },
    why: "思茅与景迈山之间的休息、午餐和补给节点。",
    visitNote: "不要为了多塞景点跳过补给和驾驶休息。",
    sourceLabel: "OpenStreetMap 行政实体",
    sourceUrl: "https://www.openstreetmap.org/search?query=%E6%BE%9C%E6%B2%A7%E6%8B%89%E7%A5%9C%E6%97%8F%E8%87%AA%E6%B2%BB%E5%8E%BF",
    verifiedAt,
  },
  {
    id: "xinxing-street",
    name: "思茅区新兴街",
    shortName: "新兴街",
    category: "food",
    coordinates: { lat: 22.7816, lng: 100.9748 },
    why: "本地夜间烧烤较集中的生活街区，适合返程前轻松吃一顿。",
    visitNote: "按人数少点、先问辣度和份量，不追榜单店。",
    sourceLabel: "云南网：新兴街餐饮外摆区",
    sourceUrl: "https://puer.yunnan.cn/system/2026/07/24/034094296.shtml",
    verifiedAt,
  },
];

export const days: Day[] = [
  {
    id: 1,
    dateLabel: "抵达日",
    title: "武汉 → 昆明 → 普洱",
    area: "航空＋中老铁路",
    summary: "把第一天留给转场。抵达思茅后只入住，不在夜里熟悉陌生车辆或赶山路。",
    placeIds: ["wuhan-airport", "kunming-airport", "kunming-south", "puer-station"],
    distanceLabel: "跨省转场",
    driveLabel: "当地不驾车",
    sleep: "思茅城区舒适型酒店",
    meals: ["机场简餐", "抵达后清淡米线或汤锅"],
    pace: "转场",
    weatherPlan: "若航班晚点导致动车无法衔接，当晚住昆明，不冒险压缩后续换乘。",
  },
  {
    id: 2,
    dateLabel: "城市慢走",
    title: "早市、老街与咖啡庄园",
    area: "思茅城区＋南屏镇",
    summary: "先用半天认识当地人的日常，再去咖啡产地听种植者讲一杯咖啡如何长出来。",
    placeIds: ["wuyi-market", "simao-old-street", "xiaoaozi-coffee"],
    distanceLabel: "约 48 km",
    driveLabel: "约 1.5 h，分段驾驶",
    sleep: "思茅城区舒适型酒店",
    meals: ["五一市场米干/豆汤", "庄园简餐需预约", "戴家巷附近晚饭"],
    pace: "松弛",
    weatherPlan: "大雨时先走市场和老街，把庄园调整到雨势较小的半天。",
  },
  {
    id: 3,
    dateLabel: "雨林日",
    title: "太阳河森林与犀牛坪",
    area: "思茅东南",
    summary: "走开放森林步道，留足时间观察植物与动物，不把一天塞成景点竞速。",
    placeIds: ["puer-station", "rhinoceros-plain"],
    distanceLabel: "往返约 90 km",
    driveLabel: "约 2 h",
    sleep: "思茅城区舒适型酒店",
    meals: ["酒店早餐", "景区内简餐/自带轻食", "新兴街本地烧烤"],
    pace: "步行",
    weatherPlan: "雷雨、暴雨预警或步道临时关闭时，改为普洱市博物馆与城区茶咖日。",
  },
  {
    id: 4,
    dateLabel: "进山日",
    title: "思茅 → 澜沧 → 惠民",
    area: "普洱西南山路",
    summary: "白天完成长距离转场，在澜沧县城吃午饭和补给，天黑前到惠民镇。",
    placeIds: ["puer-station", "lancang-county", "huimin-town"],
    distanceLabel: "约 263 km",
    driveLabel: "约 4.5–5.5 h",
    sleep: "惠民镇品质民宿",
    meals: ["思茅早餐", "澜沧县城午饭", "民宿晚饭提前确认"],
    pace: "山路",
    weatherPlan: "连续强降雨时不进景迈山，在澜沧县城住一晚并询问次日道路。",
  },
  {
    id: 5,
    dateLabel: "茶山日",
    title: "糯岗、翁基、芒景与古茶林",
    area: "景迈山世界遗产地",
    summary: "理解茶林、村寨与居民生活的关系；只走开放区域，把品茶时间留给提前约好的茶农。",
    placeIds: ["huimin-town", "nuogang", "wengji", "mangjing", "jingmai-tea-forest"],
    distanceLabel: "山内约 69 km",
    driveLabel: "约 2.5 h＋多段步行",
    sleep: "惠民镇或开放住宿区品质民宿",
    meals: ["民宿早餐", "村寨午餐提前预约", "民宿晚饭"],
    pace: "步行",
    weatherPlan: "浓雾时减少村寨之间往返，选一个古茶林和一个村寨深度停留。",
  },
  {
    id: 6,
    dateLabel: "回城日",
    title: "景迈山 → 澜沧 → 思茅",
    area: "原路白天返程",
    summary: "上午留作茶山补偿时段，午前下山，避免疲劳和夜间驾驶；回思茅吃最后一顿本地晚饭。",
    placeIds: ["huimin-town", "lancang-county", "xinxing-street"],
    distanceLabel: "约 268 km",
    driveLabel: "约 4.5–5.5 h",
    sleep: "思茅城区舒适型酒店",
    meals: ["民宿早餐", "澜沧县城午饭", "新兴街晚饭"],
    pace: "山路",
    weatherPlan: "若道路状态不佳，放弃上午活动，尽早下山；必要时澜沧过夜并顺延返程。",
  },
  {
    id: 7,
    dateLabel: "返程日",
    title: "普洱 → 昆明 → 武汉",
    area: "中老铁路＋航空",
    summary: "白天还车，动车到昆明后预留至少 4 小时转场缓冲，再乘机回武汉。",
    placeIds: ["puer-station", "kunming-south", "kunming-airport", "wuhan-airport"],
    distanceLabel: "跨省转场",
    driveLabel: "仅还车",
    sleep: "回家；衔接不理想则昆明一晚",
    meals: ["思茅早餐", "动车简餐", "机场晚餐"],
    pace: "转场",
    weatherPlan: "若没有安全衔接的同日航班，增加昆明过夜，不购买极限联程。",
  },
];

function makeBudget(people: number, items: BudgetItem[]): Budget {
  return {
    people,
    items,
    total: {
      min: items.reduce((sum, item) => sum + item.min, 0),
      max: items.reduce((sum, item) => sum + item.max, 0),
    },
  };
}

export const budgets: Record<TravelMode, Budget> = {
  solo: makeBudget(1, [
    { label: "武汉往返大交通", min: 1800, max: 2400, note: "机票＋昆明至普洱动车" },
    { label: "小型自动挡租车", min: 1100, max: 1500, note: "约 5 天，含基础保障估算" },
    { label: "6 晚住宿", min: 1200, max: 1600, note: "单人独享房间" },
    { label: "餐食与茶咖", min: 550, max: 800, note: "小份菜、庄园体验另确认" },
    { label: "门票与体验", min: 350, max: 550, note: "不写死实时票价" },
    { label: "油费、停车、路桥", min: 350, max: 500, note: "按约 700–800 km 估算" },
    { label: "机动金", min: 300, max: 500, note: "天气改签或临时补给" },
  ]),
  duo: makeBudget(2, [
    { label: "两人往返大交通", min: 3600, max: 4800, note: "机票＋昆明至普洱动车" },
    { label: "紧凑型 SUV / 轿车", min: 1300, max: 1800, note: "约 5 天，费用两人共享" },
    { label: "6 晚住宿", min: 1500, max: 2200, note: "大床或双床房" },
    { label: "两人餐食与茶咖", min: 1200, max: 1800, note: "共享菜更适合尝本地风味" },
    { label: "两人门票与体验", min: 700, max: 1100, note: "不写死实时票价" },
    { label: "油费、停车、路桥", min: 450, max: 650, note: "按约 700–800 km 估算" },
    { label: "共同机动金", min: 800, max: 1500, note: "雨季改签、住宿升级或道路调整" },
  ]),
};

export function getBudget(mode: TravelMode): Budget {
  return budgets[mode];
}

export function getDayRoute(dayId: number): Place[] {
  const day = days.find((item) => item.id === dayId);
  if (!day) return [];
  return day.placeIds
    .map((placeId) => places.find((place) => place.id === placeId))
    .filter((place): place is Place => Boolean(place));
}
