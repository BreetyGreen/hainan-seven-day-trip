export type SocialVideoCity = "海口" | "万宁" | "陵水" | "三亚" | "全程";
export type SocialVideoPlatform = "抖音" | "小红书";
export type SocialVideoTheme = "路线" | "海岸" | "酒店" | "吃喝" | "实用";

export type SocialVideo = {
  id: string;
  city: SocialVideoCity;
  platform: SocialVideoPlatform;
  theme: SocialVideoTheme;
  title: string;
  creator: string;
  duration: string;
  poster: string;
  sourceUrl: string;
  videoId?: string;
  embedUrl?: string;
  format: "video" | "dynamic-note";
  watchFor: string;
  orientation: "landscape" | "portrait";
};

const douyinPlayer = (videoId: string) => `https://open.douyin.com/player/video?vid=${videoId}&autoplay=0`;

export const socialVideos: SocialVideo[] = [
  {
    id: "douyin-haikou-citywalk", city: "海口", platform: "抖音", title: "海口一日 Citywalk：骑楼与老爸茶", creator: "夜子的旅行记", duration: "约 5 分钟",
    poster: "/hainan/social-douyin-haikou-guide.webp", sourceUrl: "https://www.douyin.com/video/7510185927597149500", videoId: "7510185927597149500", embedUrl: douyinPlayer("7510185927597149500"),
    theme: "路线", format: "video", watchFor: "骑楼老街动线、老爸茶与黄昏出发节奏", orientation: "landscape",
  },
  {
    id: "douyin-haikou-overview", city: "海口", platform: "抖音", title: "海南环岛游：海口景点大全", creator: "摄影师-蔺伟斌", duration: "约 5 分钟",
    poster: "/hainan/social-video-douyin-haikou-overview.webp", sourceUrl: "https://www.douyin.com/video/7576172727187328297", videoId: "7576172727187328297", embedUrl: douyinPlayer("7576172727187328297"),
    theme: "路线", format: "video", watchFor: "交通、美食与住宿区域的整体取舍", orientation: "landscape",
  },
  {
    id: "douyin-wanning-coast", city: "万宁", platform: "抖音", title: "一天半解锁万宁海岸与兴隆咖啡", creator: "夜子的旅行记", duration: "17:48",
    poster: "/hainan/social-douyin-wanning-guide.webp", sourceUrl: "https://www.douyin.com/video/7536046961461710137", videoId: "7536046961461710137", embedUrl: douyinPlayer("7536046961461710137"),
    theme: "海岸", format: "video", watchFor: "神州半岛、石梅湾和兴隆植物园如何串联", orientation: "landscape",
  },
  {
    id: "douyin-lingshui-slow", city: "陵水", platform: "抖音", title: "陵水不是三亚平替：三天小众慢游", creator: "夜子的旅行记", duration: "约 6 分钟",
    poster: "/hainan/social-douyin-lingshui-guide.webp", sourceUrl: "https://www.douyin.com/video/7528654669166546233", videoId: "7528654669166546233", embedUrl: douyinPlayer("7528654669166546233"),
    theme: "路线", format: "video", watchFor: "人少海岸、赶海与三天节奏", orientation: "landscape",
  },
  {
    id: "douyin-lingshui-overview", city: "陵水", platform: "抖音", title: "一条地图讲清陵水景点", creator: "摄影师-蔺伟斌", duration: "02:28",
    poster: "/hainan/social-douyin-lingshui-overview.webp", sourceUrl: "https://www.douyin.com/video/7589580983788260617", videoId: "7589580983788260617", embedUrl: douyinPlayer("7589580983788260617"),
    theme: "路线", format: "video", watchFor: "香水湾、清水湾与南湾半岛的空间关系", orientation: "landscape",
  },
  {
    id: "douyin-clearwater-hotels", city: "陵水", platform: "抖音", title: "清水湾一线海景酒店实住盘点", creator: "大熊去哪儿", duration: "实住长评",
    poster: "/hainan/social-douyin-clearwater-hotels.webp", sourceUrl: "https://www.douyin.com/video/7524031678776446246", videoId: "7524031678776446246", embedUrl: douyinPlayer("7524031678776446246"),
    theme: "酒店", format: "video", watchFor: "航拍、第一视角、公区泳池和亲子设施", orientation: "landscape",
  },
  {
    id: "douyin-lingshui-hotel-family", city: "陵水", platform: "抖音", title: "三亚到陵水七天六晚酒店玩法", creator: "亲子酒店体验作者", duration: "竖屏攻略",
    poster: "/hainan/social-video-douyin-lingshui-hotel-family.webp", sourceUrl: "https://www.douyin.com/video/7551344216913038652", videoId: "7551344216913038652", embedUrl: douyinPlayer("7551344216913038652"),
    theme: "酒店", format: "video", watchFor: "酒店公区、海岸、泳池与换酒店成本", orientation: "portrait",
  },
  {
    id: "douyin-sanya-overview", city: "三亚", platform: "抖音", title: "三亚景点与湾区酒店怎么选", creator: "摄影师-蔺伟斌", duration: "04:18",
    poster: "/hainan/social-douyin-sanya-overview.webp", sourceUrl: "https://www.douyin.com/video/7595562347549166854", videoId: "7595562347549166854", embedUrl: douyinPlayer("7595562347549166854"),
    theme: "路线", format: "video", watchFor: "四大湾区、景点分布、餐饮和住宿差异", orientation: "landscape",
  },
  {
    id: "douyin-sanya-lingshui", city: "三亚", platform: "抖音", title: "三亚与陵水三天小众路线", creator: "汐汐妈妈", duration: "约 3 分钟",
    poster: "/hainan/social-video-douyin-sanya-lingshui.webp", sourceUrl: "https://www.douyin.com/video/7522080445657615655", videoId: "7522080445657615655", embedUrl: douyinPlayer("7522080445657615655"),
    theme: "海岸", format: "video", watchFor: "淡季感、人少海岸和亲子活动密度", orientation: "landscape",
  },
  {
    id: "douyin-eastline-family", city: "全程", platform: "抖音", title: "海南东线七天小众自驾路线", creator: "汐汐妈妈", duration: "路线总览",
    poster: "/hainan/social-video-douyin-eastline-family.webp", sourceUrl: "https://www.douyin.com/video/7582054137073913088", videoId: "7582054137073913088", embedUrl: douyinPlayer("7582054137073913088"),
    theme: "路线", format: "video", watchFor: "海口到三亚不走回头路的东线结构", orientation: "landscape",
  },
  {
    id: "douyin-haikou-food-six-meals", city: "海口", platform: "抖音", theme: "吃喝", title: "海口一天六顿：骑楼老街地道小吃", creator: "可爱的鹅er", duration: "05:40",
    poster: "/hainan/social-douyin-haikou-food-six-meals.webp", sourceUrl: "https://www.douyin.com/video/7632274418102097802", videoId: "7632274418102097802", embedUrl: douyinPlayer("7632274418102097802"),
    format: "video", watchFor: "海南粉、炸虾饼、辣汤饭和糖水怎么顺路吃", orientation: "portrait",
  },
  {
    id: "douyin-haikou-cafe-vlog", city: "海口", platform: "抖音", theme: "吃喝", title: "海口咖啡与本地美食 Vlog", creator: "柚子的咖啡Diary", duration: "08:35",
    poster: "/hainan/social-douyin-haikou-cafe-vlog.webp", sourceUrl: "https://www.douyin.com/video/7496352460399824147", videoId: "7496352460399824147", embedUrl: douyinPlayer("7496352460399824147"),
    format: "video", watchFor: "三家咖啡馆、西天庙小吃街与本地粥面", orientation: "landscape",
  },
  {
    id: "douyin-haikou-dessert-hotpot", city: "海口", platform: "抖音", theme: "吃喝", title: "海口甜品与糟粕醋火锅攻略", creator: "小歪的美食地图", duration: "04:49",
    poster: "/hainan/social-douyin-haikou-dessert-hotpot.webp", sourceUrl: "https://www.douyin.com/video/7503127084610293055", videoId: "7503127084610293055", embedUrl: douyinPlayer("7503127084610293055"),
    format: "video", watchFor: "海南甜品与糟粕醋的点单思路", orientation: "landscape",
  },
  {
    id: "douyin-wanning-two-days", city: "万宁", platform: "抖音", theme: "路线", title: "万宁两天一晚真实路线", creator: "敏敏特穆尔", duration: "02:15",
    poster: "/hainan/social-douyin-wanning-two-days.webp", sourceUrl: "https://www.douyin.com/video/7605433376119971688", videoId: "7605433376119971688", embedUrl: douyinPlayer("7605433376119971688"),
    format: "video", watchFor: "石梅湾、神州半岛、兴隆市场和日月湾的两日串联", orientation: "portrait",
  },
  {
    id: "douyin-wanning-hotel-vlog", city: "万宁", platform: "抖音", theme: "酒店", title: "万宁君悦与兴隆海岸游记", creator: "Super 工兵", duration: "06:16",
    poster: "/hainan/social-douyin-wanning-hotel-vlog.webp", sourceUrl: "https://www.douyin.com/video/7491160082487545139", videoId: "7491160082487545139", embedUrl: douyinPlayer("7491160082487545139"),
    format: "video", watchFor: "酒店实住、兴隆市场、灯塔与石梅湾观景台", orientation: "portrait",
  },
  {
    id: "douyin-wanning-overview", city: "万宁", platform: "抖音", theme: "路线", title: "一条视频看懂万宁景点", creator: "摄影师-蔺伟斌", duration: "04:46",
    poster: "/hainan/social-douyin-wanning-overview.webp", sourceUrl: "https://www.douyin.com/video/7585494151009946920", videoId: "7585494151009946920", embedUrl: douyinPlayer("7585494151009946920"),
    format: "video", watchFor: "适合不同年龄的海滩、咖啡与慢游区域", orientation: "landscape",
  },
  {
    id: "douyin-lingshui-seaview-hotels", city: "陵水", platform: "抖音", theme: "酒店", title: "陵水富力湾与香水湾海景酒店盘点", creator: "大熊去哪儿", duration: "03:28",
    poster: "/hainan/social-douyin-lingshui-seaview-hotels.webp", sourceUrl: "https://www.douyin.com/video/7552570702352698634", videoId: "7552570702352698634", embedUrl: douyinPlayer("7552570702352698634"),
    format: "video", watchFor: "一线海景、航拍环境和第一视角实住差异", orientation: "landscape",
  },
  {
    id: "douyin-lingshui-family-four-days", city: "陵水", platform: "抖音", theme: "路线", title: "陵水四天三夜轻松亲子路线", creator: "Sunny妈妈爱晴天", duration: "03:46",
    poster: "/hainan/social-douyin-lingshui-family-four-days.webp", sourceUrl: "https://www.douyin.com/video/7595764189932503162", videoId: "7595764189932503162", embedUrl: douyinPlayer("7595764189932503162"),
    format: "video", watchFor: "威斯汀、自由灯塔与海洋欢乐世界的低奔波排法", orientation: "portrait",
  },
  {
    id: "douyin-clearwater-slow-vibe", city: "陵水", platform: "抖音", theme: "海岸", title: "清水湾的松弛感：市集、咖啡与游艇", creator: "金珠拉姆", duration: "01:08",
    poster: "/hainan/social-douyin-clearwater-slow-vibe.webp", sourceUrl: "https://www.douyin.com/video/7604661803301466822", videoId: "7604661803301466822", embedUrl: douyinPlayer("7604661803301466822"),
    format: "video", watchFor: "云顶集、海边咖啡与不赶时间的清水湾氛围", orientation: "landscape",
  },
  {
    id: "douyin-lingshui-tidepool", city: "陵水", platform: "抖音", theme: "海岸", title: "陵水十个赶海地点怎么选", creator: "摄影师-蔺伟斌", duration: "约 5 分钟",
    poster: "/hainan/social-douyin-lingshui-tidepool.webp", sourceUrl: "https://www.douyin.com/video/7588548481019612466", videoId: "7588548481019612466", embedUrl: douyinPlayer("7588548481019612466"),
    format: "video", watchFor: "亲子友好、便宜小众的赶海点位与海况意识", orientation: "landscape",
  },
  {
    id: "douyin-sanya-beginner-regions", city: "三亚", platform: "抖音", theme: "路线", title: "第一次去三亚：四大区域讲明白", creator: "我是小康", duration: "14:54",
    poster: "/hainan/social-douyin-sanya-beginner-regions.webp", sourceUrl: "https://www.douyin.com/video/7636377298908751988", videoId: "7636377298908751988", embedUrl: douyinPlayer("7636377298908751988"),
    format: "video", watchFor: "三亚湾、亚龙湾、海棠湾与市区的住宿游玩取舍", orientation: "portrait",
  },
  {
    id: "douyin-sanya-duty-free", city: "三亚", platform: "抖音", theme: "实用", title: "三亚国际免税城快速认识", creator: "胡珞博", duration: "01:05",
    poster: "/hainan/social-douyin-sanya-duty-free.webp", sourceUrl: "https://www.douyin.com/video/7619475312314207481", videoId: "7619475312314207481", embedUrl: douyinPlayer("7619475312314207481"),
    format: "video", watchFor: "海棠湾购物地标的品类与空间规模", orientation: "portrait",
  },
  {
    id: "douyin-sanya-three-days", city: "三亚", platform: "抖音", theme: "路线", title: "三亚三天两夜吃喝游玩攻略", creator: "饼哥来啦", duration: "三天两夜攻略",
    poster: "/hainan/social-douyin-sanya-three-days.webp", sourceUrl: "https://www.douyin.com/video/7650716800598898610", videoId: "7650716800598898610", embedUrl: douyinPlayer("7650716800598898610"),
    format: "video", watchFor: "短假期怎么兼顾吃、住与少走冤枉路", orientation: "portrait",
  },
  {
    id: "douyin-sanya-family-hotel-budget", city: "三亚", platform: "抖音", theme: "酒店", title: "带娃纯泡酒店：三家亲子酒店实住", creator: "等等呀～", duration: "02:23",
    poster: "/hainan/social-douyin-sanya-family-hotel-budget.webp", sourceUrl: "https://www.douyin.com/video/7630700741615670123", videoId: "7630700741615670123", embedUrl: douyinPlayer("7630700741615670123"),
    format: "video", watchFor: "三亚湾假日、亚龙湾天域与海棠湾仁恒的真实体验", orientation: "portrait",
  },
  {
    id: "douyin-sanya-haitang-hotel-budget", city: "三亚", platform: "抖音", theme: "酒店", title: "海棠湾仁恒两晚泡酒店体验", creator: "等等呀～", duration: "02:23",
    poster: "/hainan/social-douyin-sanya-haitang-hotel-budget.webp", sourceUrl: "https://www.douyin.com/video/7634141351043834614", videoId: "7634141351043834614", embedUrl: douyinPlayer("7634141351043834614"),
    format: "video", watchFor: "亲子家庭全程泡酒店的活动密度与花费构成", orientation: "portrait",
  },
  {
    id: "douyin-hainan-island-roadtrip", city: "全程", platform: "抖音", theme: "路线", title: "海南环岛自驾：16 天路线总攻略", creator: "夜子的旅行记", duration: "环岛长攻略",
    poster: "/hainan/social-douyin-hainan-island-roadtrip.webp", sourceUrl: "https://www.douyin.com/video/7504645733681859900", videoId: "7504645733681859900", embedUrl: douyinPlayer("7504645733681859900"),
    format: "video", watchFor: "海口到三亚东线结构、沙滩选择与完整环岛参照", orientation: "landscape",
  },
  {
    id: "xhs-sanya-pretrip", city: "三亚", platform: "小红书", title: "下周出发去三亚：行前清单动态笔记", creator: "用户提供笔记", duration: "8 张动态内容",
    poster: "/hainan/social-xhs-sanya-pretrip-01.webp", sourceUrl: "https://xhslink.cn/o/6QybMpO8y3I", theme: "实用", format: "dynamic-note", watchFor: "景点、购买清单与本地评论补充", orientation: "portrait",
  },
  {
    id: "xhs-sanya-food", city: "三亚", platform: "小红书", title: "三亚无法超越的店：已吃版", creator: "用户提供笔记", duration: "4 张动态内容",
    poster: "/hainan/social-xhs-sanya-food-01.webp", sourceUrl: "https://xhslink.cn/o/2HxyZx28FWw", theme: "吃喝", format: "dynamic-note", watchFor: "个人实吃后的餐厅筛选", orientation: "portrait",
  },
  {
    id: "xhs-sanya-hotels", city: "三亚", platform: "小红书", title: "三亚四大湾区海景酒店动态对比", creator: "用户提供笔记", duration: "13 张 Live Photo",
    poster: "/hainan/social-xhs-sanya-hotels-01.webp", sourceUrl: "https://xhslink.cn/o/6gqXrkMD9Zk", theme: "酒店", format: "dynamic-note", watchFor: "房间开门见海、泳池和四个湾区风格", orientation: "portrait",
  },
  {
    id: "xhs-wanning-food", city: "万宁", platform: "小红书", title: "万宁无法超越的店：已吃版", creator: "用户提供笔记", duration: "4 张动态内容",
    poster: "/hainan/social-xhs-wanning-food-01.webp", sourceUrl: "https://www.xiaohongshu.com/explore/6a7070660000000025002e78?xsec_token=CBmz0SfFtHmk_f4oQ2cE0Syi6myVeaDZHS-UFAP3rABMU=&xsec_source=app_share", theme: "吃喝", format: "dynamic-note", watchFor: "石梅湾、兴隆与神州半岛顺路吃法", orientation: "portrait",
  },
];

export function socialVideosForCity(city: string) {
  return socialVideos.filter((video) => video.city === city || video.city === "全程");
}
