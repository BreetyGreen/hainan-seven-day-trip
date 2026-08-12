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
const sangemOfficial = "https://www.sangemmoon.com/";
const sofitelOfficial = "https://all.accor.com/hotel/8167/index.zh.shtml";
const atourCtrip = "https://hotels.ctrip.com/hotels/120750482.html";

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
    why: "最后两晚用园林和泳池收尾；海景房只在差价合理时升级。",
    hotelId: "sofitel-sanya",
    activity: {
      time: "Day 5–6",
      duration: "连住 2 晚",
      steps: ["午后办理入住", "先确认房型朝向与早餐", "外出日只走一条三亚海岸线"],
      practical: ["基础园景或池景也可接受", "不为海景房压缩返程机动金"],
      weather: "台风预警时取消城市日，留在酒店。",
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
    id: "sangem-moon",
    name: "海南三正月酒店",
    shortName: "陵水海景基地",
    city: "陵水",
    checkInDay: 2,
    nights: "Day 2–4 · 连住 3 晚",
    fit: "全程主要海景住宿；优先高楼层海景大床、独立阳台和双早。",
    reasons: ["土福湾一线海岸", "三晚有足够时间使用阳台、泳池和海滩"],
    cautions: ["亲子客群明显", "景观房、池景房不能替代真正海景房"],
    image: xhsPhoto("/hainan/sangem-moon-xhs.webp", "海南三正月酒店蓝调时刻建筑外景", "肥欧OOOOOO", xhsSangem, "海南酒店攻略——陵水三正月，值得二刷"),
    officialUrl: sangemOfficial,
    xhsSource: { author: "肥欧OOOOOO", title: "海南酒店攻略——陵水三正月，值得二刷", url: xhsSangem },
  },
  {
    id: "sofitel-sanya",
    name: "三亚理文索菲特酒店",
    shortName: "三亚收尾基地",
    city: "三亚",
    checkInDay: 5,
    nights: "Day 5–6 · 连住 2 晚",
    fit: "园林和泳池完整；海景房仅在差价合理时升级。",
    reasons: ["从陵水南下顺路", "只用一天外出，仍有时间使用酒店设施"],
    cautions: ["酒店体量较大", "前往小东海与鹿回头需约一小时"],
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
    title: "海口 → 陵水",
    dateLabel: "9 月 13 日 · 换宿日",
    pace: "第一次换宿",
    summary: "慢早餐后南下，下午住进陵水海景房，当天不再安排售票景区。",
    placeIds: ["haikou-qilou-atour", "sangem-moon"],
    legs: [leg(0, 1, "drive", "约 2 小时 45 分–3 小时 15 分", "暴雨时增加服务区休息，不压缩安全余量。", "约 232 km", "服务区休息另计")],
    distanceLabel: "约 232 km",
    driveLabel: "约 2.75–3.25 h",
    sleep: "海南三正月酒店",
    meals: ["海口慢早餐", "服务区简餐", "酒店晚饭"],
    weatherPlan: "天气差就直接入住，不安排海边活动。",
    isHotelChange: true,
  },
  {
    id: 3,
    title: "新村港与疍家渔排",
    dateLabel: "9 月 14 日 · 陵水基地",
    pace: "半日游＋半日度假",
    summary: "上午只走新村港一条线，午后回到同一间海景房。",
    placeIds: ["sangem-moon", "xincun-port", "sangem-moon"],
    legs: [
      leg(0, 1, "drive", "约 45–60 分钟", "停航时取消港口乘船。", "约 44 km"),
      leg(1, 2, "drive", "约 45–60 分钟", "暴雨时午饭后直接回酒店。", "约 44 km"),
    ],
    distanceLabel: "约 88 km 往返",
    driveLabel: "约 1.5–2 h",
    sleep: "海南三正月酒店",
    meals: ["酒店早餐", "新村镇午饭", "酒店或附近晚饭"],
    weatherPlan: "大风停航则删除乘船，只保留新村午饭或酒店留白。",
  },
  {
    id: 4,
    title: "海景房与酒店海岸",
    dateLabel: "9 月 15 日 · 陵水基地",
    pace: "完整留白日",
    summary: "不为了打卡搬动车辆，用海景早餐、海滩、泳池和午休组成完整一天。",
    placeIds: ["sangem-moon", "sangem-beach", "sangem-moon"],
    legs: [
      leg(0, 1, "walk", "步行约 5–10 分钟", "雷雨时留在室内。", "酒店内"),
      leg(1, 2, "walk", "步行约 5–10 分钟", "高温时提前回房。", "酒店内"),
    ],
    distanceLabel: "酒店范围内",
    driveLabel: "不开长途车",
    sleep: "海南三正月酒店",
    meals: ["海景早餐", "酒店简餐", "附近或酒店晚饭"],
    weatherPlan: "大浪不下海，改用室内泳池与房间阳台。",
  },
  {
    id: 5,
    title: "陵水 → 三亚海棠湾",
    dateLabel: "9 月 16 日 · 换宿日",
    pace: "第二次换宿",
    summary: "睡到自然醒再南下，下午只办理入住、看园林和海边。",
    placeIds: ["sangem-moon", "sofitel-sanya"],
    legs: [leg(0, 1, "drive", "约 25–35 分钟", "暴雨时推迟出发并直接入住。", "约 20 km")],
    distanceLabel: "约 20 km",
    driveLabel: "约 25–40 分钟",
    sleep: "三亚理文索菲特酒店",
    meals: ["陵水酒店早餐", "途中或海棠湾午饭", "索菲特晚饭"],
    weatherPlan: "不叠加免税城、后海或蜈支洲岛。",
    isHotelChange: true,
  },
  {
    id: 6,
    title: "小东海 → 帆船港 → 鹿回头",
    dateLabel: "9 月 17 日 · 三亚海岸线",
    pace: "安静海岸＋日落",
    summary: "只走一条集中的城市海岸线，中午留出室内休息。",
    placeIds: ["sofitel-sanya", "xiaodonghai", "banshan-marina", "luhuitou", "sofitel-sanya"],
    legs: [
      leg(0, 1, "drive", "约 45–60 分钟", "雷雨时改为酒店留白。", "约 37 km"),
      leg(1, 2, "drive", "约 10–15 分钟", "港区关闭时直接去鹿回头附近休息。", "约 4 km"),
      leg(2, 3, "drive", "约 10–15 分钟", "低能见度时取消登高。", "约 4 km"),
      leg(3, 4, "drive", "约 45–60 分钟", "天黑后不增加任何景点。", "约 38 km"),
    ],
    distanceLabel: "约 83 km 环线",
    driveLabel: "约 2–2.5 h",
    sleep: "三亚理文索菲特酒店",
    meals: ["酒店早餐", "小东海或帆船港午饭", "返程晚饭"],
    weatherPlan: "雷雨不上高处，大浪不下水；必要时整日留在酒店。",
  },
  {
    id: 7,
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

export function getDayRoute(dayId: number): Place[] {
  const day = days.find((item) => item.id === dayId);
  if (!day) return [];
  return day.placeIds.map((placeId) => places.find((place) => place.id === placeId)).filter((place): place is Place => Boolean(place));
}

export function getHotel(hotelId?: string): Hotel | undefined {
  return hotels.find((hotel) => hotel.id === hotelId);
}
