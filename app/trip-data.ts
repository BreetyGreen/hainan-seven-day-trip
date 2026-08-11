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

export type Source = {
  platform: "小红书" | "官网" | "地图";
  author: string;
  title: string;
  url: string;
};

export type PhotoSource = {
  src: string;
  alt: string;
  platform: "小红书";
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

export type Day = {
  id: number;
  title: string;
  dateLabel: string;
  pace: string;
  summary: string;
  placeIds: string[];
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

const xhsRoute = "https://www.xiaohongshu.com/search_result/69c4017c0000000023021eb9?xsec_token=AB4JxORkYxfa1HXo3F0ea-suXVgj5PlSUBrAi833uvwm0=&xsec_source=";
const xhsQilou = "https://www.xiaohongshu.com/search_result/6a689911000000000503abca?xsec_token=ABdf33JswOKIC4iSEXGes5kGL2ah87BZ8a-DzXBAmWUTc=&xsec_source=";
const xhsWanningRoute = "https://www.xiaohongshu.com/search_result/6a2b733d000000000802544e?xsec_token=ABnAMbQdECihFgwj8XFK7U-wCbpQ1J-wwoBEVnkv4Jffg=&xsec_source=";
const xhsWanningReality = "https://www.xiaohongshu.com/search_result/69abee14000000000e03ce43?xsec_token=ABSflyHtUNEkaYDtjgaPlX72PUFu45v99A9k63R-lj7BI=&xsec_source=";
const xhsWanningHyatt = "https://www.xiaohongshu.com/search_result/6a33dac0000000002100add2?xsec_token=ABxBP-QYOL2RMGCXByh_h_JucQ66XGtj6lw-ASfyLlvFw=&xsec_source=";
const xhsLingshui = "https://www.xiaohongshu.com/search_result/6a79ad60000000002202c3da?xsec_token=ABEYVGrdadig7lhyus-gD04BkuOPVf-Hy6-qwIwe-hTrE=&xsec_source=";
const xhsRaffles = "https://www.xiaohongshu.com/search_result/69e71f520000000023010dc3?xsec_token=ABQ2NO7zJeO7tcvzGnc6S-wd3xa-yI_ycmyBNtnBsede4=&xsec_source=";
const xhsSanyaCity = "https://www.xiaohongshu.com/search_result/6a657af900000000010307a4?xsec_token=ABjP_9LUg4g5koaqlNXaxAnfNy0MdtakAWiSgcoDnPz0g=&xsec_source=";
const xhsNanshan = "https://www.xiaohongshu.com/search_result/6a58f880000000000c016cc9?xsec_token=ABgVnlRa7lx1XJvA5igCtNbVyvMwGtTuUsOBXFxIU9o2A=&xsec_source=";
const xhsSanyaHyatt = "https://www.xiaohongshu.com/search_result/6a65848a000000001c00ec09?xsec_token=ABjP_9LUg4g5koaqlNXaxAnZqHAe5SfALxlTYOvBp4DB4=&xsec_source=";

export const routeResearchSource = xhsRoute;

const mapActivity = (title: string, url: string): Activity => ({
  time: "按航班时间",
  duration: "交通节点",
  steps: ["核对证件与行李", "按地图继续下一段"],
  practical: ["预留交通与还车缓冲"],
  weather: "航班或道路调整时，以当天官方通知为准。",
  source: { platform: "地图", author: "地图核验", title, url },
});

export const places: Place[] = [
  {
    id: "wuhan-airport",
    name: "武汉天河国际机场",
    shortName: "武汉天河",
    city: "武汉",
    category: "transport",
    coordinates: { lat: 30.7756632, lng: 114.2171149 },
    why: "七日完整路线的起点和终点。",
    activity: mapActivity("武汉天河国际机场地图", "https://www.openstreetmap.org/way/128255090"),
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
    why: "海口进、三亚出的北端入口；取车后不再回头。",
    activity: mapActivity("海口美兰国际机场地图", "https://www.openstreetmap.org/relation/4452375"),
    sourceUrl: "https://www.openstreetmap.org/relation/4452375",
    verifiedAt: "2026-08-11",
  },
  {
    id: "qilou",
    name: "海口骑楼老街",
    shortName: "骑楼老街",
    city: "海口",
    category: "oldtown",
    coordinates: { lat: 20.0447272, lng: 110.3376498 },
    why: "把第一顿饭放在真实街区，而不是机场商场；只做短停，不拖晚到万宁。",
    activity: {
      time: "11:30–13:15",
      duration: "约 1 小时 45 分",
      steps: ["从中山路入口步行看骑楼立面", "在街区内选一家粉面或清补凉完成午饭"],
      practical: ["若航班 13:30 后落地，直接跳过此站前往万宁", "只在正规停车场停车，不跟街边揽客"],
      weather: "暴雨时缩短为午饭，不在湿滑骑楼台阶久留。",
      source: { platform: "小红书", author: "好运狗🍀", title: "海口·骑楼老街的夜景真的美爆了", url: xhsQilou },
    },
    image: {
      src: "/hainan/qilou-night-xhs.webp",
      alt: "海口骑楼老街夜间建筑与街头生活",
      platform: "小红书",
      credit: "好运狗🍀",
      creditUrl: xhsQilou,
      noteTitle: "海口·骑楼老街的夜景真的美爆了",
    },
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
    why: "前三晚固定基地，覆盖兴隆、石梅湾、日月湾与神州半岛，不反复搬行李。",
    hotelId: "grand-hyatt-wanning",
    activity: {
      time: "Day 1–3",
      duration: "连住 3 晚",
      steps: ["Day 1 傍晚一次性入住", "Day 2–3 每天从同一停车位出发并返回"],
      practical: ["高峰时段接驳车可能等待", "把海况差的时段留给酒店泳池与公共区域"],
      weather: "台风预警时取消跨湾活动，留在酒店并听从管理安排。",
      source: { platform: "小红书", author: "熠民", title: "万宁 staycation｜神州半岛君悦真实入住测评", url: xhsWanningHyatt },
    },
    image: {
      src: "/hainan/grand-hyatt-wanning-xhs.webp",
      alt: "万宁神州半岛君悦热带公共区域与水景",
      platform: "小红书",
      credit: "熠民",
      creditUrl: xhsWanningHyatt,
      noteTitle: "万宁 staycation｜神州半岛君悦真实入住测评",
    },
    sourceUrl: "https://www.hyatt.com/en-US/hotel/china/grand-hyatt-shenzhou-peninsula/shhgh",
    verifiedAt: "2026-08-11",
  },
  {
    id: "xinglong-garden",
    name: "兴隆热带植物园",
    shortName: "兴隆植物园",
    city: "万宁",
    category: "garden",
    coordinates: { lat: 18.7327905, lng: 110.1962942 },
    why: "用一段有讲解的热带植物观察替代纯拍照园区。",
    activity: {
      time: "08:30–10:45",
      duration: "约 2 小时 15 分",
      steps: ["先走香料与饮料作物区域，辨认可可、咖啡和胡椒", "在科普点完成一次兴隆咖啡/可可风味对照"],
      practical: ["优先开园后进入，避开正午闷热", "穿防滑鞋并带驱蚊"],
      weather: "雷雨时只走有遮蔽的科普段，取消林下长线。",
      source: { platform: "地图", author: "地图核验", title: "兴隆热带植物园", url: "https://www.openstreetmap.org/way/325533045" },
    },
    sourceUrl: "https://www.openstreetmap.org/way/325533045",
    verifiedAt: "2026-08-11",
  },
  {
    id: "xinglong-market",
    name: "兴隆华侨农贸市场",
    shortName: "兴隆市场",
    city: "万宁",
    category: "food",
    coordinates: { lat: 18.73747, lng: 110.19691 },
    why: "南洋风味落到市场和午饭，不追网红餐厅排队。",
    activity: {
      time: "11:05–12:20",
      duration: "约 1 小时 15 分",
      steps: ["先看当季热带水果与香料摊位", "午饭选清晰标价的南洋粉面或糕点，少量多样"],
      practical: ["生鲜不长时间放在车内", "海鲜称重与做法必须下单前确认"],
      weather: "暴雨天可保留，避免市场外积水路段。",
      source: { platform: "小红书", author: "逍遥", title: "万宁3天2晚旅行攻略｜头一次来这样玩不纠结", url: xhsWanningRoute },
    },
    sourceUrl: "https://www.amap.com/search?query=%E5%85%B4%E9%9A%86%E5%8D%8E%E4%BE%A8%E5%86%9C%E8%B4%B8%E5%B8%82%E5%9C%BA",
    verifiedAt: "2026-08-11",
  },
  {
    id: "shimei-bay",
    name: "万宁石梅湾",
    shortName: "石梅湾",
    city: "万宁",
    category: "coast",
    coordinates: { lat: 18.661922, lng: 110.27209 },
    why: "比日月湾安静，用来完成沿海步行和午后休息。",
    activity: {
      time: "14:00–16:20",
      duration: "约 2 小时 20 分",
      steps: ["从公共海滩入口沿水线慢走 30–40 分钟", "找阴凉处休息，看海况而不是追逐拍照机位"],
      practical: ["只从公共入口进出，不借酒店私属通道", "离水前确认潮位和救生提示"],
      weather: "大浪、雷电或红旗时不下水，只在安全步道停留。",
      source: { platform: "小红书", author: "逍遥", title: "万宁3天2晚旅行攻略｜头一次来这样玩不纠结", url: xhsWanningRoute },
    },
    sourceUrl: "https://www.openstreetmap.org/way/341370752",
    verifiedAt: "2026-08-11",
  },
  {
    id: "riyue-bay",
    name: "万宁日月湾",
    shortName: "日月湾",
    city: "万宁",
    category: "coast",
    coordinates: { lat: 18.6296934, lng: 110.2148756 },
    why: "把冲浪变成一节有资质教练的课程，而不是只在商业街打卡。",
    activity: {
      time: "08:00–12:00",
      duration: "约 4 小时",
      steps: ["08:00 先在公共海滩看浪况和警示旗", "09:00 参加约 2 小时的正规入门课，课程应含救生衣、热身和岸上讲解"],
      practical: ["主街停车紧张，把车停在正规停车区后步行", "不会游泳或海况不稳时改为看浪与咖啡休息"],
      weather: "九月台风与涌浪变化快，教练停课就取消，不自行下水。",
      source: { platform: "小红书", author: "逍遥", title: "万宁3天2晚旅行攻略｜头一次来这样玩不纠结", url: xhsWanningRoute },
    },
    image: {
      src: "/hainan/riyue-bay-xhs.webp",
      alt: "日月湾蓝天下的海岸与椰树",
      platform: "小红书",
      credit: "Coco妈咪",
      creditUrl: xhsRoute,
      noteTitle: "海南｜海口-万宁-陵水-三亚7天线路攻略",
    },
    sourceUrl: "https://www.openstreetmap.org/way/844022320",
    verifiedAt: "2026-08-11",
  },
  {
    id: "shenzhou-peninsula",
    name: "神州半岛海岸与灯塔段",
    shortName: "神州半岛",
    city: "万宁",
    category: "viewpoint",
    coordinates: { lat: 18.6779739, lng: 110.3479262 },
    why: "离住宿基地近，适合把灯塔、海岸和日落合成不赶路的半日。",
    activity: {
      time: "15:40–18:25",
      duration: "约 2 小时 45 分",
      steps: ["先走公共海岸步道，再根据现场交通到灯塔方向", "日落前 40 分钟回到开阔海岸，不摸黑赶路"],
      practical: ["2026 年 4 月笔记评论称椰林大道以观光车为主，出发前向酒店确认", "不把车驶入封闭或居民通道"],
      weather: "云厚可保留海岸散步；雷雨则直接回酒店。",
      source: { platform: "小红书", author: "卷卷心", title: "来了万宁才知道，之前看的攻略有多离谱", url: xhsWanningReality },
    },
    sourceUrl: "https://www.openstreetmap.org/way/281774543",
    verifiedAt: "2026-08-11",
  },
  {
    id: "xincun-port",
    name: "陵水新村港旅游码头",
    shortName: "新村港",
    city: "陵水",
    category: "harbor",
    coordinates: { lat: 18.41519, lng: 109.997 },
    why: "从水上看疍家渔排与真实通勤船，比增加一座拍照岛更有内容。",
    activity: {
      time: "10:20–12:20",
      duration: "约 2 小时",
      steps: ["在正规售票点确认当天客船班次与返程时间", "乘小客船穿过渔排，观察生活空间但不对居民近距离拍摄"],
      practical: ["船只容量小，人多时预留排队时间", "不跟无证揽客船、不购买或带走野生海洋生物"],
      weather: "大风、雷雨或停航时取消乘船，直接去清水湾。",
      source: { platform: "小红书", author: "双双&豆包", title: "海南自驾游攻略第四站➡陵水 疍家 清水湾", url: xhsLingshui },
    },
    sourceUrl: "https://www.xiaohongshu.com/search_result/6a79ad60000000002202c3da",
    verifiedAt: "2026-08-11",
  },
  {
    id: "clearwater-bay",
    name: "陵水清水湾公共海滩",
    shortName: "清水湾",
    city: "陵水",
    category: "coast",
    coordinates: { lat: 18.3920123, lng: 109.87799 },
    why: "唯一换宿日的慢停，沙细且适合长距离步行。",
    activity: {
      time: "14:00–16:10",
      duration: "约 2 小时 10 分",
      steps: ["从公共入口沿干沙区向西慢走", "只在有救生提示的区域涉水，留 30 分钟冲洗与换衣"],
      practical: ["赶海必须查潮汐并听现场管理，不捕捉海星海胆", "16:20 前离开，留足时间抵达三亚办理入住"],
      weather: "大浪或雷雨时取消涉水，改为短走后提前入住。",
      source: { platform: "小红书", author: "双双&豆包", title: "海南自驾游攻略第四站➡陵水 疍家 清水湾", url: xhsLingshui },
    },
    image: {
      src: "/hainan/raffles-hainan-xhs.webp",
      alt: "清水湾莱佛士附近的椰林、草坪与海岸景观",
      platform: "小红书",
      credit: "一只张在在",
      creditUrl: xhsRaffles,
      noteTitle: "清水湾莱佛士｜掏心窝子真实感受",
    },
    sourceUrl: "https://www.openstreetmap.org/way/1124007058",
    verifiedAt: "2026-08-11",
  },
  {
    id: "sanya-hyatt",
    name: "三亚海棠湾君悦酒店",
    shortName: "三亚君悦",
    city: "三亚",
    category: "stay",
    coordinates: { lat: 18.3458391, lng: 109.7357906 },
    why: "后三晚固定基地，陵水、南山与三亚城市日都从这里往返。",
    hotelId: "grand-hyatt-sanya",
    activity: {
      time: "Day 4–6",
      duration: "连住 3 晚",
      steps: ["Day 4 完成全程唯一一次换宿", "Day 5–6 用同一房间和停车位做东西两方向日游"],
      practical: ["到市区与南山距离长，Day 5–6 只各安排一条主线", "早餐和接驳高峰可能排队"],
      weather: "台风预警时取消跨区自驾，使用酒店公共设施。",
      source: { platform: "小红书", author: "如意烧仙草", title: "三亚｜海棠湾君悦入住真实体验", url: xhsSanyaHyatt },
    },
    image: {
      src: "/hainan/grand-hyatt-sanya-xhs.webp",
      alt: "三亚海棠湾君悦泳池、椰林与海景",
      platform: "小红书",
      credit: "如意烧仙草",
      creditUrl: xhsSanyaHyatt,
      noteTitle: "三亚｜海棠湾君悦入住真实体验",
    },
    sourceUrl: "https://www.hyatt.com/grand-hyatt/en-US/syxgh-grand-hyatt-sanya-haitang-bay-resort-and-spa",
    verifiedAt: "2026-08-11",
  },
  {
    id: "nanshan",
    name: "三亚南山文化旅游区",
    shortName: "南山",
    city: "三亚",
    category: "culture",
    coordinates: { lat: 18.3000907, lng: 109.2066329 },
    why: "用一个完整半日理解南山园区，不把它压缩成海上观音拍照点。",
    activity: {
      time: "10:30–16:45",
      duration: "约 6 小时 15 分",
      steps: ["从正式检票口进入，先确认免费接驳与观光车站点", "按海上观音—南山寺—园林步道顺序走，至少留一次室内降温休息"],
      practical: ["九月默认不排队登顶抱佛脚：暴晒、狭窄楼梯和冷热切换风险高", "拒绝入口外收费揽客车，只用景区正式交通"],
      weather: "雷雨时取消海边长距离步行；高温时每 45–60 分钟补水休息。",
      source: { platform: "小红书", author: "Hs", title: "三亚行-南山寺 2026年1月6号行程", url: xhsNanshan },
    },
    sourceUrl: "https://www.nanshan.com/www.nanshan.com/index.php/jqjj/index.html",
    verifiedAt: "2026-08-11",
  },
  {
    id: "dadonghai",
    name: "三亚大东海海水浴场",
    shortName: "大东海",
    city: "三亚",
    category: "coast",
    coordinates: { lat: 18.2205905, lng: 109.5251825 },
    why: "公共海水浴场，能把游泳、步行和海况判断放在正规管理区域。",
    activity: {
      time: "09:00–11:00",
      duration: "约 2 小时",
      steps: ["从大东海广场公共入口进入并先看警示旗", "沿沙滩向东步行，只有在开放且有救生管理时游泳"],
      practical: ["不购买沙滩流动人员兜售的水上项目", "下水前确认更衣、贵重物品和返程停车位置"],
      weather: "红旗、雷电或离岸流提示时不下水。",
      source: { platform: "小红书", author: "拾渡", title: "三亚大东海顺路游玩一日游攻略", url: xhsSanyaCity },
    },
    sourceUrl: "https://www.amap.com/place/B0KUYYWVTS",
    verifiedAt: "2026-08-11",
  },
  {
    id: "luhuitou",
    name: "三亚鹿回头风景区",
    shortName: "鹿回头",
    city: "三亚",
    category: "viewpoint",
    coordinates: { lat: 18.2271541, lng: 109.4962752 },
    why: "在一个正规观景区读懂三亚湾、大东海和城市的空间关系。",
    activity: {
      time: "15:10–17:00",
      duration: "约 1 小时 50 分",
      steps: ["从景区入口按开放路线上行到主观景平台", "在平台辨认大东海、三亚湾和凤凰岛方向后原路下行"],
      practical: ["不为看日落拖到拥挤末班时段", "带水，选择防滑鞋，不走未开放小路"],
      weather: "雷雨或大风时取消高处观景，直接前往三亚湾。",
      source: { platform: "小红书", author: "拾渡", title: "三亚大东海顺路游玩一日游攻略", url: xhsSanyaCity },
    },
    sourceUrl: "https://www.openstreetmap.org/node/1943151461",
    verifiedAt: "2026-08-11",
  },
  {
    id: "coconut-corridor",
    name: "三亚湾椰梦长廊",
    shortName: "椰梦长廊",
    city: "三亚",
    category: "coast",
    coordinates: { lat: 18.274342, lng: 109.475754 },
    why: "把城市日收在三亚湾日落，而不是再增加一个收费景点。",
    activity: {
      time: "17:25–18:45",
      duration: "约 1 小时 20 分",
      steps: ["导航到三亚湾公共停车区域后步行进椰林", "日落前 30 分钟到海边，日落后立即离开避免夜间长途疲劳"],
      practical: ["椰梦长廊很长，不用追逐所谓唯一机位", "停车只用正规车位，拒绝摄影拉客"],
      weather: "云厚仍可散步；雷雨时取消并直接回酒店。",
      source: { platform: "小红书", author: "Coco妈咪", title: "海南｜海口-万宁-陵水-三亚7天线路攻略", url: xhsRoute },
    },
    sourceUrl: "https://www.amap.com/search?query=%E6%A4%B0%E6%A2%A6%E9%95%BF%E5%BB%8A",
    verifiedAt: "2026-08-11",
  },
  {
    id: "sanya-airport",
    name: "三亚凤凰国际机场",
    shortName: "三亚凤凰",
    city: "三亚",
    category: "transport",
    coordinates: { lat: 18.3051519, lng: 109.4125351 },
    why: "异地还车后从南端离岛，路线不折返海口。",
    activity: mapActivity("三亚凤凰国际机场地图", "https://www.openstreetmap.org/way/32079751"),
    sourceUrl: "https://www.openstreetmap.org/way/32079751",
    verifiedAt: "2026-08-11",
  },
];

export const hotels: Hotel[] = [
  {
    id: "grand-hyatt-wanning",
    name: "万宁神州半岛君悦酒店",
    shortName: "万宁基地",
    city: "万宁",
    checkInDay: 1,
    nights: "Day 1–3 · 连住 3 晚",
    fit: "覆盖万宁三条日游线，不为了看不同海湾每天搬行李。",
    reasons: ["房间与热带公共区域完成度较好", "神州半岛比日月湾夜间更安静，停车和返程清楚"],
    cautions: ["高峰时接驳车可能等待", "周边夜间活动有限，适合安静基地而非夜生活"],
    image: {
      src: "/hainan/grand-hyatt-wanning-xhs.webp",
      alt: "万宁神州半岛君悦热带公共区域与水景",
      platform: "小红书",
      credit: "熠民",
      creditUrl: xhsWanningHyatt,
      noteTitle: "万宁 staycation｜神州半岛君悦真实入住测评",
    },
    officialUrl: "https://www.hyatt.com/en-US/hotel/china/grand-hyatt-shenzhou-peninsula/shhgh",
    xhsSource: { author: "熠民", title: "万宁 staycation｜神州半岛君悦真实入住测评", url: xhsWanningHyatt },
  },
  {
    id: "grand-hyatt-sanya",
    name: "三亚海棠湾君悦酒店",
    shortName: "三亚基地",
    city: "三亚",
    checkInDay: 4,
    nights: "Day 4–6 · 连住 3 晚",
    fit: "Day 4 仅换这一次，之后陵水、南山和三亚城市日都返回同一房间。",
    reasons: ["公共区域、早餐与海景稳定", "靠近海棠湾高速入口，Day 4 从陵水抵达顺路"],
    cautions: ["去南山和三亚湾车程较长", "入住与接驳高峰可能排队"],
    image: {
      src: "/hainan/grand-hyatt-sanya-xhs.webp",
      alt: "三亚海棠湾君悦泳池与海棠湾景观",
      platform: "小红书",
      credit: "如意烧仙草",
      creditUrl: xhsSanyaHyatt,
      noteTitle: "三亚｜海棠湾君悦入住真实体验",
    },
    officialUrl: "https://www.hyatt.com/grand-hyatt/en-US/syxgh-grand-hyatt-sanya-haitang-bay-resort-and-spa",
    xhsSource: { author: "如意烧仙草", title: "三亚｜海棠湾君悦入住真实体验", url: xhsSanyaHyatt },
  },
];

export const days: Day[] = [
  {
    id: 1,
    title: "武汉 → 海口 → 万宁",
    dateLabel: "抵达日",
    pace: "一次到位",
    summary: "早班机落地海口；时间足够才短停骑楼，傍晚直接住进万宁，之后三天不搬。",
    placeIds: ["wuhan-airport", "haikou-airport", "qilou", "wanning-hyatt"],
    distanceLabel: "岛内约 185 km",
    driveLabel: "约 2.5–3 h",
    sleep: "万宁神州半岛君悦酒店",
    meals: ["骑楼粉面", "服务区补水", "酒店晚饭"],
    weatherPlan: "晚点或暴雨时删除骑楼，机场取车后直达万宁。",
  },
  {
    id: 2,
    title: "兴隆植物与石梅湾",
    dateLabel: "万宁基地",
    pace: "植物＋南洋味＋海岸",
    summary: "上午看热带作物，中午进兴隆市场，下午只留石梅湾一段安静海岸。",
    placeIds: ["wanning-hyatt", "xinglong-garden", "xinglong-market", "shimei-bay", "wanning-hyatt"],
    distanceLabel: "约 52 km 环线",
    driveLabel: "约 1 h 路上",
    sleep: "万宁神州半岛君悦酒店",
    meals: ["兴隆咖啡", "南洋粉面", "石梅湾或酒店晚饭"],
    weatherPlan: "雷雨保留市场，植物园与海岸按现场关闭情况删减。",
  },
  {
    id: 3,
    title: "日月湾冲浪与神州日落",
    dateLabel: "万宁基地",
    pace: "一动一静",
    summary: "上午只做一节正规冲浪课，下午回神州半岛慢走与看日落。",
    placeIds: ["wanning-hyatt", "riyue-bay", "shenzhou-peninsula", "wanning-hyatt"],
    distanceLabel: "约 44 km 环线",
    driveLabel: "约 50 min 路上",
    sleep: "万宁神州半岛君悦酒店",
    meals: ["酒店早餐", "日月湾简餐", "神州半岛晚饭"],
    weatherPlan: "涌浪或雷雨取消冲浪，改为酒店半日与海况安全时的短走。",
  },
  {
    id: 4,
    title: "万宁 → 新村港 → 三亚",
    dateLabel: "唯一换宿日",
    pace: "唯一换宿＋渔排",
    summary: "退掉万宁房间，沿新村港和清水湾南下，傍晚一次性换到三亚住三晚。",
    placeIds: ["wanning-hyatt", "xincun-port", "clearwater-bay", "sanya-hyatt"],
    distanceLabel: "约 130 km",
    driveLabel: "约 2 h 路上",
    sleep: "三亚海棠湾君悦酒店",
    meals: ["酒店早餐", "新村镇午饭", "三亚酒店晚饭"],
    weatherPlan: "客船停航就删新村港乘船，清水湾大浪则直接入住。",
    isHotelChange: true,
  },
  {
    id: 5,
    title: "南山完整半日",
    dateLabel: "三亚基地",
    pace: "人文主线",
    summary: "不塞天涯镇或崖州古城，只给南山一段完整时间，并明确避开暴晒登顶。",
    placeIds: ["sanya-hyatt", "nanshan", "sanya-hyatt"],
    distanceLabel: "约 133 km 往返",
    driveLabel: "约 1 h 50 min 路上",
    sleep: "三亚海棠湾君悦酒店",
    meals: ["酒店早餐", "景区内简餐", "返程晚饭"],
    weatherPlan: "高温降低步行量；雷雨或台风预警则改为酒店留白日。",
  },
  {
    id: 6,
    title: "大东海 → 鹿回头 → 三亚湾",
    dateLabel: "三亚城市日",
    pace: "海浴场＋城市视角＋日落",
    summary: "从正规公共海滩开始，在鹿回头读懂城市方向，最后到三亚湾收日落。",
    placeIds: ["sanya-hyatt", "dadonghai", "luhuitou", "coconut-corridor", "sanya-hyatt"],
    distanceLabel: "约 88 km 环线",
    driveLabel: "约 1 h 35 min 路上",
    sleep: "三亚海棠湾君悦酒店",
    meals: ["酒店早餐", "大东海午饭", "三亚湾晚饭"],
    weatherPlan: "红旗不游泳、雷雨不上高处；只保留安全的城市段。",
  },
  {
    id: 7,
    title: "三亚 → 武汉",
    dateLabel: "返程日",
    pace: "还车离岛",
    summary: "退房、加油、异地还车，从三亚凤凰机场飞回武汉。",
    placeIds: ["sanya-hyatt", "sanya-airport", "wuhan-airport"],
    distanceLabel: "岛内约 42 km",
    driveLabel: "约 50 min＋航班",
    sleep: "回家",
    meals: ["酒店早餐", "机场简餐"],
    weatherPlan: "台风季提前 72 小时和 24 小时分别复核航班与还车安排。",
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
