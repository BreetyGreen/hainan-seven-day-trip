import { withBasePath } from "./site-paths.ts";

export type TravelMode = "solo" | "duo";

export type PlaceCategory =
  | "transport"
  | "oldtown"
  | "coast"
  | "garden"
  | "stay"
  | "food"
  | "culture"
  | "harbor"
  | "viewpoint";

export type TravelLegMode = "flight" | "drive" | "walk" | "boat" | "optional";

export type Source = {
  platform: "小红书" | "官网" | "地图";
  author: string;
  title: string;
  url: string;
};

export type PhotoSource = {
  src: string;
  alt: string;
  platform: "小红书" | "官网" | "携程" | "媒体";
  credit: string;
  creditUrl: string;
  noteTitle: string;
};

export type Activity = {
  time: string;
  duration: string;
  steps: string[];
  practical: string[];
  weather: string;
  source: Source;
};

export type Place = {
  id: string;
  name: string;
  shortName: string;
  city: string;
  category: PlaceCategory;
  coordinates: { lat: number; lng: number };
  why: string;
  activity: Activity;
  image?: PhotoSource;
  gallery?: PhotoSource[];
  hotelId?: string;
  sourceUrl: string;
  verifiedAt: "2026-08-11";
};

export type RouteLeg = {
  fromIndex: number;
  toIndex: number;
  mode: TravelLegMode;
  durationLabel: string;
  distanceLabel?: string;
  timingNote?: string;
  fallback: string;
};

export type Day = {
  id: number;
  city: string;
  title: string;
  dateLabel: string;
  pace: string;
  summary: string;
  placeIds: string[];
  legs: RouteLeg[];
  distanceLabel: string;
  driveLabel: string;
  sleep: string;
  meals: string[];
  weatherPlan: string;
  isHotelChange?: boolean;
};

export type Hotel = {
  id: string;
  name: string;
  shortName: string;
  city: string;
  checkInDay: number;
  nights: string;
  opened: number;
  fit: string;
  reasons: string[];
  cautions: string[];
  image: PhotoSource;
  gallery?: PhotoSource[];
  officialUrl: string;
  xhsSource: { author: string; title: string; url: string };
};

export type PlanDay = {
  dayId: number;
  title: string;
  summary: string;
  highlights: string[];
  fallback: string;
};

export type BudgetRange = { min: number; max: number };

export type BudgetItem = {
  id: "flights" | "hotels" | "car" | "food" | "activities" | "buffer";
  label: string;
  note: string;
  sharing: "shared" | "per-person";
  range: BudgetRange;
};

export type BudgetEstimate = {
  target: number;
  period: string;
  disclaimer: string;
  items: BudgetItem[];
};

export type CalculatedBudget = {
  travelers: number;
  total: BudgetRange;
  perPerson: BudgetRange;
  overTarget: BudgetRange;
  items: Array<BudgetItem & { calculatedRange: BudgetRange }>;
};

export type ItineraryPlan = {
  id: "A" | "B";
  name: string;
  tagline: string;
  description: string;
  color: string;
  days: PlanDay[];
  schedule: Day[];
  hotels: Hotel[];
  budget: BudgetEstimate;
  routePath: `/routes/${string}.geojson`;
};

const mapSource = (title: string, url: string): Source => ({
  platform: "地图",
  author: "地图核验",
  title,
  url,
});

const officialPhoto = (src: string, alt: string, credit: string, creditUrl: string, noteTitle: string): PhotoSource => ({
  src: withBasePath(src),
  alt,
  platform: "官网",
  credit,
  creditUrl,
  noteTitle,
});

const xhsPhoto = (src: string, alt: string, credit: string, creditUrl: string, noteTitle: string): PhotoSource => ({
  src: withBasePath(src),
  alt,
  platform: "小红书",
  credit,
  creditUrl,
  noteTitle,
});

const ctripPhoto = (src: string, alt: string, credit: string, creditUrl: string, noteTitle: string): PhotoSource => ({
  src: withBasePath(src),
  alt,
  platform: "携程",
  credit,
  creditUrl,
  noteTitle,
});

const mediaPhoto = (src: string, alt: string, credit: string, creditUrl: string, noteTitle: string): PhotoSource => ({
  src: withBasePath(src),
  alt,
  platform: "媒体",
  credit,
  creditUrl,
  noteTitle,
});

const xhsQilou = "https://www.xiaohongshu.com/search_result/6a689911000000000503abca";
const xhsXincun = "https://www.xiaohongshu.com/search_result/6a71b3a50000000021020fc8";
const xhsLuhuitou = "https://www.xiaohongshu.com/search_result/690489c200000000030373f2";
const xhsSangem = "https://www.xiaohongshu.com/search_result/68a893f3000000001c032dad";
const xhsWanningReality = "https://www.xiaohongshu.com/search_result/69abee14000000000e03ce43";
const xhsWanningHyatt = "https://www.xiaohongshu.com/search_result/6a33dac0000000002100add2";
const xhsWanningFood = "https://www.xiaohongshu.com/search_result?keyword=%E4%B8%87%E5%AE%81%E7%BA%AF%E5%9C%9F%E8%91%97%E5%BF%85%E5%90%8318%E5%AE%B6%E8%80%81%E5%BA%97";
const sangemOfficial = "https://www.sangemmoon.com/";
const atourCtrip = "https://hotels.ctrip.com/hotels/120750482.html";
const wanningHyattOfficial = "https://www.hyatt.com/grand-hyatt/zh-CN/shhgh-grand-hyatt-shenzhou-peninsula";
const indigoOfficial = "https://www.ihg.com.cn/hotelindigo/hotels/cn/zh/lingshui/lqswb/hoteldetail";
const cdfOfficial = "https://www.ctgdutyfree.com.cn/detail/4340.html";
const haikouMarriottOfficial = "https://www.marriott.com.cn/hotels/HAKMC-haikou-marriott-hotel/overview/";
const haikouWestCoastHolidayOfficial = "https://www.ihg.com.cn/holidayinn/hotels/cn/zh/haikou/hakbh/hoteldetail";
const wanningHolidayOfficial = "https://www.ihg.com.cn/holidayinnresorts/hotels/cn/zh/wanning/wxjsh/hoteldetail";
const xhsHaikouWestCoast = "https://www.xiaohongshu.com/search_result?keyword=%E6%B5%B7%E5%8F%A3%E8%A5%BF%E6%B5%B7%E5%B2%B8%E6%B5%B7%E6%99%AF%E9%85%92%E5%BA%97";
const ctripWanningHoliday = "https://hotels.ctrip.com/hotels/132011313.html";
const xhsXinglongGarden = "https://www.xiaohongshu.com/search_result?keyword=%E5%85%B4%E9%9A%86%E7%83%AD%E5%B8%A6%E6%A4%8D%E7%89%A9%E5%9B%AD";
const shimeiBayOfficial = "https://www.mee.gov.cn/home/ztbd/2021/mlhwyxalzjhd/algs/hns2/202109/t20210906_900100.shtml";
const shimeiBayCtrip = "https://jp.trip.com/moments/theme/poi-shimei-bay-75965-itinerary-999195/";
const xinglongMct = "https://zhuanti.mct.gov.cn/csxz2022/hainan/detail/1528.html";
const xinglongCtrip = "https://www.trip.com/travel-guide/attraction/wanning/xinglong-tropical-botanical-garden-75967/";
const xincunThePaper = "https://m.thepaper.cn/newsDetail_forward_21141726?commTag=true";
const xincunCgtn = "https://arabic.cgtn.com/news/2023-11-20/1726480234795307009/";
const xincunOfficial = "https://www.hainan.gov.cn/hainan/c100641g/202310/639e14e4e6ef4ae997a117ba042a0d73.shtml?ddtab=true";
const hongyuanOfficial = "https://www.discoverasr.com.cn/the-crest-collection/china/hong-yuan-hotel-by-the-crest-collection";
const yuyueCtrip = "https://hotels.ctrip.com/hotels/133666427.html";
const yuyueOfficial = "https://www.ctg.cn/article/19375";
const kimptonOfficial = "https://www.ihg.com.cn/kimptonhotels/hotels/cn/zh/hainan-clear-water-bay-lingshui-china/lqscl/hoteldetail";
const xhsHongyuan = "https://www.xiaohongshu.com/search_result?keyword=%E6%B5%B7%E5%8F%A3%E9%B8%BF%E5%9B%AD%E9%85%92%E5%BA%97%E5%85%AC%E5%AF%93%E9%9B%85%E8%AF%97%E9%98%81%E8%87%BB%E9%80%89";
const xhsYuyue = "https://www.xiaohongshu.com/search_result?keyword=%E4%B8%87%E5%AE%81%E6%97%A5%E6%9C%88%E6%B9%BE%E4%B8%AD%E6%97%85%E9%80%90%E6%B5%AA%E5%B1%BF%E7%8E%A5%E9%85%92%E5%BA%97";
const xhsKimpton = "https://www.xiaohongshu.com/search_result?keyword=%E6%B5%B7%E5%8D%97%E6%B8%85%E6%B0%B4%E6%B9%BE%E9%87%91%E6%99%AE%E9%A1%BF%E9%85%92%E5%BA%97";

export const routeResearchSource = "https://www.visitsanya.com/zh";

export const places: Place[] = [
  {
    id: "wuhan-airport",
    name: "武汉天河国际机场",
    shortName: "武汉天河",
    city: "武汉",
    category: "transport",
    coordinates: { lat: 30.7756632, lng: 114.2171149 },
    why: "七日旅程的起点和终点。",
    activity: {
      time: "起飞前约 2.5 小时",
      duration: "值机与安检缓冲",
      steps: ["提前一天线上值机并复核航站楼", "证件和充电宝随身携带", "先确认登机口再安排早餐"],
      practical: ["九月雷雨可能影响航班", "去程和返程分别保存航司通知"],
      weather: "雷雨或航班调整时以航司通知为准，不压缩安检时间。",
      source: mapSource("武汉天河国际机场", "https://www.openstreetmap.org/way/128255090"),
    },
    sourceUrl: "https://www.openstreetmap.org/way/128255090",
    verifiedAt: "2026-08-11",
  },
  {
    id: "haikou-airport",
    name: "海口美兰国际机场",
    shortName: "海口美兰",
    city: "海口",
    category: "transport",
    coordinates: { lat: 19.9442567, lng: 110.4592869 },
    why: "海口进、三亚出的北端入口；落地后取车，不走回头路。",
    activity: {
      time: "落地后 45–75 分钟",
      duration: "取行李与取车",
      steps: ["取行李后前往订单指定柜台", "拍全车视频并核对油量、轮胎和划痕", "副驾完成首段导航后再驶离机场"],
      practical: ["保存驾驶证与租车订单截图", "拒绝临时揽客和订单外加价"],
      weather: "暴雨时先在机场等待雨势减弱，不疲劳驾驶。",
      source: mapSource("海口美兰国际机场", "https://www.openstreetmap.org/relation/4452375"),
    },
    sourceUrl: "https://www.openstreetmap.org/relation/4452375",
    verifiedAt: "2026-08-11",
  },
  {
    id: "hongyuan-crest",
    name: "海口鸿园酒店公寓·雅诗阁臻选",
    shortName: "海口鸿园",
    city: "海口",
    category: "stay",
    coordinates: { lat: 20.02461, lng: 110.475102 },
    why: "2024 年新开的江东新区设计酒店，离机场近、避开市中心，首晚可以把奔波降到最低。",
    hotelId: "hongyuan-crest",
    activity: {
      time: "Day 1",
      duration: "住 1 晚",
      steps: ["落地取车后直接前往江东新区", "进房核对海景、楼层与遮挡", "晚饭和散步都控制在酒店周边"],
      practical: ["它是服务式公寓型酒店，不要把餐饮丰富度等同大型度假村", "优先可取消的海景开间或一居室"],
      weather: "暴雨或晚点时直接入住，不追加市区活动。",
      source: { platform: "官网", author: "雅诗阁", title: "海口鸿园酒店公寓·雅诗阁臻选", url: hongyuanOfficial },
    },
    image: officialPhoto("/hainan/hongyuan-crest-lobby-official.webp", "海口鸿园酒店公寓雅诗阁臻选大堂", "雅诗阁官方", hongyuanOfficial, "海口鸿园雅诗阁臻选大堂"),
    gallery: [
      officialPhoto("/hainan/hongyuan-crest-seaview-official.webp", "海口鸿园酒店公寓海景客厅", "雅诗阁官方", hongyuanOfficial, "海景公寓客厅"),
      officialPhoto("/hainan/hongyuan-crest-pool-official.webp", "海口鸿园酒店公寓泳池", "雅诗阁官方", hongyuanOfficial, "酒店泳池"),
    ],
    sourceUrl: hongyuanOfficial,
    verifiedAt: "2026-08-11",
  },
  {
    id: "jiangdong-coast",
    name: "海口江东新区海岸慢步段",
    shortName: "江东海岸",
    city: "海口",
    category: "coast",
    coordinates: { lat: 20.0278, lng: 110.4788 },
    why: "首晚只走酒店附近的安静海岸，不再横穿海口去追西海岸日落。",
    activity: {
      time: "17:10–18:10",
      duration: "约 40–60 分钟",
      steps: ["向前台确认当天可走的海岸方向", "只在照明和铺装完整的路段慢走", "天黑前回酒店吃饭"],
      practical: ["周边餐饮密度不如市中心", "风浪大时不下海"],
      weather: "雷雨、晚点或天黑后直接删除。",
      source: mapSource("江东新区澄海路与海岸", "https://www.amap.com/search?query=%E6%B5%B7%E5%8F%A3%E5%B8%82%E6%B1%9F%E4%B8%9C%E6%96%B0%E5%8C%BA%E6%BE%84%E6%B5%B7%E8%B7%AF20%E5%8F%B7"),
    },
    image: officialPhoto("/hainan/hongyuan-crest-seaview-official.webp", "江东海岸方向的海口鸿园海景房视野", "雅诗阁官方", hongyuanOfficial, "江东新区海景视野"),
    sourceUrl: "https://www.amap.com/search?query=%E6%B5%B7%E5%8F%A3%E5%B8%82%E6%B1%9F%E4%B8%9C%E6%96%B0%E5%8C%BA%E6%BE%84%E6%B5%B7%E8%B7%AF20%E5%8F%B7",
    verifiedAt: "2026-08-11",
  },
  {
    id: "yuyue-artia",
    name: "万宁日月湾中旅逐浪屿玥酒店",
    shortName: "逐浪屿玥",
    city: "万宁",
    category: "stay",
    coordinates: { lat: 18.6258, lng: 110.2168 },
    why: "2025 年新开的日月湾度假酒店，用两晚把冲浪湾、兴隆和石梅湾串成短线，而不是当天赶进赶出。",
    hotelId: "yuyue-artia",
    activity: {
      time: "Day 2–3",
      duration: "连住 2 晚",
      steps: ["Day 2 午后一次入住", "先看泳池、海岸通道与房间朝向", "Day 3 短线往返后回同一房间"],
      practical: ["新酒店评价样本仍少，出发前复核近期住客反馈", "靠近高铁线，睡眠敏感者备注安静朝向"],
      weather: "雷雨时保留酒店公区与长早餐，取消海边活动。",
      source: { platform: "官网", author: "中国旅游集团", title: "中旅逐浪度假区开业", url: yuyueOfficial },
    },
    image: ctripPhoto("/hainan/yuyue-artia-aerial-ctrip.webp", "万宁日月湾中旅逐浪屿玥酒店与冲浪池航拍", "携程酒店公开页", yuyueCtrip, "逐浪屿玥酒店与日月湾"),
    gallery: [
      ctripPhoto("/hainan/yuyue-artia-room-ctrip.webp", "万宁日月湾中旅逐浪屿玥酒店客房", "携程酒店公开页", yuyueCtrip, "逐浪屿玥酒店客房"),
      ctripPhoto("/hainan/yuyue-artia-restaurant-ctrip.webp", "万宁日月湾中旅逐浪屿玥酒店餐厅", "携程酒店公开页", yuyueCtrip, "逐浪屿玥酒店餐厅"),
    ],
    sourceUrl: yuyueCtrip,
    verifiedAt: "2026-08-11",
  },
  {
    id: "riyue-bay-coast",
    name: "万宁日月湾安静海岸段",
    shortName: "日月湾岸",
    city: "万宁",
    category: "coast",
    coordinates: { lat: 18.6281, lng: 110.2154 },
    why: "抵达万宁后只熟悉酒店附近海岸，把灯塔、酒吧街和跨湾打卡全部留在计划外。",
    activity: {
      time: "16:30–18:10",
      duration: "约 60–90 分钟",
      steps: ["从酒店确认公共海岸入口", "沿近岸慢走并观察冲浪区域", "日落前返回酒店"],
      practical: ["避开冲浪下水区", "不为打卡跨越封闭工地或私人通道"],
      weather: "红旗、大浪或雷雨时只在酒店观景。",
      source: mapSource("万宁日月湾", "https://www.openstreetmap.org/search?query=Riyue%20Bay%20Wanning"),
    },
    image: ctripPhoto("/hainan/yuyue-artia-aerial-ctrip.webp", "日月湾岸与逐浪屿玥酒店航拍", "携程酒店公开页", yuyueCtrip, "日月湾度假区航拍"),
    sourceUrl: "https://www.openstreetmap.org/search?query=Riyue%20Bay%20Wanning",
    verifiedAt: "2026-08-11",
  },
  {
    id: "kimpton-clearwater",
    name: "海南清水湾金普顿酒店",
    shortName: "清水湾金普顿",
    city: "陵水",
    category: "stay",
    coordinates: { lat: 18.4036, lng: 109.8617 },
    why: "2025 年新开的设计度假酒店，在清水湾连续住三晚，覆盖陵水留白日与免税城往返。",
    hotelId: "kimpton-clearwater",
    activity: {
      time: "Day 4–6",
      duration: "连住 3 晚",
      steps: ["Day 4 从新村港顺路入住", "核对房间海景、楼层与遮挡", "后两天不再搬行李"],
      practical: ["正海景与侧海景价差大，付款前看房型实拍", "新酒店周末和节假日公共区域可能更热闹"],
      weather: "风雨天使用酒店公区、餐厅和室内活动，不乘船不下海。",
      source: { platform: "官网", author: "IHG 金普顿", title: "海南清水湾金普顿酒店", url: kimptonOfficial },
    },
    image: officialPhoto("/hainan/kimpton-clearwater-exterior-official.webp", "海南清水湾金普顿酒店园林与水景外观", "IHG 金普顿官方", kimptonOfficial, "清水湾金普顿外观"),
    gallery: [
      officialPhoto("/hainan/kimpton-clearwater-lounge-official.webp", "海南清水湾金普顿酒店设计休息厅", "IHG 金普顿官方", kimptonOfficial, "清水湾金普顿休息厅"),
      officialPhoto("/hainan/kimpton-clearwater-waterdeck-official.webp", "海南清水湾金普顿酒店水上休闲平台", "IHG 金普顿官方", kimptonOfficial, "清水湾金普顿水景平台"),
    ],
    sourceUrl: kimptonOfficial,
    verifiedAt: "2026-08-11",
  },
  {
    id: "haikou-marriott",
    name: "海口万豪酒店",
    shortName: "海口万豪",
    city: "海口",
    category: "stay",
    coordinates: { lat: 20.0618533, lng: 110.1870672 },
    why: "把抵达夜从市中心移到西海岸：下楼就是海风，第二天直接沿环岛东线南下。",
    hotelId: "haikou-marriott",
    activity: {
      time: "Day 1",
      duration: "住 1 晚",
      steps: ["落地取车后直接去西海岸", "进房核对阳台海景与遮挡", "只在酒店海岸散步，不再折返市区"],
      practical: ["优先可取消海景大床房", "航班晚点就取消散步"],
      weather: "暴雨时在酒店完成晚饭和休息，不进市中心。",
      source: { platform: "官网", author: "Marriott", title: "海口万豪酒店", url: haikouMarriottOfficial },
    },
    image: officialPhoto("/hainan/haikou-marriott-pool-official.webp", "海口万豪酒店临海热带园林与泳池", "Marriott 官方", haikouMarriottOfficial, "海口万豪酒店室外泳池"),
    gallery: [officialPhoto("/hainan/haikou-marriott-official.webp", "海口万豪酒店月色下的中式建筑", "Marriott 官方", haikouMarriottOfficial, "海口万豪酒店西海岸夜景")],
    sourceUrl: haikouMarriottOfficial,
    verifiedAt: "2026-08-11",
  },
  {
    id: "haikou-west-coast-holiday",
    name: "海口西海岸假日酒店",
    shortName: "西海岸假日",
    city: "海口",
    category: "stay",
    coordinates: { lat: 20.049293, lng: 110.216681 },
    why: "Plan B 的海口轻预算海景基地；远离市中心，官方标注 180° 海景客房。",
    hotelId: "haikou-west-coast-holiday",
    activity: {
      time: "Day 1",
      duration: "住 1 晚",
      steps: ["从机场直接抵达西海岸", "入住时确认海景朝向", "晚饭与散步都留在酒店周边"],
      practical: ["比较含早与不含早的可退价", "高楼层仍需确认房型名称"],
      weather: "持续降雨就使用酒店餐厅与室内设施。",
      source: { platform: "官网", author: "IHG", title: "海口西海岸假日酒店", url: haikouWestCoastHolidayOfficial },
    },
    image: officialPhoto("/hainan/haikou-west-coast-holiday-official.webp", "海口西海岸假日酒店海景建筑与泳池", "IHG 官方", haikouWestCoastHolidayOfficial, "海口西海岸假日酒店"),
    sourceUrl: haikouWestCoastHolidayOfficial,
    verifiedAt: "2026-08-11",
  },
  {
    id: "haikou-west-coast",
    name: "海口西海岸酒店海岸",
    shortName: "海口西海岸",
    city: "海口",
    category: "coast",
    coordinates: { lat: 20.0591, lng: 110.1892 },
    why: "用离房间最近的一段海岸替代进城打卡，让抵达日真正安静下来。",
    activity: {
      time: "17:00–18:30",
      duration: "约 60–90 分钟",
      steps: ["入住后从酒店确认开放通道", "沿海岸慢走不超过 40 分钟", "天黑前回酒店吃饭"],
      practical: ["不为日落跨区开车", "看救生旗，不在风浪中下海"],
      weather: "航班晚点、雷雨或大风时直接删除。",
      source: { platform: "小红书", author: "海口西海岸实住合集", title: "海口西海岸海景酒店与日落", url: xhsHaikouWestCoast },
    },
    image: officialPhoto("/hainan/haikou-west-coast-holiday-official.webp", "海口西海岸海湾、椰林与滨海视野", "IHG 官方", haikouWestCoastHolidayOfficial, "海口西海岸海景"),
    sourceUrl: "https://www.openstreetmap.org/search?query=Haikou%20West%20Coast",
    verifiedAt: "2026-08-11",
  },
  {
    id: "haikou-qilou-atour",
    name: "海口万国大都会骑楼亚朵酒店",
    shortName: "海口亚朵",
    city: "海口",
    category: "stay",
    coordinates: { lat: 20.0318, lng: 110.3299 },
    why: "只住一晚，优先位置、隔音和第二天南下的便利，不为海景溢价。",
    hotelId: "haikou-qilou-atour",
    activity: {
      time: "Day 1",
      duration: "住 1 晚",
      steps: ["落地后先入住放行李", "确认停车和次日出库规则", "晚饭后回同一酒店休息"],
      practical: ["房间优先高楼层、远离电梯", "只订可取消基础大床房"],
      weather: "航班晚点时取消骑楼，直接入住。",
      source: { platform: "官网", author: "携程公开页", title: "海口万国大都会骑楼亚朵酒店", url: atourCtrip },
    },
    image: officialPhoto("/hainan/haikou-qilou-atour-official.webp", "海口骑楼亚朵酒店客房与公共区域", "携程酒店公开页", atourCtrip, "海口万国大都会骑楼亚朵酒店"),
    sourceUrl: atourCtrip,
    verifiedAt: "2026-08-11",
  },
  {
    id: "qilou",
    name: "海口骑楼老街",
    shortName: "骑楼老街",
    city: "海口",
    category: "oldtown",
    coordinates: { lat: 20.0447272, lng: 110.3376498 },
    why: "抵达日只安排一段真实街区慢走和海南落地餐。",
    activity: {
      time: "17:00–19:30",
      duration: "约 2 小时",
      steps: ["从中山路入口看骑楼立面", "选一家明码标价的粉面或老爸茶", "天黑后不再增加景点"],
      practical: ["正规停车后步行", "不为排队网红店改变路线"],
      weather: "暴雨或航班晚点时删除此站。",
      source: { platform: "小红书", author: "好运狗🍀", title: "海口·骑楼老街的夜景真的美爆了", url: xhsQilou },
    },
    image: xhsPhoto("/hainan/qilou-night-xhs.webp", "海口骑楼老街夜间建筑与街头生活", "好运狗🍀", xhsQilou, "海口·骑楼老街的夜景真的美爆了"),
    sourceUrl: "https://www.openstreetmap.org/way/1121710510",
    verifiedAt: "2026-08-11",
  },
  {
    id: "wanning-hyatt",
    name: "万宁神州半岛君悦酒店",
    shortName: "万宁君悦",
    city: "万宁",
    category: "stay",
    coordinates: { lat: 18.673544, lng: 110.340735 },
    why: "真正住进万宁两晚：酒店海岸安静，去石梅湾与兴隆都不需要反复搬行李。",
    hotelId: "grand-hyatt-wanning",
    activity: {
      time: "Day 2–3",
      duration: "连住 2 晚",
      steps: ["Day 2 午后一次性入住", "Day 3 只走一条万宁海岸线并返回同一房间", "傍晚把时间留给酒店海岸"],
      practical: ["优先确认真海景朝向与遮挡", "若差价过高就订同半岛假日度假酒店"],
      weather: "雷雨时不追海湾，改用酒店公区、泳池和兴隆午饭。",
      source: { platform: "小红书", author: "熠民", title: "万宁 staycation｜神州半岛君悦真实入住测评", url: xhsWanningHyatt },
    },
    image: officialPhoto("/hainan/grand-hyatt-wanning-pool-official.webp", "万宁神州半岛君悦临海泳池与热带花园", "Hyatt 官方", wanningHyattOfficial, "万宁神州半岛君悦室外泳池"),
    sourceUrl: wanningHyattOfficial,
    verifiedAt: "2026-08-11",
  },
  {
    id: "wanning-holiday-inn",
    name: "万宁神州半岛假日度假酒店",
    shortName: "万宁假日",
    city: "万宁",
    category: "stay",
    coordinates: { lat: 18.680208, lng: 110.361108 },
    why: "Plan B 仍然住进神州半岛，但把预算和酒店内活动放在前面，避免每天跨湾奔波。",
    hotelId: "wanning-holiday-inn",
    activity: {
      time: "Day 2–3",
      duration: "连住 2 晚",
      steps: ["Day 2 一次性入住", "确认房型朝向和早餐", "Day 3 只去兴隆植物园与市场后返回"],
      practical: ["官方地址为神州半岛凤凰路南侧 666 号", "海景餐厅不等于所有房型均为正海景"],
      weather: "大雨时留在酒店；短时阵雨后再去兴隆。",
      source: { platform: "官网", author: "IHG", title: "万宁神州半岛假日度假酒店", url: wanningHolidayOfficial },
    },
    image: ctripPhoto("/hainan/wanning-holiday-inn-pool-ctrip.webp", "万宁神州半岛假日度假酒店无边泳池与园林", "携程酒店公开页", ctripWanningHoliday, "万宁神州半岛假日度假酒店泳池"),
    gallery: [officialPhoto("/hainan/wanning-holiday-inn-official.webp", "万宁神州半岛假日度假酒店蓝调海岸建筑", "IHG 官方", wanningHolidayOfficial, "万宁神州半岛假日度假酒店外观")],
    sourceUrl: wanningHolidayOfficial,
    verifiedAt: "2026-08-11",
  },
  {
    id: "shimei-bay",
    name: "万宁石梅湾",
    shortName: "石梅湾",
    city: "万宁",
    category: "coast",
    coordinates: { lat: 18.661922, lng: 110.27209 },
    why: "六公里海湾、青皮林与九里文化海湾连在一起，比追逐网红咖啡店更适合安静慢走。",
    activity: {
      time: "09:30–11:30",
      duration: "约 2 小时",
      steps: ["09:30 从九里文化海湾公共入口开始", "沿青皮林与海岸步道慢走 40–60 分钟", "在海边书屋停留约 30 分钟", "11:30 前离开去兴隆吃午饭"],
      practical: ["不借私人酒店通道，也不把车驶入沙滩", "红旗或大浪时只走林荫与书屋，不下水"],
      weather: "雷雨时删除此站，直接执行 Plan B。",
      source: { platform: "官网", author: "生态环境部", title: "石梅湾生态修复与九里文化海湾", url: shimeiBayOfficial },
    },
    image: officialPhoto("/hainan/shimei-bay-official.webp", "万宁石梅湾日落下的青皮林与海岸草地", "生态环境部", shimeiBayOfficial, "石梅湾生态修复后的海岸景观"),
    gallery: [
      officialPhoto("/hainan/shimei-bay-aerial-official.webp", "万宁石梅湾碧蓝海水、沙滩与青皮林航拍", "生态环境部", shimeiBayOfficial, "石梅湾沙滩与青皮林航拍"),
      ctripPhoto("/hainan/shimei-bay-coast-ctrip.webp", "万宁石梅湾礁石海岸与热带植被全景", "携程旅行公开内容", shimeiBayCtrip, "石梅湾海岸实景"),
    ],
    sourceUrl: "https://www.openstreetmap.org/way/341370752",
    verifiedAt: "2026-08-11",
  },
  {
    id: "xinglong-market",
    name: "兴隆华侨农贸市场",
    shortName: "兴隆市场",
    city: "万宁",
    category: "food",
    coordinates: { lat: 18.73747, lng: 110.19691 },
    why: "把万宁的南洋味放进真实市场和老店，不在网红咖啡店排队。",
    activity: {
      time: "12:00–13:30",
      duration: "约 1.5 小时",
      steps: ["先看当季水果和香料摊", "午饭选明码标价的后安粉、菠萝包或南洋糕点", "少量多样，不囤生鲜"],
      practical: ["海鲜称重与做法下单前确认", "雨天留意市场外积水"],
      weather: "阵雨可以保留，是万宁 Plan B 的主要外出点。",
      source: { platform: "小红书", author: "万宁本地食客合集", title: "万宁纯土著分享｜必吃老店与市场路线", url: xhsWanningFood },
    },
    image: xhsPhoto("/hainan/xinglong-market-xhs.webp", "万宁兴隆华侨农贸市场水果与南洋小吃", "小红书万宁本地食客合集", xhsWanningFood, "万宁本地老店与兴隆市场合集"),
    sourceUrl: "https://www.amap.com/search?query=%E5%85%B4%E9%9A%86%E5%8D%8E%E4%BE%A8%E5%86%9C%E8%B4%B8%E5%B8%82%E5%9C%BA",
    verifiedAt: "2026-08-11",
  },
  {
    id: "xinglong-garden",
    name: "兴隆热带植物园",
    shortName: "兴隆植物园",
    city: "万宁",
    category: "garden",
    coordinates: { lat: 18.7327905, lng: 110.1962942 },
    why: "Plan B 把海岸打卡换成有遮阴、有讲解的热带植物慢走，还能认识咖啡、可可与香草。",
    activity: {
      time: "09:30–11:30",
      duration: "约 2 小时",
      steps: ["开园后尽早进入，先走咖啡、可可与香草核心区", "现场问清当天是否有咖啡品鉴或巧克力制作体验", "沿湖畔与椰林步道慢走，不求走完全园", "中午前离园去兴隆市场"],
      practical: ["穿防滑鞋并带驱蚊", "体验项目与讲解场次以当天园区公告为准"],
      weather: "小阵雨可保留；雷电或暴雨取消户外步道。",
      source: { platform: "官网", author: "文化和旅游部", title: "兴隆咖啡谷与热带植物园体验", url: xinglongMct },
    },
    image: xhsPhoto("/hainan/xinglong-garden-xhs.webp", "万宁兴隆热带植物园林荫与热带植物", "兴隆植物园游记合集", xhsXinglongGarden, "兴隆热带植物园慢游与避坑"),
    gallery: [
      officialPhoto("/hainan/xinglong-coffee-valley-official.webp", "万宁兴隆咖啡谷与热带园林全景", "文化和旅游部", xinglongMct, "兴隆咖啡谷全景"),
      officialPhoto("/hainan/xinglong-garden-lake-official.webp", "兴隆热带植物园湖畔椰林与草地", "文化和旅游部", xinglongMct, "兴隆热带植物园湖畔"),
      ctripPhoto("/hainan/xinglong-garden-entrance-ctrip.webp", "兴隆热带植物园入口与高大棕榈", "携程旅行公开页", xinglongCtrip, "兴隆热带植物园入口实景"),
    ],
    sourceUrl: "https://www.amap.com/search?query=%E5%85%B4%E9%9A%86%E7%83%AD%E5%B8%A6%E6%A4%8D%E7%89%A9%E5%9B%AD",
    verifiedAt: "2026-08-11",
  },
  {
    id: "shenzhou-peninsula",
    name: "神州半岛海岸与灯塔段",
    shortName: "神州半岛",
    city: "万宁",
    category: "viewpoint",
    coordinates: { lat: 18.6779739, lng: 110.3479262 },
    why: "离住宿基地很近，用一段傍晚慢走替代跨湾追日落。",
    activity: {
      time: "16:30–18:20",
      duration: "约 1 小时 50 分",
      steps: ["从酒店附近公共海岸开始", "根据现场接驳规则决定是否向灯塔方向走", "日落前回到开阔海岸"],
      practical: ["先向酒店确认观光车与开放情况", "不摸黑走封闭支路"],
      weather: "云厚可保留散步，雷雨则直接回酒店。",
      source: { platform: "小红书", author: "卷卷心", title: "来了万宁才知道，之前看的攻略有多离谱", url: xhsWanningReality },
    },
    image: xhsPhoto("/hainan/shenzhou-peninsula-xhs.webp", "万宁神州半岛海岸与灯塔方向", "卷卷心", xhsWanningReality, "来了万宁才知道，之前看的攻略有多离谱"),
    sourceUrl: "https://www.openstreetmap.org/way/281774543",
    verifiedAt: "2026-08-11",
  },
  {
    id: "clearwater-indigo",
    name: "海南清水湾英迪格酒店",
    shortName: "清水湾英迪格",
    city: "陵水",
    category: "stay",
    coordinates: { lat: 18.4038, lng: 109.8628 },
    why: "把陵水基地移到清水湾，既保留海景，又避免从土福湾往返新村港的长距离折返。",
    hotelId: "clearwater-indigo",
    activity: {
      time: "Day 4–5",
      duration: "连住 2 晚",
      steps: ["Day 4 从新村港顺路入住", "进房核对海景遮挡和阳台", "Day 5 只在清水湾酒店与海岸活动"],
      practical: ["预订时写明真海景房而非侧海景", "比较同区域假日酒店的可退价"],
      weather: "风雨天留在酒店，暂停乘船和下海。",
      source: { platform: "官网", author: "IHG", title: "海南清水湾英迪格酒店", url: indigoOfficial },
    },
    image: officialPhoto("/hainan/clearwater-indigo-official.webp", "海南清水湾英迪格酒店海岸建筑与泳池", "IHG 官方", indigoOfficial, "海南清水湾英迪格酒店"),
    sourceUrl: indigoOfficial,
    verifiedAt: "2026-08-11",
  },
  {
    id: "clearwater-coast",
    name: "清水湾酒店海岸",
    shortName: "清水湾海岸",
    city: "陵水",
    category: "coast",
    coordinates: { lat: 18.3978, lng: 109.8686 },
    why: "住下后把一天留给海岸、泳池和午休，不再为打卡开长途车。",
    activity: {
      time: "睡醒后自由安排",
      duration: "半日到完整一天",
      steps: ["08:00 前后沿酒店公共海岸慢走并拍一组晨光照片", "11:30 前回房冲凉、午饭和完整午休", "16:30 后再去泳池或海岸", "日落后回酒店安静吃饭，不加夜间打卡"],
      practical: ["红旗时不下海", "住客通道与公共海岸边界以现场为准"],
      weather: "大浪不下海，改酒店公区、下午茶或泳池。",
      source: { platform: "小红书", author: "清水湾实住笔记合集", title: "清水湾海景酒店与海岸实拍", url: "https://www.xiaohongshu.com/search_result?keyword=%E6%B8%85%E6%B0%B4%E6%B9%BE%E6%B5%B7%E6%99%AF%E9%85%92%E5%BA%97" },
    },
    image: xhsPhoto("/hainan/raffles-hainan-xhs.webp", "陵水清水湾安静海岸与热带园林", "清水湾实住笔记合集", "https://www.xiaohongshu.com/search_result?keyword=%E6%B8%85%E6%B0%B4%E6%B9%BE%E6%B5%B7%E6%99%AF%E9%85%92%E5%BA%97", "清水湾海景酒店与海岸实拍"),
    sourceUrl: "https://www.hnqingshuiwan.com/",
    verifiedAt: "2026-08-11",
  },
  {
    id: "cdf-sanya",
    name: "cdf 三亚国际免税城",
    shortName: "三亚免税城",
    city: "三亚",
    category: "culture",
    coordinates: { lat: 18.3548, lng: 109.7487 },
    why: "这是可选采购窗口，不是旅行高潮；有明确购买清单才去，否则把整天留给陵水海岸。",
    activity: {
      time: "14:30–18:30",
      duration: "约 4 小时",
      steps: ["先决定是否真的需要采购；没有清单就不出发", "出发前在中免 App 核对营业和库存", "证件、离岛航班信息一次带齐", "按清单完成后离开，不把逛店拖成整晚"],
      practical: ["营业时间与提货时限以出发周官方信息为准", "预留机场提货和托运行李时间"],
      weather: "雨天可以执行，但仍只是备选采购窗口。",
      source: { platform: "官网", author: "中国旅游集团中免", title: "三亚国际免税城", url: cdfOfficial },
    },
    image: officialPhoto("/hainan/cdf-sanya-official.webp", "三亚国际免税城建筑夜景", "Wikimedia Commons · 钉钉 · CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:%E4%B8%89%E4%BA%9A%E5%9B%BD%E9%99%85%E5%85%8D%E7%A8%8E%E5%9F%8E.jpg", "三亚国际免税城"),
    sourceUrl: cdfOfficial,
    verifiedAt: "2026-08-11",
  },
  {
    id: "sangem-moon",
    name: "海南三正月酒店",
    shortName: "三正月",
    city: "陵水",
    category: "stay",
    coordinates: { lat: 18.4031364, lng: 109.8064448 },
    why: "三晚主要海景基地；优先高楼层海景大床、独立阳台和双早。",
    hotelId: "sangem-moon",
    activity: {
      time: "Day 2–4",
      duration: "连住 3 晚",
      steps: ["办理入住时核对海景朝向和楼层", "进房先从阳台确认遮挡", "每天只安排一个半日活动"],
      practical: ["拒绝用池景或景观房替代海景房", "要求远离儿童活动层和电梯"],
      weather: "台风或大浪时取消离店活动，使用室内设施。",
      source: { platform: "官网", author: "海南三正月酒店", title: "海南三正月酒店官网", url: sangemOfficial },
    },
    image: officialPhoto("/hainan/sangem-moon-official.webp", "海南三正月酒店、土福湾海岸与蓝调全景", "海南三正月酒店", sangemOfficial, "海南三正月酒店土福湾全景"),
    gallery: [xhsPhoto("/hainan/sangem-moon-xhs.webp", "海南三正月酒店蓝调时刻建筑外景", "肥欧OOOOOO", xhsSangem, "海南酒店攻略——陵水三正月，值得二刷")],
    sourceUrl: sangemOfficial,
    verifiedAt: "2026-08-11",
  },
  {
    id: "xincun-port",
    name: "陵水新村港旅游码头",
    shortName: "新村港",
    city: "陵水",
    category: "harbor",
    coordinates: { lat: 18.41519, lng: 109.997 },
    why: "用一个半日看疍家渔排、港口船流与水上生活，不再叠加猴岛和另一座海岛。",
    activity: {
      time: "09:30–13:30",
      duration: "约 4 小时含午饭",
      steps: ["09:30 到正规旅游码头确认当天船班与明码价格", "先在码头观察渔船、渔排和生活物资往来", "海况允许才乘正规客船看疍家渔排", "回到新村镇吃明码标价午饭后继续南下"],
      practical: ["不乘无证揽客船，也不接受临时加价项目", "不对居民近距离拍摄，拍人前先征得同意"],
      weather: "大风、雷雨或停航时取消乘船；持续降雨则直接去清水湾办理入住。",
      source: { platform: "官网", author: "海南省人民政府", title: "新村港疍家渔排与海上社区", url: xincunOfficial },
    },
    image: xhsPhoto("/hainan/xincun-port-xhs.webp", "新村港海面上的疍家渔排、船只与远山", "金属滚儿", xhsXincun, "海陆之间：陵水新村的疍家文明与生命脉动"),
    gallery: [
      mediaPhoto("/hainan/xincun-port-thepaper.webp", "陵水新村港成片疍家渔排与往来船只俯拍", "澎湃新闻 · 海南日报客户端", xincunThePaper, "新村港渔排航拍"),
      mediaPhoto("/hainan/xincun-port-cgtn.webp", "夕阳映照下的新村港疍家渔排与船迹", "CGTN", xincunCgtn, "新村港海上社区夕照"),
    ],
    sourceUrl: "https://www.amap.com/search?query=%E9%99%B5%E6%B0%B4%E6%96%B0%E6%9D%91%E6%B8%AF",
    verifiedAt: "2026-08-11",
  },
  {
    id: "sangem-beach",
    name: "三正月酒店海岸与空中泳池",
    shortName: "土福湾海岸",
    city: "陵水",
    category: "coast",
    coordinates: { lat: 18.3999, lng: 109.8078 },
    why: "把一天真正留给房间海景、海滩和泳池，不为地图动画制造奔波。",
    activity: {
      time: "睡醒后自由安排",
      duration: "完整一天",
      steps: ["早餐后先走酒店海岸", "中午回房间避晒", "傍晚根据开放时间使用空中泳池"],
      practical: ["下水前看救生旗和酒店通知", "水上项目只在有资质运营方开放时参加"],
      weather: "红旗、大浪或雷电时不下海，改为室内泳池和房间休息。",
      source: { platform: "官网", author: "海南三正月酒店", title: "酒店海岸与双空中泳池", url: sangemOfficial },
    },
    image: officialPhoto("/hainan/sangem-beach-official.webp", "三正月酒店土福湾海岸与泳池", "海南三正月酒店", sangemOfficial, "酒店海岸与双空中泳池"),
    sourceUrl: sangemOfficial,
    verifiedAt: "2026-08-11",
  },
  {
    id: "xiaodonghai",
    name: "三亚小东海",
    shortName: "小东海",
    city: "三亚",
    category: "coast",
    coordinates: { lat: 18.2061567, lng: 109.4999353 },
    why: "比热门公共浴场更安静，用来完成一段上午海岸慢走。",
    activity: {
      time: "10:30–12:30",
      duration: "约 2 小时",
      steps: ["从公共入口进入海岸", "沿安全步道慢走", "在阴凉处休息后再前往帆船港"],
      practical: ["不借私人酒店通道", "不在无救生区域下水"],
      weather: "大浪、红旗或雷雨时只走安全步道。",
      source: { platform: "官网", author: "生态环境部", title: "美丽海湾优秀案例：三亚小东海", url: "https://www.mee.gov.cn/home/ztbd/2021/mlhwyxalzjhd/algs/hns2/202109/t20210906_900104.shtml" },
    },
    image: officialPhoto("/hainan/xiaodonghai-official.webp", "三亚小东海安静海湾与海岸", "生态环境部", "https://www.mee.gov.cn/home/ztbd/2021/mlhwyxalzjhd/algs/hns2/202109/t20210906_900104.shtml", "美丽海湾优秀案例：三亚小东海"),
    sourceUrl: "https://www.openstreetmap.org/node/2190228660",
    verifiedAt: "2026-08-11",
  },
  {
    id: "banshan-marina",
    name: "三亚半山半岛帆船港",
    shortName: "帆船港",
    city: "三亚",
    category: "harbor",
    coordinates: { lat: 18.2108, lng: 109.4818 },
    why: "在城市海岸线中安排咖啡、帆船和安静休息，不以拍照机位为目标。",
    activity: {
      time: "14:00–16:00",
      duration: "约 2 小时",
      steps: ["沿公共港区慢走看帆船", "找一处有空调的咖啡店休息", "日落前再去鹿回头"],
      practical: ["不进入封闭码头作业区", "停车使用正式停车场"],
      weather: "雷雨时缩短为室内休息，取消港边长走。",
      source: { platform: "官网", author: "三亚旅游推广局", title: "三亚半山半岛帆船港", url: "https://www.visitsanya.com/zh/venue/%E4%B8%89%E4%BA%9A%E5%8D%8A%E5%B1%B1%E5%8D%8A%E5%B2%9B%E5%B8%86%E8%88%B9%E6%B8%AF?language=chinese_traditional" },
    },
    image: officialPhoto("/hainan/banshan-marina-official.webp", "三亚半山半岛帆船港帆船与海岸", "三亚旅游推广局", "https://www.visitsanya.com/zh/venue/%E4%B8%89%E4%BA%9A%E5%8D%8A%E5%B1%B1%E5%8D%8A%E5%B2%9B%E5%B8%86%E8%88%B9%E6%B8%AF?language=chinese_traditional", "三亚半山半岛帆船港"),
    sourceUrl: "https://www.amap.com/search?query=%E5%8D%8A%E5%B1%B1%E5%8D%8A%E5%B2%9B%E5%B8%86%E8%88%B9%E6%B8%AF",
    verifiedAt: "2026-08-11",
  },
  {
    id: "luhuitou",
    name: "三亚鹿回头风景区",
    shortName: "鹿回头",
    city: "三亚",
    category: "viewpoint",
    coordinates: { lat: 18.2272, lng: 109.4963 },
    why: "在同一片城市海岸结束一天，用高处视角看三亚湾与港口日落。",
    activity: {
      time: "16:30–18:45",
      duration: "约 2 小时",
      steps: ["先确认末班观光车时间", "日落前到开阔观景处", "天黑后按原路返回停车区"],
      practical: ["带水并穿防滑鞋", "不在雷雨时停留高处"],
      weather: "雷电、大风或低能见度时取消登高。",
      source: { platform: "官网", author: "三亚旅游推广局", title: "鹿回头风景区", url: "https://www.visitsanya.com/zh/destination/%E9%B9%BF%E5%9B%9E%E5%A4%B4%E9%A3%8E%E6%99%AF%E5%8C%BA" },
    },
    image: xhsPhoto("/hainan/luhuitou-xhs.webp", "鹿回头高处看到的三亚城市与游艇港湾", "橙子", xhsLuhuitou, "三亚📍鹿回头🦌"),
    sourceUrl: "https://www.openstreetmap.org/node/4547719591",
    verifiedAt: "2026-08-11",
  },
  {
    id: "sanya-airport",
    name: "三亚凤凰国际机场",
    shortName: "三亚凤凰",
    city: "三亚",
    category: "transport",
    coordinates: { lat: 18.3051519, lng: 109.4125351 },
    why: "异地还车后从海南南端离岛，不折返海口。",
    activity: {
      time: "起飞前约 3 小时到达机场区域",
      duration: "还车与登机缓冲",
      steps: ["按租车订单导航到指定还车点", "验车并保存油量和交接单照片", "乘正式接驳进航站楼办理托运"],
      practical: ["还车点不一定等于航站楼", "免税提货和托运行李分别留时间"],
      weather: "台风季提前 72 小时和 24 小时复核航班。",
      source: mapSource("三亚凤凰国际机场", "https://www.openstreetmap.org/way/32079751"),
    },
    sourceUrl: "https://www.openstreetmap.org/way/32079751",
    verifiedAt: "2026-08-11",
  },
];

const planAHotels: Hotel[] = [
  {
    id: "hongyuan-crest",
    name: "海口鸿园酒店公寓·雅诗阁臻选",
    shortName: "江东新区新开设计基地",
    city: "海口",
    checkInDay: 1,
    nights: "Day 1 · 住 1 晚",
    opened: 2024,
    fit: "江东新区、设计感、可选海景且比市中心安静；从机场到酒店不横穿海口。",
    reasons: ["2024 年开业，是雅诗阁臻选品牌在中国的首家项目", "服务式公寓房型适合落地后整理行李和安静休息"],
    cautions: ["周边餐饮选择少于市中心，首晚建议酒店内解决", "海景开间与普通房差异要在付款前看清"],
    image: officialPhoto("/hainan/hongyuan-crest-lobby-official.webp", "海口鸿园酒店公寓雅诗阁臻选大堂", "雅诗阁官方", hongyuanOfficial, "海口鸿园雅诗阁臻选大堂"),
    gallery: [
      officialPhoto("/hainan/hongyuan-crest-seaview-official.webp", "海口鸿园酒店公寓海景客厅", "雅诗阁官方", hongyuanOfficial, "海景公寓客厅"),
      officialPhoto("/hainan/hongyuan-crest-pool-official.webp", "海口鸿园酒店公寓泳池", "雅诗阁官方", hongyuanOfficial, "酒店泳池"),
    ],
    officialUrl: hongyuanOfficial,
    xhsSource: { author: "小红书海口新酒店合集", title: "海口鸿园雅诗阁臻选房型与公区", url: xhsHongyuan },
  },
  {
    id: "yuyue-artia",
    name: "万宁日月湾中旅逐浪屿玥酒店",
    shortName: "日月湾新开冲浪度假基地",
    city: "万宁",
    checkInDay: 2,
    nights: "Day 2–3 · 连住 2 晚",
    opened: 2025,
    fit: "日月湾、海景与冲浪度假氛围兼具；住两晚后再短线去石梅湾和兴隆。",
    reasons: ["2025 年新开，酒店和逐浪度假区的视觉风格更年轻", "离日月湾海岸近，Day 2 抵达后无需再次开车"],
    cautions: ["开业时间短，近期服务评价的参考样本仍有限", "靠近高铁线，睡眠敏感者要备注安静朝向"],
    image: ctripPhoto("/hainan/yuyue-artia-aerial-ctrip.webp", "万宁日月湾中旅逐浪屿玥酒店与冲浪池航拍", "携程酒店公开页", yuyueCtrip, "逐浪屿玥酒店与日月湾"),
    gallery: [
      ctripPhoto("/hainan/yuyue-artia-room-ctrip.webp", "万宁日月湾中旅逐浪屿玥酒店客房", "携程酒店公开页", yuyueCtrip, "逐浪屿玥酒店客房"),
      ctripPhoto("/hainan/yuyue-artia-restaurant-ctrip.webp", "万宁日月湾中旅逐浪屿玥酒店餐厅", "携程酒店公开页", yuyueCtrip, "逐浪屿玥酒店餐厅"),
    ],
    officialUrl: yuyueOfficial,
    xhsSource: { author: "小红书日月湾新酒店合集", title: "中旅逐浪屿玥酒店实住与日月湾度假区", url: xhsYuyue },
  },
  {
    id: "kimpton-clearwater",
    name: "海南清水湾金普顿酒店",
    shortName: "清水湾新开设计度假基地",
    city: "陵水",
    checkInDay: 4,
    nights: "Day 4–6 · 连住 3 晚",
    opened: 2025,
    fit: "新村港结束后顺路住进清水湾，连续三晚享受设计公区、海景和完整留白日。",
    reasons: ["2025 年新开，是中国首家海岛金普顿度假酒店", "连续三晚覆盖陵水慢住与免税城往返，不再增加第四家酒店"],
    cautions: ["热门新酒店周末公区可能比三正月热闹", "正海景房须核对楼层、朝向和遮挡"],
    image: officialPhoto("/hainan/kimpton-clearwater-exterior-official.webp", "海南清水湾金普顿酒店园林与水景外观", "IHG 金普顿官方", kimptonOfficial, "清水湾金普顿外观"),
    gallery: [
      officialPhoto("/hainan/kimpton-clearwater-lounge-official.webp", "海南清水湾金普顿酒店设计休息厅", "IHG 金普顿官方", kimptonOfficial, "清水湾金普顿休息厅"),
      officialPhoto("/hainan/kimpton-clearwater-waterdeck-official.webp", "海南清水湾金普顿酒店水上休闲平台", "IHG 金普顿官方", kimptonOfficial, "清水湾金普顿水景平台"),
    ],
    officialUrl: kimptonOfficial,
    xhsSource: { author: "小红书清水湾新酒店合集", title: "清水湾金普顿设计、公区与房型实住", url: xhsKimpton },
  },
];

const planBHotels: Hotel[] = [
  {
    id: "haikou-marriott",
    name: "海口万豪酒店",
    shortName: "西海岸成熟海景基地",
    city: "海口",
    checkInDay: 1,
    nights: "Day 1 · 住 1 晚",
    opened: 2014,
    fit: "西海岸、海景与成熟服务兼顾；首晚远离市中心，次日直接南下。",
    reasons: ["西海岸度假配套和服务流程成熟", "海景阳台、园林和泳池适合落地缓冲"],
    cautions: ["楼龄不是 Plan A 的新酒店路线", "机场到西海岸约 50–70 分钟，晚航班直接入住"],
    image: officialPhoto("/hainan/haikou-marriott-pool-official.webp", "海口万豪酒店临海热带园林与泳池", "Marriott 官方", haikouMarriottOfficial, "海口万豪酒店室外泳池"),
    officialUrl: haikouMarriottOfficial,
    xhsSource: { author: "海口西海岸实住合集", title: "海口西海岸海景酒店实住与房型", url: xhsHaikouWestCoast },
  },
  {
    id: "grand-hyatt-wanning",
    name: "万宁神州半岛君悦酒店",
    shortName: "神州半岛成熟安静基地",
    city: "万宁",
    checkInDay: 2,
    nights: "Day 2–3 · 连住 2 晚",
    opened: 2022,
    fit: "海景与安静兼顾，服务比新开酒店更稳定；石梅湾和兴隆都能短线往返。",
    reasons: ["酒店海岸相对独立", "两晚连住能把万宁真正住下来"],
    cautions: ["真海景房需确认朝向与遮挡", "预算高于普通度假酒店"],
    image: officialPhoto("/hainan/grand-hyatt-wanning-pool-official.webp", "万宁神州半岛君悦临海泳池与热带花园", "Hyatt 官方", wanningHyattOfficial, "万宁神州半岛君悦室外泳池"),
    officialUrl: wanningHyattOfficial,
    xhsSource: { author: "熠民", title: "万宁 staycation｜神州半岛君悦真实入住测评", url: xhsWanningHyatt },
  },
  {
    id: "sangem-moon",
    name: "海南三正月酒店",
    shortName: "陵水土福湾安静基地",
    city: "陵水",
    checkInDay: 4,
    nights: "Day 4–6 · 连住 3 晚",
    opened: 2025,
    fit: "Plan B 不去新村港，直接在土福湾住三晚，用海景房、海岸与泳池替代奔波。",
    reasons: ["官方定位为土福湾热带海岸秘境", "连续三晚后 Day 6 往返免税城也无需搬行李"],
    cautions: ["不适合再折返新村港，Plan B 已彻底删除该点", "真海景仍要确认楼层、朝向与遮挡"],
    image: officialPhoto("/hainan/sangem-moon-official.webp", "海南三正月酒店、土福湾海岸与蓝调全景", "海南三正月酒店", sangemOfficial, "海南三正月酒店土福湾全景"),
    officialUrl: sangemOfficial,
    xhsSource: { author: "肥欧OOOOOO", title: "海南酒店攻略——陵水三正月，值得二刷", url: xhsSangem },
  },
];

export const hotels: Hotel[] = planAHotels;

const leg = (fromIndex: number, toIndex: number, mode: TravelLegMode, durationLabel: string, fallback: string, distanceLabel?: string, timingNote?: string): RouteLeg => ({
  fromIndex,
  toIndex,
  mode,
  durationLabel,
  distanceLabel,
  timingNote,
  fallback,
});

const planASchedule: Day[] = [
  {
    id: 1,
    city: "海口",
    title: "武汉 → 海口",
    dateLabel: "9 月 12 日 · 抵达日",
    pace: "落地缓冲",
    summary: "抵达后直接去江东新区的新酒店入住；时间和天气允许，只在酒店附近海岸走一小段，不进市中心。",
    placeIds: ["wuhan-airport", "haikou-airport", "hongyuan-crest", "jiangdong-coast", "hongyuan-crest"],
    legs: [
      leg(0, 1, "flight", "约 2 小时 30 分", "航班晚点时删除骑楼。", undefined, "以最终航班为准"),
      leg(1, 2, "drive", "约 20–30 分钟", "暴雨时先在机场等待。", "约 16 km"),
      leg(2, 3, "walk", "约 5–10 分钟", "晚点时留在酒店吃饭。", "江东海岸段"),
      leg(3, 4, "walk", "约 5–10 分钟", "雷雨时直接返回。", "江东海岸段"),
    ],
    distanceLabel: "岛内约 16 km",
    driveLabel: "约 20–30 分钟＋海岸步行",
    sleep: "海口鸿园酒店公寓·雅诗阁臻选",
    meals: ["机场轻食", "酒店海南菜或客房简餐"],
    weatherPlan: "晚点或暴雨直接入住，不再进市中心。",
  },
  {
    id: 2,
    city: "万宁",
    title: "海口江东 → 万宁日月湾",
    dateLabel: "9 月 13 日 · 换宿日",
    pace: "第一次换宿",
    summary: "慢早餐后沿东线南下，真正住进日月湾两晚；下午只留酒店附近海岸和日落。",
    placeIds: ["hongyuan-crest", "yuyue-artia", "riyue-bay-coast", "yuyue-artia"],
    legs: [
      leg(0, 1, "drive", "约 2 小时 15 分–2 小时 35 分", "暴雨时增加服务区休息，抵达后直接入住。", "约 182 km", "服务区休息另计"),
      leg(1, 2, "walk", "约 5–10 分钟", "雷雨时留在酒店。", "日月湾海岸段"),
      leg(2, 3, "walk", "约 5–10 分钟", "天黑前返回。", "日月湾海岸段"),
    ],
    distanceLabel: "跨城约 182 km",
    driveLabel: "约 2.2–2.6 h",
    sleep: "万宁日月湾中旅逐浪屿玥酒店",
    meals: ["海口慢早餐", "服务区轻食", "神州半岛晚饭"],
    weatherPlan: "天气差直接入住，删除日落散步，不把万宁压缩成路过。",
    isHotelChange: true,
  },
  {
    id: 3,
    city: "万宁",
    title: "万宁慢海岸与兴隆老味",
    dateLabel: "9 月 14 日 · 万宁基地",
    pace: "短线慢游",
    summary: "石梅湾青皮林、海边书屋慢走，兴隆吃午饭，傍晚回日月湾；不追网红咖啡店。",
    placeIds: ["yuyue-artia", "shimei-bay", "xinglong-market", "yuyue-artia"],
    legs: [
      leg(0, 1, "drive", "约 25–35 分钟", "雷雨时删除海岸。", "约 24 km"),
      leg(1, 2, "drive", "约 20–30 分钟", "雨大时直接去兴隆吃午饭。", "约 15 km"),
      leg(2, 3, "drive", "约 20–30 分钟", "高温或积水时提早回酒店。", "约 18 km"),
    ],
    distanceLabel: "约 57 km 小环线",
    driveLabel: "约 1.1–1.6 h，分三段",
    sleep: "万宁日月湾中旅逐浪屿玥酒店",
    meals: ["酒店早餐", "兴隆后安粉或南洋小吃", "神州半岛晚饭"],
    weatherPlan: "Plan B 删除石梅湾，只保留酒店＋兴隆市场；大雨则全天酒店。",
  },
  {
    id: 4,
    city: "陵水",
    title: "万宁 → 新村港 → 清水湾",
    dateLabel: "9 月 15 日 · 换宿日",
    pace: "第二次换宿",
    summary: "退房后一路向南，新村港只留一个半日，结束后顺路住进清水湾，不再往返土福湾。",
    placeIds: ["yuyue-artia", "xincun-port", "kimpton-clearwater"],
    legs: [
      leg(0, 1, "drive", "约 50–65 分钟", "大风停航时只在新村镇午饭。", "约 58 km"),
      leg(1, 2, "drive", "约 25–35 分钟", "暴雨时直接入住。", "约 27 km"),
    ],
    distanceLabel: "约 85 km 单向南下",
    driveLabel: "约 1.3–1.7 h，分两段",
    sleep: "海南清水湾金普顿酒店",
    meals: ["万宁酒店早餐", "新村镇明码标价午饭", "清水湾晚饭"],
    weatherPlan: "停航就不乘船；持续暴雨则跳过新村港，直接去清水湾。",
    isHotelChange: true,
  },
  {
    id: 5,
    city: "陵水",
    title: "清水湾海景留白日",
    dateLabel: "9 月 16 日 · 陵水基地",
    pace: "完整留白日",
    summary: "晨光海岸、完整午休和傍晚泳池组成一整天；不开长途车，也不补任何网红景点。",
    placeIds: ["kimpton-clearwater", "clearwater-coast", "kimpton-clearwater"],
    legs: [
      leg(0, 1, "walk", "步行约 5–10 分钟", "雷雨时留在室内。", "酒店海岸段"),
      leg(1, 2, "walk", "步行约 5–10 分钟", "高温时提前回房。", "酒店海岸段"),
    ],
    distanceLabel: "酒店与清水湾海岸",
    driveLabel: "不开长途车",
    sleep: "海南清水湾金普顿酒店",
    meals: ["海景早餐", "酒店或清水湾简餐", "安静晚饭"],
    weatherPlan: "红旗不下海；雨天执行酒店公区、午休和室内餐饮。",
  },
  {
    id: 6,
    city: "陵水",
    title: "清水湾自由日 · 可选免税",
    dateLabel: "9 月 17 日 · 陵水基地",
    pace: "可选采购窗口",
    summary: "有明确清单才午后往返免税城；不购物就完整留在清水湾，无论如何都不换酒店。",
    placeIds: ["kimpton-clearwater", "cdf-sanya", "kimpton-clearwater"],
    legs: [
      leg(0, 1, "drive", "约 25–35 分钟", "暴雨时推迟出发。", "约 25 km"),
      leg(1, 2, "drive", "约 25–35 分钟", "不购物则整天留在清水湾。", "约 25 km"),
    ],
    distanceLabel: "往返约 50 km",
    driveLabel: "单程约 25–35 分钟",
    sleep: "海南清水湾金普顿酒店",
    meals: ["清水湾早餐", "免税城内简餐", "回酒店安静晚饭"],
    weatherPlan: "雨天可选免税城，但仍先看是否有购买清单；营业、资格与提货时限出发周再核对。",
  },
  {
    id: 7,
    city: "三亚",
    title: "三亚 → 武汉",
    dateLabel: "9 月 18 日 · 返程日",
    pace: "还车离岛",
    summary: "从清水湾退房后直接去凤凰机场；预留跨区、还车和登机时间，不补景点。",
    placeIds: ["kimpton-clearwater", "sanya-airport", "wuhan-airport"],
    legs: [
      leg(0, 1, "drive", "约 50–65 分钟", "台风或道路积水时再提前出发。", "约 60 km", "还车时间另计"),
      leg(1, 2, "flight", "约 2 小时 30 分", "航班调整时同步联系航司与租车公司。", undefined, "以最终航班为准"),
    ],
    distanceLabel: "岛内约 60 km",
    driveLabel: "约 50–65 分钟＋航班",
    sleep: "回家",
    meals: ["酒店早餐", "机场简餐"],
    weatherPlan: "提前 72 小时和 24 小时复核航班与还车安排。",
  },
];

const planBSchedule: Day[] = [
  {
    id: 1,
    city: "海口",
    title: "武汉 → 海口西海岸",
    dateLabel: "9 月 12 日 · 抵达日",
    pace: "海景缓冲",
    summary: "落地后直接住海口万豪，避开市中心；只在雨停后走一小段西海岸。",
    placeIds: ["wuhan-airport", "haikou-airport", "haikou-marriott", "haikou-west-coast", "haikou-marriott"],
    legs: [
      leg(0, 1, "flight", "约 2 小时 30 分", "航班晚点时删除海岸。", undefined, "以最终航班为准"),
      leg(1, 2, "drive", "约 50–70 分钟", "暴雨时先在机场等待。", "约 42 km"),
      leg(2, 3, "walk", "约 10–15 分钟", "雨大时留在酒店。", "酒店周边"),
      leg(3, 4, "walk", "约 10–15 分钟", "天黑前返回。", "酒店周边"),
    ],
    distanceLabel: "岛内约 42 km",
    driveLabel: "约 50–70 分钟＋短步行",
    sleep: "海口万豪酒店",
    meals: ["机场轻食", "酒店餐厅或滨海简餐"],
    weatherPlan: "持续降雨就全天留在酒店，不进市区补点。",
  },
  {
    id: 2,
    city: "万宁",
    title: "海口西海岸 → 万宁神州半岛",
    dateLabel: "9 月 13 日 · 换宿日",
    pace: "第一次换宿",
    summary: "从西海岸直接南下，入住万宁神州半岛君悦；下午只熟悉酒店和海岸。",
    placeIds: ["haikou-marriott", "wanning-hyatt", "shenzhou-peninsula", "wanning-hyatt"],
    legs: [
      leg(0, 1, "drive", "约 2 小时 30 分–2 小时 50 分", "暴雨时增加服务区休息。", "约 185 km", "西海岸出发，服务区休息另计"),
      leg(1, 2, "walk", "约 10–20 分钟", "雷雨时留在酒店。", "半岛海岸段"),
      leg(2, 3, "walk", "约 10–20 分钟", "天黑前返回。", "半岛海岸段"),
    ],
    distanceLabel: "跨城约 185 km",
    driveLabel: "约 2.5–2.8 h",
    sleep: "万宁神州半岛君悦酒店",
    meals: ["西海岸早餐", "服务区轻食", "酒店海景餐厅"],
    weatherPlan: "天气差直接入住，不追日落。",
    isHotelChange: true,
  },
  {
    id: 3,
    city: "万宁",
    title: "兴隆植物与南洋老味",
    dateLabel: "9 月 14 日 · 万宁基地",
    pace: "林野短线",
    summary: "不去石梅湾：上午认识咖啡、可可和香草，按当天场次选品鉴或巧克力体验，午饭逛兴隆市场。",
    placeIds: ["wanning-hyatt", "xinglong-garden", "xinglong-market", "wanning-hyatt"],
    legs: [
      leg(0, 1, "drive", "约 30–40 分钟", "雷暴时直接取消植物园。", "约 23 km"),
      leg(1, 2, "drive", "约 5–10 分钟", "雨大时直接找室内午饭。", "约 3 km"),
      leg(2, 3, "drive", "约 30–40 分钟", "积水时提早回酒店。", "约 23 km"),
    ],
    distanceLabel: "约 49 km 小环线",
    driveLabel: "约 1.1–1.5 h，分三段",
    sleep: "万宁神州半岛君悦酒店",
    meals: ["酒店早餐", "兴隆后安粉与南洋糕点", "酒店晚饭"],
    weatherPlan: "小阵雨保留市场；雷暴则全天酒店。",
  },
  {
    id: 4,
    city: "陵水",
    title: "万宁 → 陵水土福湾",
    dateLabel: "9 月 15 日 · 换宿日",
    pace: "第二次换宿",
    summary: "彻底删除新村港和折返，退房后单向南下三正月酒店；下午只看房间海景与酒店公区。",
    placeIds: ["wanning-hyatt", "sangem-moon"],
    legs: [
      leg(0, 1, "drive", "约 1 小时–1 小时 20 分", "暴雨时服务区休息后再走。", "约 75 km"),
    ],
    distanceLabel: "约 75 km 单向南下",
    driveLabel: "约 1–1.3 h",
    sleep: "海南三正月酒店",
    meals: ["万宁酒店早餐", "高速服务区轻食", "土福湾酒店晚饭"],
    weatherPlan: "无论天气都不折返新村港，抵达后直接休息。",
    isHotelChange: true,
  },
  {
    id: 5,
    city: "陵水",
    title: "土福湾酒店与海岸日",
    dateLabel: "9 月 16 日 · 陵水基地",
    pace: "完整度假日",
    summary: "晨光海岸、完整午休、傍晚空中泳池和蓝调海景；不开长途车，也不去拥挤海岛。",
    placeIds: ["sangem-moon", "sangem-beach", "sangem-moon"],
    legs: [
      leg(0, 1, "walk", "约 5–10 分钟", "雷雨时留在室内。", "酒店海岸段"),
      leg(1, 2, "walk", "约 5–10 分钟", "红旗时不下海。", "酒店海岸段"),
    ],
    distanceLabel: "酒店与土福湾海岸",
    driveLabel: "不开长途车",
    sleep: "海南三正月酒店",
    meals: ["海景早餐", "酒店简餐", "土福湾安静晚饭"],
    weatherPlan: "风浪或雷电时使用室内设施，海岸只看不下水。",
  },
  {
    id: 6,
    city: "陵水",
    title: "土福湾自由日 · 可选免税",
    dateLabel: "9 月 17 日 · 陵水基地",
    pace: "可选采购窗口",
    summary: "有明确清单才短程去免税城；不购物就把第三天完整留给土福湾，仍住同一家酒店。",
    placeIds: ["sangem-moon", "cdf-sanya", "sangem-moon"],
    legs: [
      leg(0, 1, "drive", "约 20–30 分钟", "暴雨时延迟出发。", "约 15 km"),
      leg(1, 2, "drive", "约 20–30 分钟", "不购物则整天留在酒店。", "约 15 km"),
    ],
    distanceLabel: "往返约 30 km",
    driveLabel: "单程约 20–30 分钟",
    sleep: "海南三正月酒店",
    meals: ["三正月早餐", "免税城内简餐", "回酒店安静晚饭"],
    weatherPlan: "雨天优先免税城，营业与提货时限出发周复核。",
  },
  {
    id: 7,
    city: "三亚",
    title: "三亚 → 武汉",
    dateLabel: "9 月 18 日 · 返程日",
    pace: "还车离岛",
    summary: "从土福湾退房后直接去凤凰机场；Plan B 同样不在返程日补景点。",
    placeIds: ["sangem-moon", "sanya-airport", "wuhan-airport"],
    legs: [
      leg(0, 1, "drive", "约 45–60 分钟", "积水时再提前出发。", "约 48 km", "还车时间另计"),
      leg(1, 2, "flight", "约 2 小时 30 分", "航班调整时同步联系航司与租车公司。", undefined, "以最终航班为准"),
    ],
    distanceLabel: "岛内约 48 km",
    driveLabel: "约 45–60 分钟＋航班",
    sleep: "回家",
    meals: ["酒店早餐", "机场简餐"],
    weatherPlan: "提前 72 小时和 24 小时复核航班与还车安排。",
  },
];

export const days: Day[] = planASchedule;

const budgetA: BudgetEstimate = {
  target: 8000,
  period: "2026 年 9 月估算",
  disclaimer: "不含免税购物；机票、海景房型与异地还车费以付款页为准。",
  items: [
    { id: "flights", label: "往返机票", note: "武汉→海口、三亚→武汉", sharing: "per-person", range: { min: 1100, max: 1800 } },
    { id: "hotels", label: "6 晚酒店", note: "鸿园雅诗阁 1 晚＋逐浪屿玥 2 晚＋清水湾金普顿 3 晚", sharing: "shared", range: { min: 7800, max: 11500 } },
    { id: "car", label: "租车交通", note: "7 天租车、保险、异地还车、油费与停车", sharing: "shared", range: { min: 2200, max: 3200 } },
    { id: "food", label: "餐饮", note: "酒店早餐外的正餐与小吃", sharing: "per-person", range: { min: 1100, max: 1700 } },
    { id: "activities", label: "活动", note: "新村港与少量现场项目", sharing: "per-person", range: { min: 250, max: 500 } },
    { id: "buffer", label: "机动金", note: "天气、房型差价与临时接驳", sharing: "shared", range: { min: 500, max: 800 } },
  ],
};

const budgetB: BudgetEstimate = {
  target: 8000,
  period: "2026 年 9 月估算",
  disclaimer: "不含免税购物；机票、海景房型与异地还车费以付款页为准。",
  items: [
    { id: "flights", label: "往返机票", note: "武汉→海口、三亚→武汉", sharing: "per-person", range: { min: 1100, max: 1800 } },
    { id: "hotels", label: "6 晚酒店", note: "海口万豪 1 晚＋万宁君悦 2 晚＋三正月 3 晚", sharing: "shared", range: { min: 6200, max: 8800 } },
    { id: "car", label: "租车交通", note: "7 天租车、保险、异地还车、油费与停车", sharing: "shared", range: { min: 2200, max: 3200 } },
    { id: "food", label: "餐饮", note: "酒店早餐外的正餐与小吃", sharing: "per-person", range: { min: 1100, max: 1700 } },
    { id: "activities", label: "活动", note: "植物园与少量现场项目", sharing: "per-person", range: { min: 150, max: 350 } },
    { id: "buffer", label: "机动金", note: "天气、房型差价与临时接驳", sharing: "shared", range: { min: 500, max: 800 } },
  ],
};

export const itineraryPlans: ItineraryPlan[] = [
  {
    id: "A",
    name: "Plan A · 新开设计海岸线",
    tagline: "珊瑚新酒店线",
    description: "2024–2025 新酒店组合：江东新区、日月湾和清水湾三段连住，兼顾海景、设计感与不奔波。",
    color: "#e86f5c",
    schedule: planASchedule,
    hotels: planAHotels,
    budget: budgetA,
    routePath: "/routes/hainan-plan-a.geojson",
    days: [
      { dayId: 1, title: "江东新酒店落地缓冲", summary: "直接住江东新区，不进市中心；只在酒店附近海岸慢走。", highlights: ["2024 新开", "机场近", "不进老城区"], fallback: "航班晚点直接入住。" },
      { dayId: 2, title: "真正住进日月湾", summary: "海口南下万宁，午后入住逐浪屿玥，傍晚只走酒店附近海岸。", highlights: ["2025 新开", "日月湾连住", "不跨湾追日落"], fallback: "雨大就删除海岸。" },
      { dayId: 3, title: "万宁慢海岸", summary: "石梅湾青皮林、海边书屋与兴隆午饭，傍晚回日月湾。", highlights: ["青皮林海岸", "海边书屋", "万宁连住第 2 晚"], fallback: "海况差切换 Plan B。" },
      { dayId: 4, title: "顺路进入陵水", summary: "在正规码头看疍家渔排与港口船流，再一路向南入住清水湾。", highlights: ["不走回头路", "疍家渔排", "清水湾入住"], fallback: "停航跳过乘船。" },
      { dayId: 5, title: "清水湾完整留白", summary: "晨光海岸、完整午休和傍晚泳池，不开长途车。", highlights: ["晨光海岸", "傍晚泳池"], fallback: "红旗时不下海。" },
      { dayId: 6, title: "自由日 · 可选免税", summary: "有清单才往返免税城；不购物就继续留在清水湾。", highlights: ["采购可跳过", "不搬行李"], fallback: "不购物就留在清水湾。" },
      { dayId: 7, title: "从容返程", summary: "从清水湾直接去机场，预留跨区、还车、提货与登机时间。", highlights: ["不补景点", "预留还车时间"], fallback: "天气差提前出发。" },
    ],
  },
  {
    id: "B",
    name: "Plan B · 成熟稳妥海景线",
    tagline: "青绿安静线",
    description: "成熟服务组合：海口万豪、万宁君悦与土福湾三正月；用稳定度、安静海岸和酒店慢住换掉新开溢价。",
    color: "#277c78",
    schedule: planBSchedule,
    hotels: planBHotels,
    budget: budgetB,
    routePath: "/routes/hainan-plan-b.geojson",
    days: [
      { dayId: 1, title: "西海岸成熟海景", summary: "落地后直接住海口万豪，避开市中心和骑楼折返。", highlights: ["成熟度假服务", "西海岸", "不进市区"], fallback: "持续暴雨直接入住。" },
      { dayId: 2, title: "住进安静神州半岛", summary: "入住万宁神州半岛君悦，两晚不换房，把海岸和酒店时间留足。", highlights: ["万宁连住两晚", "神州半岛短散步"], fallback: "服务区增加休息。" },
      { dayId: 3, title: "兴隆林野与老味", summary: "认识咖啡、可可和香草，按场次选品鉴或巧克力体验，再去兴隆市场。", highlights: ["咖啡可可植物", "体验项目", "兴隆市场"], fallback: "雷暴全天酒店。" },
      { dayId: 4, title: "直接南下土福湾", summary: "彻底删除新村港，单向去三正月酒店，下午不再增加景点。", highlights: ["无折返", "换住三正月", "早入住"], fallback: "持续暴雨直达酒店。" },
      { dayId: 5, title: "土福湾酒店日", summary: "晨光海岸、完整午休、傍晚空中泳池与蓝调海景。", highlights: ["不开车", "蓝调泳池"], fallback: "红旗时不下海。" },
      { dayId: 6, title: "自由日 · 可选免税", summary: "有清单才短程去免税城；否则完整留在土福湾。", highlights: ["采购可跳过", "不搬行李"], fallback: "以中免当天营业通知为准。" },
      { dayId: 7, title: "保守返程", summary: "比晴天方案更早离店，预留积水、还车和机场提货时间。", highlights: ["不加景点", "航班动态复核"], fallback: "按航司通知调整。" },
    ],
  },
];

export function calculatePlanBudget(plan: ItineraryPlan, mode: TravelMode): CalculatedBudget {
  const travelers = mode === "duo" ? 2 : 1;
  const items = plan.budget.items.map((item) => {
    const multiplier = item.sharing === "per-person" ? travelers : 1;
    return {
      ...item,
      calculatedRange: {
        min: item.range.min * multiplier,
        max: item.range.max * multiplier,
      },
    };
  });
  const total = items.reduce<BudgetRange>((sum, item) => ({
    min: sum.min + item.calculatedRange.min,
    max: sum.max + item.calculatedRange.max,
  }), { min: 0, max: 0 });

  return {
    travelers,
    total,
    perPerson: { min: Math.round(total.min / travelers), max: Math.round(total.max / travelers) },
    overTarget: {
      min: Math.max(0, total.min - plan.budget.target),
      max: Math.max(0, total.max - plan.budget.target),
    },
    items,
  };
}

export function getDayRoute(dayId: number): Place[] {
  return getPlanDayRoute(days, dayId);
}

export function getPlanDayRoute(schedule: Day[], dayId: number): Place[] {
  const day = schedule.find((item) => item.id === dayId);
  if (!day) return [];
  return day.placeIds.map((placeId) => places.find((place) => place.id === placeId)).filter((place): place is Place => Boolean(place));
}

export function getHotel(hotelId?: string): Hotel | undefined {
  return getPlanHotel(hotels, hotelId);
}

export function getPlanHotel(planHotels: Hotel[], hotelId?: string): Hotel | undefined {
  return planHotels.find((hotel) => hotel.id === hotelId);
}
