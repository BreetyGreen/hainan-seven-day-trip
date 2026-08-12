export type ResearchSource = {
  id: string;
  title: string;
  scope: "三亚吃喝" | "陵水活动" | "酒店核验" | "三亚备忘";
  url: string;
  note: string;
};

export type ResearchSummary = {
  scannedCards: number;
  deepReads: number;
  queryGroups: string[];
  conclusion: string;
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

const sanyaMemo = "https://xhslink.cn/o/6QybMpO8y3I";
const sanyaFood = "https://xhslink.cn/o/2HxyZx28FWw";
const sanyaHotels = "https://xhslink.cn/o/6gqXrkMD9Zk";
const xincunResearch = "https://www.xiaohongshu.com/search_result/6a71b3a50000000021020fc8";
const sangemOfficial = "https://www.sangemmoon.com/";
const haikouHighEngagement = "https://www.xiaohongshu.com/explore/69f27160000000003803675c";
const lingshuiHighEngagement = "https://www.xiaohongshu.com/explore/6969f4c9000000002102b785";
const wanningHighEngagement = "https://www.xiaohongshu.com/search_result?keyword=%E4%B8%87%E5%AE%81%E7%BA%AF%E5%9C%9F%E8%91%97%E5%BF%85%E5%90%8318%E5%AE%B6%E8%80%81%E5%BA%97";

export const researchSummary: ResearchSummary = {
  scannedCards: 150,
  deepReads: 21,
  queryGroups: ["海南东线 7 天慢游", "海口／陵水／三亚吃住", "万宁安静海景酒店", "万宁小众玩法", "万宁本地老店", "万宁—陵水少折返"],
  conclusion: "万宁值得住两晚；用神州半岛做基地、石梅湾与兴隆组成短线，比把日月湾网红店逐个打卡更符合安静慢游。",
};

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
    headline: "跨城日只做南下，并真正住进万宁",
    rhythm: ["海口慢早餐", "G98 服务区休息一次", "下午核对万宁海景房", "神州半岛短日落"],
    foodStops: [researchedFood({
      name: "姚记辣汤饭", area: "海口水巷口", when: "08:00 左右，吃完直接取车南下",
      order: ["辣汤饭小份", "腊肠或煎蛋二选一"],
      reason: "同一篇骑楼高互动攻略的起点店，早餐后上高速去万宁，不把午饭变成打卡任务。",
      caution: "胡椒味重；怕辣或航班晚到时，改酒店早餐，不硬赶。",
      sourceUrl: haikouHighEngagement, sourceLabel: "小红书高互动扫街攻略 · 约 1394 互动",
      evidence: { kind: "high-engagement", label: "小红书高互动笔记 · 约 1394 互动", engagement: 1394 },
      mapQuery: "海口 姚记辣汤饭 水巷口",
    })],
  },
  {
    dayId: 3,
    headline: "万宁只走一条短线：石梅湾＋兴隆",
    rhythm: ["石梅湾慢走", "兴隆市场与老味午饭", "午后回君悦休息", "神州半岛傍晚"],
    foodStops: [researchedFood({
      name: "兴隆南洋风味／吴记后安粉汤", area: "万宁兴隆", when: "石梅湾后 12:00–13:30",
      order: ["后安粉汤", "菠萝包或咖啡糕", "当季水果小份"],
      reason: "2673 互动的万宁本地老店合集与 697 互动的真实榜单都把兴隆、后安粉和南洋点心列为主线，比跨湾排网红咖啡更顺路。",
      caution: "兴隆南洋风味热门时可能排队；排队过长就进市场选明码标价摊位，不为一家店耗掉下午。",
      sourceUrl: wanningHighEngagement, sourceLabel: "小红书万宁本地老店合集 · 约 2673 互动",
      evidence: { kind: "high-engagement", label: "小红书高互动笔记 · 约 2673 互动", engagement: 2673 },
      mapQuery: "万宁 兴隆华侨农贸市场 后安粉",
    })],
  },
  {
    dayId: 4,
    headline: "万宁退房后顺路看新村港，再住清水湾",
    rhythm: ["万宁退房", "新村港正规码头", "新村镇午饭", "单向南下入住清水湾"],
    foodStops: [researchedFood({
      name: "英姐酸粉热粉", area: "陵水新村镇", when: "乘船前后按班次调整",
      order: ["陵水酸粉", "热粉或汤粉二选一", "清补凉"],
      reason: "803 互动的陵水合集明确列名，正好落在新村港活动片区，吃完继续向南去清水湾。",
      caution: "评论反馈酸粉已涨价；按现场菜单点小份。合集中的 87 号渔船和徐福记出现预制、溢价反馈，本计划剔除。",
      sourceUrl: lingshuiHighEngagement, sourceLabel: "小红书高互动陵水合集 · 约 803 互动",
      evidence: { kind: "high-engagement", label: "小红书高互动笔记 · 约 803 互动", engagement: 803 },
      mapQuery: "陵水 新村 英姐酸粉热粉",
    })],
    optional: { title: "停航就删乘船", detail: "大风或雷雨时只保留新村镇午饭，持续降雨则从万宁直接去清水湾。", sourceUrl: "https://www.hnlingshui.gov.cn/" },
  },
  {
    dayId: 5,
    headline: "清水湾留白日不靠景点数量证明来过",
    rhythm: ["海景早餐", "海岸或泳池", "中午回房避晒", "傍晚再决定是否出门"],
    foodStops: [mapFood("酒店或清水湾附近简餐", "陵水清水湾", "午间避晒时", ["汤粉或炒饭", "椰子水", "清淡蔬菜"], "不为一顿饭离开度假节奏。", "陵水清水湾餐厅", "这是刻意留白的住宿日，不把高赞餐厅当任务；先看酒店当日菜单。", "hotel-plan")],
  },
  {
    dayId: 6,
    headline: "免税采购集中到一段，结束后回同一家陵水酒店",
    rhythm: ["陵水酒店慢早餐", "20–60 分钟到免税城", "14:30–18:30 按清单采购", "原路返回陵水基地"],
    foodStops: [mapFood("免税城内简餐或回酒店晚饭", "海棠湾免税城／陵水酒店", "采购中段或返程后", ["粉面或简餐", "清淡蔬菜", "补水"], "不为了高赞餐厅横穿市区，也不再增加一次换宿；采购后直接回熟悉的房间。", "三亚国际免税城 餐饮", "免税城营业、品牌库存和机场提货时限以出发周中免 App 为准。", "hotel-plan")],
  },
  {
    dayId: 7,
    headline: "返程日只做早餐、还车和登机",
    rhythm: ["酒店早餐", "退房装车", "加油还车", "机场托运"],
    foodStops: [mapFood("酒店早餐与机场简餐", "陵水酒店至凤凰机场", "按航班时间", ["酒店早餐", "随身水和小点心"], "返程不为餐厅增加误机风险。", "三亚凤凰机场餐饮", "返程餐只服务于准时到机场，不安排额外高赞店。", "hotel-plan")],
    optional: { title: "顺路才买的饮品与糕点", detail: "用户收藏的五号手作、老盐季和斑斓故事只在导航显示顺路且时间充足时考虑。", sourceUrl: sanyaMemo },
  },
];

export function getDayGuide(dayId: number) {
  return dayGuides.find((guide) => guide.dayId === dayId);
}

export const hotelComparisonSources = { sangemOfficial, sanyaHotels };
