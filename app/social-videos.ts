export type SocialVideoCity = "海口" | "万宁" | "陵水" | "三亚" | "全程";
export type SocialVideoPlatform = "抖音" | "小红书";

export type SocialVideo = {
  id: string;
  city: SocialVideoCity;
  platform: SocialVideoPlatform;
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
    format: "video", watchFor: "骑楼老街动线、老爸茶与黄昏出发节奏", orientation: "landscape",
  },
  {
    id: "douyin-haikou-overview", city: "海口", platform: "抖音", title: "海南环岛游：海口景点大全", creator: "摄影师-蔺伟斌", duration: "约 5 分钟",
    poster: "/hainan/social-video-douyin-haikou-overview.webp", sourceUrl: "https://www.douyin.com/video/7576172727187328297", videoId: "7576172727187328297", embedUrl: douyinPlayer("7576172727187328297"),
    format: "video", watchFor: "交通、美食与住宿区域的整体取舍", orientation: "landscape",
  },
  {
    id: "douyin-wanning-coast", city: "万宁", platform: "抖音", title: "一天半解锁万宁海岸与兴隆咖啡", creator: "夜子的旅行记", duration: "17:48",
    poster: "/hainan/social-douyin-wanning-guide.webp", sourceUrl: "https://www.douyin.com/video/7536046961461710137", videoId: "7536046961461710137", embedUrl: douyinPlayer("7536046961461710137"),
    format: "video", watchFor: "神州半岛、石梅湾和兴隆植物园如何串联", orientation: "landscape",
  },
  {
    id: "douyin-lingshui-slow", city: "陵水", platform: "抖音", title: "陵水不是三亚平替：三天小众慢游", creator: "夜子的旅行记", duration: "约 6 分钟",
    poster: "/hainan/social-douyin-lingshui-guide.webp", sourceUrl: "https://www.douyin.com/video/7528654669166546233", videoId: "7528654669166546233", embedUrl: douyinPlayer("7528654669166546233"),
    format: "video", watchFor: "人少海岸、赶海与三天节奏", orientation: "landscape",
  },
  {
    id: "douyin-lingshui-overview", city: "陵水", platform: "抖音", title: "一条地图讲清陵水景点", creator: "摄影师-蔺伟斌", duration: "02:28",
    poster: "/hainan/social-douyin-lingshui-overview.webp", sourceUrl: "https://www.douyin.com/video/7589580983788260617", videoId: "7589580983788260617", embedUrl: douyinPlayer("7589580983788260617"),
    format: "video", watchFor: "香水湾、清水湾与南湾半岛的空间关系", orientation: "landscape",
  },
  {
    id: "douyin-clearwater-hotels", city: "陵水", platform: "抖音", title: "清水湾一线海景酒店实住盘点", creator: "大熊去哪儿", duration: "实住长评",
    poster: "/hainan/social-douyin-clearwater-hotels.webp", sourceUrl: "https://www.douyin.com/video/7524031678776446246", videoId: "7524031678776446246", embedUrl: douyinPlayer("7524031678776446246"),
    format: "video", watchFor: "航拍、第一视角、公区泳池和亲子设施", orientation: "landscape",
  },
  {
    id: "douyin-lingshui-hotel-family", city: "陵水", platform: "抖音", title: "三亚到陵水七天六晚酒店玩法", creator: "亲子酒店体验作者", duration: "竖屏攻略",
    poster: "/hainan/social-video-douyin-lingshui-hotel-family.webp", sourceUrl: "https://www.douyin.com/video/7551344216913038652", videoId: "7551344216913038652", embedUrl: douyinPlayer("7551344216913038652"),
    format: "video", watchFor: "酒店公区、海岸、泳池与换酒店成本", orientation: "portrait",
  },
  {
    id: "douyin-sanya-overview", city: "三亚", platform: "抖音", title: "三亚景点与湾区酒店怎么选", creator: "摄影师-蔺伟斌", duration: "04:18",
    poster: "/hainan/social-douyin-sanya-overview.webp", sourceUrl: "https://www.douyin.com/video/7595562347549166854", videoId: "7595562347549166854", embedUrl: douyinPlayer("7595562347549166854"),
    format: "video", watchFor: "四大湾区、景点分布、餐饮和住宿差异", orientation: "landscape",
  },
  {
    id: "douyin-sanya-lingshui", city: "三亚", platform: "抖音", title: "三亚与陵水三天小众路线", creator: "汐汐妈妈", duration: "约 3 分钟",
    poster: "/hainan/social-video-douyin-sanya-lingshui.webp", sourceUrl: "https://www.douyin.com/video/7522080445657615655", videoId: "7522080445657615655", embedUrl: douyinPlayer("7522080445657615655"),
    format: "video", watchFor: "淡季感、人少海岸和亲子活动密度", orientation: "landscape",
  },
  {
    id: "douyin-eastline-family", city: "全程", platform: "抖音", title: "海南东线七天小众自驾路线", creator: "汐汐妈妈", duration: "路线总览",
    poster: "/hainan/social-video-douyin-eastline-family.webp", sourceUrl: "https://www.douyin.com/video/7582054137073913088", videoId: "7582054137073913088", embedUrl: douyinPlayer("7582054137073913088"),
    format: "video", watchFor: "海口到三亚不走回头路的东线结构", orientation: "landscape",
  },
  {
    id: "xhs-sanya-pretrip", city: "三亚", platform: "小红书", title: "下周出发去三亚：行前清单动态笔记", creator: "用户提供笔记", duration: "8 张动态内容",
    poster: "/hainan/social-xhs-sanya-pretrip-01.webp", sourceUrl: "https://xhslink.cn/o/6QybMpO8y3I", format: "dynamic-note", watchFor: "景点、购买清单与本地评论补充", orientation: "portrait",
  },
  {
    id: "xhs-sanya-food", city: "三亚", platform: "小红书", title: "三亚无法超越的店：已吃版", creator: "用户提供笔记", duration: "4 张动态内容",
    poster: "/hainan/social-xhs-sanya-food-01.webp", sourceUrl: "https://xhslink.cn/o/2HxyZx28FWw", format: "dynamic-note", watchFor: "个人实吃后的餐厅筛选", orientation: "portrait",
  },
  {
    id: "xhs-sanya-hotels", city: "三亚", platform: "小红书", title: "三亚四大湾区海景酒店动态对比", creator: "用户提供笔记", duration: "13 张 Live Photo",
    poster: "/hainan/social-xhs-sanya-hotels-01.webp", sourceUrl: "https://xhslink.cn/o/6gqXrkMD9Zk", format: "dynamic-note", watchFor: "房间开门见海、泳池和四个湾区风格", orientation: "portrait",
  },
  {
    id: "xhs-wanning-food", city: "万宁", platform: "小红书", title: "万宁无法超越的店：已吃版", creator: "用户提供笔记", duration: "4 张动态内容",
    poster: "/hainan/social-xhs-wanning-food-01.webp", sourceUrl: "https://www.xiaohongshu.com/explore/6a7070660000000025002e78?xsec_token=CBmz0SfFtHmk_f4oQ2cE0Syi6myVeaDZHS-UFAP3rABMU=&xsec_source=app_share", format: "dynamic-note", watchFor: "石梅湾、兴隆与神州半岛顺路吃法", orientation: "portrait",
  },
];

export function socialVideosForCity(city: string) {
  return socialVideos.filter((video) => video.city === city || video.city === "全程");
}
