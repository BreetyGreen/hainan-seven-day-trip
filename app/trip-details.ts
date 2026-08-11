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

export const userResearchSources: ResearchSource[] = [
  { id: "sanya-memo", title: "下周出发去三亚！！！", scope: "三亚备忘", url: sanyaMemo, note: "只把顺路饮品与糕点作为候选。" },
  { id: "sanya-food", title: "个人觉得三亚无法超越的店（已吃版）", scope: "三亚吃喝", url: sanyaFood, note: "用于 Day 6 顺路正餐，不以热度替代位置判断。" },
  { id: "sanya-hotels", title: "三亚下楼就是海景的酒店已整理好", scope: "酒店核验", url: sanyaHotels, note: "用于比较湾区位置，不采用笔记即时价格。" },
  { id: "lingshui-harbor", title: "海陆之间：陵水新村的疍家文明与生命脉动", scope: "陵水活动", url: xincunResearch, note: "用于新村港和疍家渔排半日。" },
];

const mapFood = (name: string, area: string, when: string, order: string[], reason: string, query: string): FoodStop => ({
  name,
  area,
  when,
  order,
  reason,
  sourceUrl: `https://www.amap.com/search?query=${encodeURIComponent(query)}`,
  sourceLabel: `地图核验 · ${area}`,
});

export const dayGuides: DayGuide[] = [
  {
    dayId: 1,
    headline: "抵达日先入住，再决定是否去骑楼",
    rhythm: ["机场取车", "酒店放行李", "骑楼慢走与海南落地餐"],
    foodStops: [mapFood("骑楼现选海南粉／老爸茶", "海口骑楼", "航班准点才去", ["海南粉或抱罗粉", "一份清补凉"], "第一顿落在真实街区，但不绑定排队店。", "海口骑楼老街老爸茶")],
  },
  {
    dayId: 2,
    headline: "跨城日只做南下和入住",
    rhythm: ["海口慢早餐", "服务区休息一次", "下午核对陵水海景房"],
    foodStops: [mapFood("海口老爸茶早餐", "海口市区", "10:00 前离店", ["蒸点", "粉面", "咖啡或茶"], "先吃饱再上高速，不把午饭变成打卡任务。", "海口老爸茶")],
  },
  {
    dayId: 3,
    headline: "新村港一个半日，下午回海景房",
    rhythm: ["正规码头问船班", "看疍家渔排", "新村镇午饭后返酒店"],
    foodStops: [mapFood("新村镇明码标价午饭", "陵水新村镇", "乘船前后按班次调整", ["陵水酸粉或汤粉", "清蒸海鲜", "一份青菜"], "就在港口片区解决，不为网红海鲜店绕路。", "陵水新村港餐厅")],
  },
  {
    dayId: 4,
    headline: "酒店日不靠景点数量证明来过",
    rhythm: ["海景早餐", "海岸与泳池", "中午回房避晒", "傍晚再看海"],
    foodStops: [mapFood("酒店或土福湾附近简餐", "陵水土福湾", "午间避晒时", ["汤粉或炒饭", "椰子水", "清淡蔬菜"], "不为一顿饭离开度假节奏。", "陵水土福湾餐厅")],
    optional: { title: "分界洲岛可选分支", detail: "仅当天海况良好且两人都想上岛时启用；默认路线不播放。", sourceUrl: "https://www.hnlingshui.gov.cn/" },
  },
  {
    dayId: 5,
    headline: "第二次换宿后只使用酒店",
    rhythm: ["睡到自然醒", "午饭后短途南下", "索菲特园林和海边"],
    foodStops: [mapFood("海棠湾顺路海南菜", "三亚海棠湾", "入住前或晚饭", ["文昌鸡小份", "四角豆", "椰子饭"], "选择距离酒店近、可提前看排队的店。", "三亚海棠湾海南菜")],
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
    }],
  },
  {
    dayId: 7,
    headline: "返程日只做早餐、还车和登机",
    rhythm: ["酒店早餐", "退房装车", "加油还车", "机场托运"],
    foodStops: [mapFood("酒店早餐与机场简餐", "海棠湾至凤凰机场", "按航班时间", ["酒店早餐", "随身水和小点心"], "返程不为餐厅增加误机风险。", "三亚凤凰机场餐饮")],
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
