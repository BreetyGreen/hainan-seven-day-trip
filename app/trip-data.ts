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
  platform: "小红书" | "官网";
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
  fit: string;
  reasons: string[];
  cautions: string[];
  image: PhotoSource;
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

export type ItineraryPlan = {
  id: "A" | "B";
  name: string;
  tagline: string;
  description: string;
  color: string;
  days: PlanDay[];
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

const xhsQilou = "https://www.xiaohongshu.com/search_result/6a689911000000000503abca";
const xhsXincun = "https://www.xiaohongshu.com/search_result/6a71b3a50000000021020fc8";
const xhsLuhuitou = "https://www.xiaohongshu.com/search_result/690489c200000000030373f2";
const xhsSangem = "https://www.xiaohongshu.com/search_result/68a893f3000000001c032dad";
const xhsSofitel = "https://www.xiaohongshu.com/search_result/69f853580000000038020c13";
const xhsWanningRoute = "https://www.xiaohongshu.com/search_result/6a2b733d000000000802544e";
const xhsWanningReality = "https://www.xiaohongshu.com/search_result/69abee14000000000e03ce43";
const xhsWanningHyatt = "https://www.xiaohongshu.com/search_result/6a33dac0000000002100add2";
const xhsWanningFood = "https://www.xiaohongshu.com/search_result?keyword=%E4%B8%87%E5%AE%81%E7%BA%AF%E5%9C%9F%E8%91%97%E5%BF%85%E5%90%8318%E5%AE%B6%E8%80%81%E5%BA%97";
const sangemOfficial = "https://www.sangemmoon.com/";
const sofitelOfficial = "https://all.accor.com/hotel/8167/index.zh.shtml";
const atourCtrip = "https://hotels.ctrip.com/hotels/120750482.html";
const wanningHyattOfficial = "https://www.hyatt.com/grand-hyatt/zh-CN/shhgh-grand-hyatt-shenzhou-peninsula";
const indigoOfficial = "https://www.ihg.com.cn/hotelindigo/hotels/cn/zh/lingshui/lqswb/hoteldetail";
const cdfOfficial = "https://www.ctgdutyfree.com.cn/detail/4340.html";

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
    image: xhsPhoto("/hainan/grand-hyatt-wanning-xhs.webp", "万宁神州半岛君悦热带公共区域与水景", "熠民", xhsWanningHyatt, "万宁 staycation｜神州半岛君悦真实入住测评"),
    sourceUrl: wanningHyattOfficial,
    verifiedAt: "2026-08-11",
  },
  {
    id: "shimei-bay",
    name: "万宁石梅湾",
    shortName: "石梅湾",
    city: "万宁",
    category: "coast",
    coordinates: { lat: 18.661922, lng: 110.27209 },
    why: "比日月湾更适合慢走，把海岸、午后休息和回酒店连成一条短线。",
    activity: {
      time: "09:30–11:30",
      duration: "约 2 小时",
      steps: ["从公共入口进入海岸", "沿安全水线慢走 30–40 分钟", "高温前离开去兴隆吃午饭"],
      practical: ["不借私人酒店通道", "红旗或大浪时不下水"],
      weather: "雷雨时删除此站，直接执行 Plan B。",
      source: { platform: "小红书", author: "逍遥", title: "万宁3天2晚旅行攻略｜头一次来这样玩不纠结", url: xhsWanningRoute },
    },
    image: xhsPhoto("/hainan/shimei-bay-xhs.webp", "万宁石梅湾安静海岸与椰林", "逍遥", xhsWanningRoute, "万宁3天2晚旅行攻略｜头一次来这样玩不纠结"),
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
      steps: ["早餐后沿酒店公共海岸慢走", "中午回房避晒", "傍晚按救生旗决定是否亲水"],
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
    why: "把采购集中在换宿日下午，离海棠湾酒店近，不额外占用返程日上午。",
    activity: {
      time: "14:30–18:30",
      duration: "约 4 小时",
      steps: ["出发前在中免 App 核对营业和库存", "证件、离岛航班信息一次带齐", "先完成清单品类再逛非必买区"],
      practical: ["营业时间与提货时限以出发周官方信息为准", "预留机场提货和托运行李时间"],
      weather: "雨天优先执行，是 Plan B 的主活动。",
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
    image: xhsPhoto("/hainan/sangem-moon-xhs.webp", "海南三正月酒店蓝调时刻建筑外景", "肥欧OOOOOO", xhsSangem, "海南酒店攻略——陵水三正月，值得二刷"),
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
    why: "用一个半日看疍家渔排与真实港口，不再叠加猴岛和另一座海岛。",
    activity: {
      time: "09:30–13:30",
      duration: "约 4 小时含午饭",
      steps: ["先在正规码头确认当天船班", "海况允许才乘客船看渔排", "回到新村镇吃明码标价午饭"],
      practical: ["不乘无证揽客船", "不对居民近距离拍摄"],
      weather: "大风、雷雨或停航时取消乘船，直接回酒店。",
      source: { platform: "小红书", author: "金属滚儿", title: "海陆之间：陵水新村的疍家文明与生命脉动", url: xhsXincun },
    },
    image: xhsPhoto("/hainan/xincun-port-xhs.webp", "新村港海面上的疍家渔排、船只与远山", "金属滚儿", xhsXincun, "海陆之间：陵水新村的疍家文明与生命脉动"),
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
    id: "sofitel-sanya",
    name: "三亚理文索菲特酒店",
    shortName: "海棠湾索菲特",
    city: "三亚",
    category: "stay",
    coordinates: { lat: 18.3329, lng: 109.7137 },
    why: "最后一晚靠近免税城收尾；次日直接去机场，不再横穿三亚市区。",
    hotelId: "sofitel-sanya",
    activity: {
      time: "Day 6",
      duration: "住 1 晚",
      steps: ["免税采购后办理入住", "先确认早餐与次日退房", "睡前复核还车点和航班"],
      practical: ["基础园景或池景也可接受", "不为海景房压缩返程机动金"],
      weather: "台风预警时缩短免税时间并提前复核航班。",
      source: { platform: "官网", author: "Accor", title: "三亚理文索菲特酒店", url: sofitelOfficial },
    },
    image: xhsPhoto("/hainan/sofitel-pool-xhs.webp", "三亚理文索菲特酒店泳池、椰林与海岸", "竹子动物园", xhsSofitel, "理文索菲特的公区给到一个夯"),
    sourceUrl: sofitelOfficial,
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

export const hotels: Hotel[] = [
  {
    id: "haikou-qilou-atour",
    name: "海口万国大都会骑楼亚朵酒店",
    shortName: "海口抵达缓冲",
    city: "海口",
    checkInDay: 1,
    nights: "Day 1 · 住 1 晚",
    fit: "位置和隔音优先，不为只睡一晚购买海景。",
    reasons: ["靠近骑楼老街", "第二天南下路线清楚"],
    cautions: ["不是度假酒店", "房间优先避开电梯与临街低楼层"],
    image: officialPhoto("/hainan/haikou-qilou-atour-official.webp", "海口骑楼亚朵酒店客房与公共区域", "携程酒店公开页", atourCtrip, "海口万国大都会骑楼亚朵酒店"),
    officialUrl: atourCtrip,
    xhsSource: { author: "携程公开页", title: "酒店图片与近期住客内容", url: atourCtrip },
  },
  {
    id: "grand-hyatt-wanning",
    name: "万宁神州半岛君悦酒店",
    shortName: "万宁安静海岸基地",
    city: "万宁",
    checkInDay: 2,
    nights: "Day 2–3 · 连住 2 晚",
    fit: "海景和安静兼顾；把万宁真正住下来，而不是匆匆路过。",
    reasons: ["酒店海岸相对独立", "石梅湾、兴隆与神州半岛都能当天短线往返"],
    cautions: ["真海景房需确认朝向与遮挡", "若差价明显可换同半岛假日度假酒店"],
    image: xhsPhoto("/hainan/grand-hyatt-wanning-xhs.webp", "万宁神州半岛君悦热带公共区域与水景", "熠民", xhsWanningHyatt, "万宁 staycation｜神州半岛君悦真实入住测评"),
    officialUrl: wanningHyattOfficial,
    xhsSource: { author: "熠民", title: "万宁 staycation｜神州半岛君悦真实入住测评", url: xhsWanningHyatt },
  },
  {
    id: "clearwater-indigo",
    name: "海南清水湾英迪格酒店",
    shortName: "陵水清水湾基地",
    city: "陵水",
    checkInDay: 4,
    nights: "Day 4–5 · 连住 2 晚",
    fit: "位置比土福湾更顺：新村港结束后一路向南入住，次日海景留白。",
    reasons: ["清水湾海岸氛围安静", "减少新村港往返和第二天跨区车程"],
    cautions: ["2025 年新开，服务稳定度看近期评价", "海景房须核对侧海景、楼层与遮挡"],
    image: officialPhoto("/hainan/clearwater-indigo-official.webp", "海南清水湾英迪格酒店海岸建筑与泳池", "IHG 官方", indigoOfficial, "海南清水湾英迪格酒店"),
    officialUrl: indigoOfficial,
    xhsSource: { author: "小红书清水湾实住合集", title: "清水湾海景酒店实住与房型对比", url: "https://www.xiaohongshu.com/search_result?keyword=%E6%B5%B7%E5%8D%97%E6%B8%85%E6%B0%B4%E6%B9%BE%E8%8B%B1%E8%BF%AA%E6%A0%BC%E9%85%92%E5%BA%97" },
  },
  {
    id: "sofitel-sanya",
    name: "三亚理文索菲特酒店",
    shortName: "三亚收尾基地",
    city: "三亚",
    checkInDay: 6,
    nights: "Day 6 · 住 1 晚",
    fit: "靠近三亚国际免税城与机场方向；最后一晚不再横穿市区。",
    reasons: ["距免税城约 5 km", "次日直接去凤凰机场，不补景点"],
    cautions: ["只住一晚不必为海景高价升级", "免税店营业与提货时限出发周再核对"],
    image: xhsPhoto("/hainan/sofitel-pool-xhs.webp", "三亚理文索菲特酒店泳池、椰林与海岸", "竹子动物园", xhsSofitel, "理文索菲特的公区给到一个夯"),
    officialUrl: sofitelOfficial,
    xhsSource: { author: "竹子动物园", title: "理文索菲特的公区给到一个夯", url: xhsSofitel },
  },
];

const leg = (fromIndex: number, toIndex: number, mode: TravelLegMode, durationLabel: string, fallback: string, distanceLabel?: string, timingNote?: string): RouteLeg => ({
  fromIndex,
  toIndex,
  mode,
  durationLabel,
  distanceLabel,
  timingNote,
  fallback,
});

export const days: Day[] = [
  {
    id: 1,
    city: "海口",
    title: "武汉 → 海口",
    dateLabel: "9 月 12 日 · 抵达日",
    pace: "落地缓冲",
    summary: "抵达后先入住；时间和天气允许才去骑楼慢走、吃一顿海南落地餐。",
    placeIds: ["wuhan-airport", "haikou-airport", "haikou-qilou-atour", "qilou", "haikou-qilou-atour"],
    legs: [
      leg(0, 1, "flight", "约 2 小时 30 分", "航班晚点时删除骑楼。", undefined, "以最终航班为准"),
      leg(1, 2, "drive", "约 30–45 分钟", "暴雨时先在机场等待。", "约 23 km"),
      leg(2, 3, "drive", "约 10–15 分钟", "晚点时留在酒店附近吃饭。", "约 4 km"),
      leg(3, 4, "drive", "约 10–15 分钟", "雨大时提前返回酒店。", "约 4 km"),
    ],
    distanceLabel: "岛内约 27 km",
    driveLabel: "岛内约 50–75 分钟",
    sleep: "海口万国大都会骑楼亚朵酒店",
    meals: ["骑楼粉面", "老爸茶或清补凉"],
    weatherPlan: "晚点或暴雨直接入住，不补赶骑楼。",
  },
  {
    id: 2,
    city: "万宁",
    title: "海口 → 万宁神州半岛",
    dateLabel: "9 月 13 日 · 换宿日",
    pace: "第一次换宿",
    summary: "慢早餐后约 2.5 小时南下，真正住进万宁两晚；下午只留酒店海岸和日落。",
    placeIds: ["haikou-qilou-atour", "wanning-hyatt", "shenzhou-peninsula", "wanning-hyatt"],
    legs: [
      leg(0, 1, "drive", "约 2 小时 20 分–2 小时 40 分", "暴雨时增加服务区休息，抵达后直接入住。", "约 170 km", "含海口出城；服务区休息另计"),
      leg(1, 2, "walk", "约 10–20 分钟", "雷雨时留在酒店。", "酒店海岸段"),
      leg(2, 3, "walk", "约 10–20 分钟", "天黑前返回。", "酒店海岸段"),
    ],
    distanceLabel: "跨城约 170 km",
    driveLabel: "约 2.3–2.7 h",
    sleep: "万宁神州半岛君悦酒店",
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
    summary: "石梅湾慢走、兴隆吃午饭，傍晚回神州半岛；不追日月湾网红咖啡店。",
    placeIds: ["wanning-hyatt", "shimei-bay", "xinglong-market", "wanning-hyatt"],
    legs: [
      leg(0, 1, "drive", "约 20–30 分钟", "雷雨时删除海岸。", "约 18 km"),
      leg(1, 2, "drive", "约 35–45 分钟", "雨大时直接去兴隆吃午饭。", "约 28 km"),
      leg(2, 3, "drive", "约 35–45 分钟", "高温或积水时提早回酒店。", "约 32 km"),
    ],
    distanceLabel: "约 78 km 小环线",
    driveLabel: "约 1.5–2 h，分三段",
    sleep: "万宁神州半岛君悦酒店",
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
    placeIds: ["wanning-hyatt", "xincun-port", "clearwater-indigo"],
    legs: [
      leg(0, 1, "drive", "约 1 小时–1 小时 15 分", "大风停航时只在新村镇午饭。", "约 66 km"),
      leg(1, 2, "drive", "约 35–45 分钟", "暴雨时直接入住。", "约 32 km"),
    ],
    distanceLabel: "约 98 km 单向南下",
    driveLabel: "约 1.6–2 h，分两段",
    sleep: "海南清水湾英迪格酒店",
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
    summary: "睡醒再决定海岸、泳池或下午茶；这一天不开长途车，也不补任何网红景点。",
    placeIds: ["clearwater-indigo", "clearwater-coast", "clearwater-indigo"],
    legs: [
      leg(0, 1, "walk", "步行约 5–10 分钟", "雷雨时留在室内。", "酒店海岸段"),
      leg(1, 2, "walk", "步行约 5–10 分钟", "高温时提前回房。", "酒店海岸段"),
    ],
    distanceLabel: "酒店与清水湾海岸",
    driveLabel: "不开长途车",
    sleep: "海南清水湾英迪格酒店",
    meals: ["海景早餐", "酒店或清水湾简餐", "安静晚饭"],
    weatherPlan: "红旗不下海；雨天执行酒店公区、午休和室内餐饮。",
  },
  {
    id: 6,
    city: "三亚",
    title: "清水湾 → 三亚免税城 → 海棠湾",
    dateLabel: "9 月 17 日 · 换宿日",
    pace: "第三次换宿",
    summary: "上午慢退房，约一小时到海棠湾；免税采购集中在下午，结束后 10–15 分钟入住。",
    placeIds: ["clearwater-indigo", "cdf-sanya", "sofitel-sanya"],
    legs: [
      leg(0, 1, "drive", "约 45–60 分钟", "暴雨时推迟退房后出发。", "约 45 km"),
      leg(1, 2, "drive", "约 10–15 分钟", "免税不买也可直接入住。", "约 5 km"),
    ],
    distanceLabel: "约 50 km 单向南下",
    driveLabel: "约 1–1.25 h，分两段",
    sleep: "三亚理文索菲特酒店",
    meals: ["清水湾早餐", "免税城内简餐", "索菲特或海棠湾晚饭"],
    weatherPlan: "雨天免税城优先；营业时间、购买资格与机场提货时限出发周再核对。",
    isHotelChange: true,
  },
  {
    id: 7,
    city: "三亚",
    title: "三亚 → 武汉",
    dateLabel: "9 月 18 日 · 返程日",
    pace: "还车离岛",
    summary: "早餐、退房、还车和登机，不用返程日上午补景点。",
    placeIds: ["sofitel-sanya", "sanya-airport", "wuhan-airport"],
    legs: [
      leg(0, 1, "drive", "约 45–60 分钟", "台风或道路积水时再提前出发。", "约 40 km", "还车时间另计"),
      leg(1, 2, "flight", "约 2 小时 30 分", "航班调整时同步联系航司与租车公司。", undefined, "以最终航班为准"),
    ],
    distanceLabel: "岛内约 40 km",
    driveLabel: "约 45–60 分钟＋航班",
    sleep: "回家",
    meals: ["酒店早餐", "机场简餐"],
    weatherPlan: "提前 72 小时和 24 小时复核航班与还车安排。",
  },
];

export const itineraryPlans: ItineraryPlan[] = [
  {
    id: "A",
    name: "Plan A · 晴天海岸慢游",
    tagline: "珊瑚日落线",
    description: "天气稳定时执行：万宁住两晚，以短距离海岸、兴隆老味和清水湾留白为主。",
    color: "#e86f5c",
    days: [
      { dayId: 1, title: "海口落地缓冲", summary: "入住后只走骑楼一段街区。", highlights: ["骑楼慢走", "老爸茶或海南粉"], fallback: "航班晚点直接入住。" },
      { dayId: 2, title: "真正住进万宁", summary: "海口南下万宁，午后入住神州半岛，傍晚只走酒店海岸。", highlights: ["跨城约 2.5 小时", "神州半岛日落"], fallback: "雨大就删除海岸。" },
      { dayId: 3, title: "万宁慢海岸", summary: "石梅湾慢走、兴隆午饭，再回神州半岛；不追网红咖啡店。", highlights: ["石梅湾", "兴隆市场", "万宁连住第 2 晚"], fallback: "海况差切换 Plan B。" },
      { dayId: 4, title: "顺路进入陵水", summary: "万宁退房后去新村港，结束后一路向南入住清水湾。", highlights: ["不走回头路", "新村港半日", "清水湾入住"], fallback: "停航跳过乘船。" },
      { dayId: 5, title: "清水湾完整留白", summary: "海景早餐、海岸、泳池和午休，不开长途车。", highlights: ["清水湾海岸", "酒店慢度假"], fallback: "红旗时不下海。" },
      { dayId: 6, title: "免税与海棠湾", summary: "午后集中逛免税城，再去约 5 km 外的索菲特住一晚。", highlights: ["免税城 4 小时", "最后一次换宿"], fallback: "不购物可直接入住。" },
      { dayId: 7, title: "从容返程", summary: "早餐、退房、还车、机场提货与登机。", highlights: ["不补景点", "预留还车时间"], fallback: "天气差提前出发。" },
    ],
  },
  {
    id: "B",
    name: "Plan B · 雨天酒店与免税",
    tagline: "青绿避雨线",
    description: "阵雨、海况差或只想更安静时执行：酒店内容优先，减少海岸停留，把室内采购集中安排。",
    color: "#277c78",
    days: [
      { dayId: 1, title: "海口轻量落地", summary: "骑楼只在雨停后短走，晚点就留在酒店附近吃。", highlights: ["不补赶", "室内老爸茶"], fallback: "持续暴雨直接入住。" },
      { dayId: 2, title: "万宁酒店先行", summary: "海口南下万宁，入住后体验酒店公区和房间海景。", highlights: ["万宁住两晚", "不追日落"], fallback: "服务区增加休息。" },
      { dayId: 3, title: "雨天万宁", summary: "上午留在酒店；雨势减弱再去兴隆市场吃午饭，不跑石梅湾。", highlights: ["酒店慢度假", "兴隆老味", "雨天短距离"], fallback: "大雨全天酒店。" },
      { dayId: 4, title: "直接南下清水湾", summary: "风浪大就跳过新村港乘船，只吃一顿午饭后入住清水湾。", highlights: ["不坐无证船", "早入住"], fallback: "持续暴雨直达酒店。" },
      { dayId: 5, title: "清水湾酒店日", summary: "酒店早餐、室内公区、午休与晚饭，海岸只在安全时短走。", highlights: ["不开车", "室内设施"], fallback: "不下海。" },
      { dayId: 6, title: "雨天免税主场", summary: "清水湾退房后直接去三亚免税城，集中完成清单，再入住索菲特。", highlights: ["免税室内 4–5 小时", "海棠湾短接驳"], fallback: "以中免当天营业通知为准。" },
      { dayId: 7, title: "保守返程", summary: "比晴天方案更早离店，预留积水、还车和机场提货时间。", highlights: ["不加景点", "航班动态复核"], fallback: "按航司通知调整。" },
    ],
  },
];

export function getDayRoute(dayId: number): Place[] {
  const day = days.find((item) => item.id === dayId);
  if (!day) return [];
  return day.placeIds.map((placeId) => places.find((place) => place.id === placeId)).filter((place): place is Place => Boolean(place));
}

export function getHotel(hotelId?: string): Hotel | undefined {
  return hotels.find((hotel) => hotel.id === hotelId);
}
