export type ResearchSource = {
  id: string;
  title: string;
  scope: "三亚吃喝" | "陵水活动" | "酒店核验" | "三亚备忘";
  url: string;
  note: string;
};

export type FoodStop = {
  name: string;
  area: string;
  when: string;
  order: string[];
  reason: string;
  sourceUrl: string;
  sourceLabel: string;
  mapUrl: string;
  caution: string;
  evidence: {
    kind: "high-engagement" | "user-note" | "map-verified" | "hotel-plan";
    label: string;
    engagement?: number;
  };
};

export type DayGuide = {
  dayId: number;
  headline: string;
  rhythm: string[];
  foodStops: FoodStop[];
  optional?: { title: string; detail: string; sourceUrl: string };
};

export type HotelBayGuide = {
  bay: "三亚湾" | "大东海" | "亚龙湾" | "海棠湾";
  fit: string;
  tradeoff: string;
  examples: string[];
};

const sanyaMemo = "https://xhslink.cn/o/6QybMpO8y3I";
const sanyaFood = "https://xhslink.cn/o/2HxyZx28FWw";
const sanyaHotels = "https://xhslink.cn/o/6gqXrkMD9Zk";
const xincunResearch = "https://www.xiaohongshu.com/search_result/6a71b3a50000000021020fc8";
const sangemOfficial = "https://www.sangemmoon.com/";
const haikouHighEngagement = "https://www.xiaohongshu.com/explore/69f27160000000003803675c";
const lingshuiHighEngagement = "https://www.xiaohongshu.com/explore/6969f4c9000000002102b785";

export const userResearchSources: ResearchSource[] = [
  { id: "sanya-memo", title: "下周出发去三亚！！！", scope: "三亚备忘", url: sanyaMemo, note: "只把顺路饮品与糕点作为候选。" },
  { id: "sanya-food", title: "个人觉得三亚无法超越的店（已吃版）", scope: "三亚吃喝", url: sanyaFood, note: "用于 Day 6 顺路正餐，不以热度替代位置判断。" },
  { id: "sanya-hotels", title: "三亚下楼就是海景的酒店已整理好", scope: "酒店核验", url: sanyaHotels, note: "用于比较湾区位置，不采用笔记即时价格。" },
  { id: "lingshui-harbor", title: "海陆之间：陵水新村的疍家文明与生命脉动", scope: "陵水活动", url: xincunResearch, note: "用于新村港和疍家渔排半日。" },
];

const mapFood = (name: string, area: string, when: string, order: string[], reason: string, query: string, caution = "营业时间和当天排队请出发前再核对。", kind: FoodStop["evidence"]["kind"] = "map-verified"): FoodStop => ({
  name,
  area,
  when,
  order,
  reason,
  sourceUrl: `https://www.amap.com/search?query=${encodeURIComponent(query)}`,
  sourceLabel: `地图核验 · ${area}`,
  mapUrl: `https://www.amap.com/search?query=${encodeURIComponent(query)}`,
  caution,
  evidence: { kind, label: kind === "hotel-plan" ? "住宿日节奏安排" : "地图位置核验" },
});

const researchedFood = (stop: Omit<FoodStop, "mapUrl"> & { mapQuery: string }): FoodStop => {
  const { mapQuery, ...rest } = stop;
  return { ...rest, mapUrl: `https://www.amap.com/search?query=${encodeURIComponent(mapQuery)}` };
};

export const dayGuides: DayGuide[] = [
  {
    dayId: 1,
    headline: "抵达日先入住，再决定是否去骑楼",
    rhythm: ["机场取车", "酒店放行李", "骑楼慢走与海南落地餐"],
    foodStops: [researchedFood({
      name: "恒兴发老爸茶店", area: "海口骑楼 · 水巷口一线", when: "航班准点、放完行李再去",
      order: ["一壶茶", "蒸点或炸面包", "清补凉"],
      reason: "位于骑楼扫街动线上，可把水巷口、姚记辣汤饭和西天庙串成一段步行，不额外折返。",
      caution: "高互动笔记同时提示骑楼整体略贵；吴日彪炸排骨被评论指出偏硬，本计划不列为必吃。",
      sourceUrl: haikouHighEngagement, sourceLabel: "小红书高互动扫街攻略 · 约 1394 互动",
      evidence: { kind: "high-engagement", label: "小红书高互动笔记 · 约 1394 互动", engagement: 1394 },
      mapQuery: "海口 恒兴发老爸茶店",
    })],
  },
  {
    dayId: 2,
    headline: "跨城日只做南下和入住",
    rhythm: ["海口慢早餐", "服务区休息一次", "下午核对陵水海景房"],
    foodStops: [researchedFood({
      name: "姚记辣汤饭", area: "海口水巷口", when: "08:00 左右，吃完直接取车南下",
      order: ["辣汤饭小份", "腊肠或煎蛋二选一"],
      reason: "同一篇骑楼高互动攻略的起点店，早餐后上高速，不把午饭变成打卡任务。",
      caution: "胡椒味重；怕辣或航班晚到时，改酒店早餐，不硬赶。",
      sourceUrl: haikouHighEngagement, sourceLabel: "小红书高互动扫街攻略 · 约 1394 互动",
      evidence: { kind: "high-engagement", label: "小红书高互动笔记 · 约 1394 互动", engagement: 1394 },
      mapQuery: "海口 姚记辣汤饭 水巷口",
    })],
  },
  {
    dayId: 3,
    headline: "新村港一个半日，下午回海景房",
    rhythm: ["正规码头问船班", "看疍家渔排", "新村镇午饭后返酒店"],
    foodStops: [researchedFood({
      name: "英姐酸粉热粉", area: "陵水新村镇", when: "乘船前后按班次调整",
      order: ["陵水酸粉", "热粉或汤粉二选一", "清补凉"],
      reason: "803 互动的陵水合集明确列名，落在新村镇活动片区，吃完即可回酒店。",
      caution: "评论反馈酸粉已涨价；按现场菜单点小份。合集中的 87 号渔船和徐福记出现预制、溢价反馈，本计划剔除。",
      sourceUrl: lingshuiHighEngagement, sourceLabel: "小红书高互动陵水合集 · 约 803 互动",
      evidence: { kind: "high-engagement", label: "小红书高互动笔记 · 约 803 互动", engagement: 803 },
      mapQuery: "陵水 新村 英姐酸粉热粉",
    })],
  },
  {
    dayId: 4,
    headline: "酒店日不靠景点数量证明来过",
    rhythm: ["海景早餐", "海岸与泳池", "中午回房避晒", "傍晚再看海"],
    foodStops: [mapFood("酒店或土福湾附近简餐", "陵水土福湾", "午间避晒时", ["汤粉或炒饭", "椰子水", "清淡蔬菜"], "不为一顿饭离开度假节奏。", "陵水土福湾餐厅", "这是刻意留白的住宿日，不把高赞餐厅当任务；先看酒店当日菜单。", "hotel-plan")],
    optional: { title: "分界洲岛可选分支", detail: "仅当天海况良好且两人都想上岛时启用；默认路线不播放。", sourceUrl: "https://www.hnlingshui.gov.cn/" },
  },
  {
    dayId: 5,
    headline: "第二次换宿后只使用酒店",
    rhythm: ["睡到自然醒", "午饭后短途南下", "索菲特园林和海边"],
    foodStops: [mapFood("海棠湾顺路海南菜", "三亚海棠湾", "入住前或晚饭", ["文昌鸡小份", "四角豆", "椰子饭"], "换宿日优先距离索菲特近、可停车的店；当天不跨湾追热店。", "三亚海棠湾海南菜", "目前只有位置核验，不冒充小红书高赞店；若入住后不想再开车，直接在酒店吃。")],
  },
  {
    dayId: 6,
    headline: "三亚只走一条安静海岸线",
    rhythm: ["小东海慢走", "帆船港午饭与降温", "鹿回头日落", "回海棠湾"],
    foodStops: [{
      name: "正合中西茶店",
      area: "三亚市区",
      when: "小东海结束后、是否顺路再决定",
      order: ["腌面", "炸鸡翅", "冰豆花"],
      reason: "用作城市日中段休息，不为了餐厅横穿三亚。",
      sourceUrl: sanyaFood,
      sourceLabel: "用户提供笔记 · 三亚已吃版",
      mapUrl: `https://www.amap.com/search?query=${encodeURIComponent("三亚 正合中西茶店")}`,
      caution: "用户笔记当前能核验标题与作者，但正文互动数据未完整加载，因此标为‘用户收藏’，不标高赞。",
      evidence: { kind: "user-note", label: "你提供的小红书已吃笔记" },
    }],
  },
  {
    dayId: 7,
    headline: "返程日只做早餐、还车和登机",
    rhythm: ["酒店早餐", "退房装车", "加油还车", "机场托运"],
    foodStops: [mapFood("酒店早餐与机场简餐", "海棠湾至凤凰机场", "按航班时间", ["酒店早餐", "随身水和小点心"], "返程不为餐厅增加误机风险。", "三亚凤凰机场餐饮", "返程餐只服务于准时到机场，不安排额外高赞店。", "hotel-plan")],
    optional: { title: "顺路才买的饮品与糕点", detail: "用户收藏的五号手作、老盐季和斑斓故事只在导航显示顺路且时间充足时考虑。", sourceUrl: sanyaMemo },
  },
];

export const hotelBayGuide: HotelBayGuide[] = [
  { bay: "三亚湾", fit: "机场和城市餐饮便利。", tradeoff: "从陵水南下后还要继续穿城，不符合这版慢节奏。", examples: ["海韵度假", "皇冠假日"] },
  { bay: "大东海", fit: "靠近小东海、鹿回头和城市生活。", tradeoff: "公共海滩和市区客流更多，纯度假感弱。", examples: ["半山半岛洲际", "山海天JW万豪"] },
  { bay: "亚龙湾", fit: "成熟海湾和沙滩体验完整。", tradeoff: "与陵水衔接不如海棠湾顺，酒店房价需单独比较。", examples: ["亚龙湾希尔顿", "美高梅"] },
  { bay: "海棠湾", fit: "从陵水顺路入住，适合连住两晚并留出酒店时间。", tradeoff: "去小东海和鹿回头约一小时，所以只安排一个城市日。", examples: ["理文索菲特", "开维费尔蒙", "阳光壹"] },
];

export function getDayGuide(dayId: number) {
  return dayGuides.find((guide) => guide.dayId === dayId);
}

export const hotelComparisonSources = { sangemOfficial, sanyaHotels };
