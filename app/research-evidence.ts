export type ResearchCategory = "吃" | "穿" | "住" | "行" | "玩";
export type ResearchSourceType = "小红书" | "携程" | "酒店官网" | "景区官网" | "地图" | "天气";

export type ResearchEvidence = {
  sourceId: string;
  category: ResearchCategory;
  city: string;
  entityIds: string[];
  sourceType: ResearchSourceType;
  title: string;
  author: string;
  url: string;
  publishedAt?: string;
  engagementSnapshot?: {
    likes?: number;
    collects?: number;
    comments?: number;
    shares?: number;
    capturedAt: string;
  };
  claims: string[];
  promoRisk: { level: "低" | "中" | "高"; reason: string };
  media: Array<{ url: string; kind: "image" | "video"; entityId?: string }>;
  verifiedAt: string;
  deepRead: boolean;
};

const verifiedAt = "2026-08-14";
const lowRisk = { level: "低", reason: "官方、地图或气象事实来源；仍需在出发前复核易变化信息。" } as const;
const mediumRisk = { level: "中", reason: "旅行体验或检索线索，可能存在滤镜、个体偏好或商业合作。" } as const;

function evidence(input: Omit<ResearchEvidence, "verifiedAt" | "media" | "claims" | "promoRisk"> & Partial<Pick<ResearchEvidence, "media" | "claims" | "promoRisk">>): ResearchEvidence {
  return {
    verifiedAt,
    media: [],
    claims: [],
    promoRisk: input.sourceType === "小红书" ? mediumRisk : lowRisk,
    ...input,
  };
}

const xhsNote = (sourceId: string, title: string, author: string, url: string, city: string, entityIds: string[], category: ResearchCategory = "玩", deepRead = true) => evidence({
  sourceId,
  title,
  author,
  url,
  city,
  entityIds,
  category,
  sourceType: "小红书",
  deepRead,
  claims: ["用于识别真实体验、路线取舍、画面风格和常见踩坑点，不单独支撑价格或营业规则。"],
});

const mapCandidate = (sourceId: string, title: string, city: string, entityIds: string[], category: ResearchCategory, deepRead = false) => evidence({
  sourceId,
  title,
  author: "高德地图检索",
  url: `https://www.amap.com/search?query=${encodeURIComponent(`${city} ${title}`)}`,
  city,
  entityIds,
  category,
  sourceType: "地图",
  deepRead,
  claims: ["用于核对地点存在、所在区域和与行程节点的相对位置。"],
});

const officialCandidate = (sourceId: string, title: string, url: string, city: string, entityIds: string[], category: ResearchCategory, sourceType: "酒店官网" | "景区官网" | "天气", deepRead = true) => evidence({
  sourceId,
  title,
  author: sourceType,
  url,
  city,
  entityIds,
  category,
  sourceType,
  deepRead,
  claims: [sourceType === "酒店官网" ? "用于核验酒店身份、房型、设施、地址与预订规则。" : sourceType === "天气" ? "用于制定九月高温、降雨、台风和紫外线退路。" : "用于核验地点身份、开放规则与安全提示。"],
});

const fourBayMedia = [
  "https://sns-webpic-qc.xhscdn.com/202608141040/9b73c3744f53e7caadace875038724de/1040g2sg323op983a74e05ni99ggg9993kmt3qm8!nd_dft_wlteh_jpg_3",
  "https://sns-webpic-qc.xhscdn.com/202608141040/aceb82d9f82fa1e78e674cf931eb07d6/1040g2sg323op983a74eg5ni99ggg9993q2spj20!nd_dft_wlteh_jpg_3",
  "https://sns-webpic-qc.xhscdn.com/202608141040/93f1a4aa87c5541bb687662fcdcb762d/1040g2sg323op983a74f05ni99ggg9993os4u71o!nd_dft_wlteh_jpg_3",
  "https://sns-webpic-qc.xhscdn.com/202608141040/91b57fc05af4983e3f4704810c11d6ee/1040g2sg323op983a74fg5ni99ggg9993udotpg8!nd_dft_wlteh_jpg_3",
  "https://sns-webpic-qc.xhscdn.com/202608141040/9a5014ace72955aa85043c588f36e22d/1040g2sg323op983a74g05ni99ggg9993osigvto!nd_dft_wlteh_jpg_3",
  "https://sns-webpic-qc.xhscdn.com/202608141040/938665e97630b79450116cd5e247ac7f/1040g2sg323op983a74gg5ni99ggg9993a39vong!nd_dft_wlteh_jpg_3",
  "https://sns-webpic-qc.xhscdn.com/202608141040/4dd6159f3f46069af984eacf4f969174/1040g2sg323op983a74h05ni99ggg9993hu9vin0!nd_dft_wlteh_jpg_3",
  "https://sns-webpic-qc.xhscdn.com/202608141040/b5d7149a5343bc858a20c7ca449a3ecf/1040g2sg323op983a74hg5ni99ggg9993eof3li0!nd_dft_wlteh_jpg_3",
  "https://sns-webpic-qc.xhscdn.com/202608141040/1014755f8f5e7e4592f79575e3315994/1040g2sg323op983a74i05ni99ggg99939k6gh5g!nd_dft_wlteh_jpg_3",
  "https://sns-webpic-qc.xhscdn.com/202608141040/11b7d3759b92f7e98bbe2b5072b28dd1/1040g2sg323op983a74ig5ni99ggg9993p3obnb8!nd_dft_wlteh_jpg_3",
  "https://sns-webpic-qc.xhscdn.com/202608141040/93e1c8e6ce823909e6fafd9d60300ed2/1040g2sg323op983a74j05ni99ggg99934d114og!nd_dft_wlteh_jpg_3",
].map((url) => ({ url, kind: "image" as const }));

const xhsEvidence: ResearchEvidence[] = [
  evidence({
    sourceId: "xhs-6a7c01e500000000220162ab",
    category: "住",
    city: "三亚",
    entityIds: ["sanya-bay", "dadonghai", "yalong-bay", "haitang-bay"],
    sourceType: "小红书",
    title: "终于懂了三亚四大湾区怎么选酒店了",
    author: "不仔客海鲜海棠湾店老板",
    url: "https://xhslink.cn/o/9KpnK2iLckR",
    engagementSnapshot: { likes: 545, collects: 779, comments: 34, shares: 213, capturedAt: verifiedAt },
    claims: ["四张湾区酒店分布图", "四张酒店候选矩阵", "住宿、交通与美食备忘"],
    promoRisk: { level: "高", reason: "作者为餐厅商家账号，美食部分包含自家餐厅推荐；酒店分布只作候选线索。" },
    media: fourBayMedia,
    deepRead: true,
  }),
  xhsNote("xhs-6gqXrkMD9Zk", "三亚下楼就是海景的酒店已整理好（四大湾区）", "会飞的椰子树", "https://xhslink.cn/o/6gqXrkMD9Zk", "三亚", ["sanya-bay", "dadonghai", "yalong-bay", "haitang-bay"], "住"),
  xhsNote("xhs-2HxyZx28FWw", "个人觉得三亚无法超越的店（已吃版）", "菠萝", "https://xhslink.cn/o/2HxyZx28FWw", "三亚", ["sanya-food"], "吃"),
  xhsNote("xhs-6QybMpO8y3I", "下周出发去三亚！！！", "土豆泥", "https://xhslink.cn/o/6QybMpO8y3I", "三亚", ["sanya-food", "sanya-airport"], "吃"),
  xhsNote("xhs-6a7070660000000025002e78", "个人觉得万宁无法超越的店（已吃版）", "菠萝", "https://www.xiaohongshu.com/explore/6a7070660000000025002e78?xsec_token=CBmz0SfFtHmk_f4oQ2cE0Syi6myVeaDZHS-UFAP3rABMU=&xsec_source=app_share", "万宁", ["xinglong-market"], "吃"),
  xhsNote("xhs-6a689911000000000503abca", "海口骑楼老街夜景", "好运狗", "https://www.xiaohongshu.com/explore/6a689911000000000503abca", "海口", ["qilou"], "玩"),
  xhsNote("xhs-6a71b3a50000000021020fc8", "海陆之间：陵水新村的疍家文明与生命脉动", "金属滚儿", "https://www.xiaohongshu.com/explore/6a71b3a50000000021020fc8?xsec_token=ABNfxQl393g1AacquOmr5DSlmB3AvJ-BSJUQAbBh2PW98=&xsec_source=pc_search", "陵水", ["xincun-port"], "玩"),
  xhsNote("xhs-6a2b733d000000000802544e", "万宁三天两晚区域路线", "逍遥", "https://www.xiaohongshu.com/explore/6a2b733d000000000802544e?xsec_token=ABnAMbQdECihFgwj8XFK7U-wCbpQ1J-wwoBEVnkv4Jffg=&xsec_source=pc_search", "万宁", ["shimei-bay", "shenzhou-peninsula", "xinglong-market"], "玩"),
  xhsNote("xhs-69abee14000000000e03ce43", "万宁海岸真实体验", "卷卷心", "https://www.xiaohongshu.com/explore/69abee14000000000e03ce43?xsec_token=ABSflyHtUNEkaYDtjgaPlX72PUFu45v99A9k63R-lj7BI=&xsec_source=pc_search", "万宁", ["shimei-bay", "shenzhou-peninsula"], "玩"),
  xhsNote("xhs-6a79ad60000000002202c3da", "陵水疍家与清水湾", "双双和豆包", "https://www.xiaohongshu.com/explore/6a79ad60000000002202c3da?xsec_token=ABEYVGrdadig7lhyus-gD04BkuOPVf-Hy6-qwIwe-hTrE=&xsec_source=pc_search", "陵水", ["xincun-port", "clearwater-coast"], "玩"),
  xhsNote("xhs-6a657af900000000010307a4", "大东海顺路一日游", "拾渡", "https://www.xiaohongshu.com/explore/6a657af900000000010307a4?xsec_token=ABjP_9LUg4g5koaqlNXaxAnfNy0MdtakAWiSgcoDnPz0g=&xsec_source=pc_search", "三亚", ["dadonghai", "luhuitou"], "玩"),
  xhsNote("xhs-6a58f880000000000c016cc9", "三亚南山寺一日行程", "Hs", "https://www.xiaohongshu.com/explore/6a58f880000000000c016cc9?xsec_token=ABgVnlRa7lx1XJvA5igCtNbVyvMwGtTuUsOBXFxIU9o2A=&xsec_source=pc_search", "三亚", ["nanshan"], "玩"),
  xhsNote("xhs-6a786a36000000002202d176", "兴隆热带植物园", "lelll", "https://www.xiaohongshu.com/explore/6a786a36000000002202d176?xsec_token=ABIO4HwpNBtY6l6eMsts2GMRurtC85CNDkGP6x0YSnLgw=&xsec_source=pc_search", "万宁", ["xinglong-garden"], "玩"),
  xhsNote("xhs-68a31c74000000001d034617", "兴隆华侨农贸市场", "小z小c", "https://www.xiaohongshu.com/explore/68a31c74000000001d034617?xsec_token=ABunHxuUfqDwAh7GMtDNCNNm6pzUpzVsMMJkFeeaQYkkQ=&xsec_source=pc_search", "万宁", ["xinglong-market"], "吃"),
  xhsNote("xhs-69c4017c0000000023021eb9", "海口出发海南东线七天", "Coco妈咪", "https://www.xiaohongshu.com/explore/69c4017c0000000023021eb9?xsec_token=AB4JxORkYxfa1HXo3F0ea-suXVgj5PlSUBrAi833uvwm0=&xsec_source=pc_search", "海南", ["qilou", "shimei-bay", "clearwater-coast"], "行"),
  xhsNote("xhs-6a7602c6000000002c002627", "南山寺日出与海上观音", "Taurus旅拍日记", "https://www.xiaohongshu.com/explore/6a7602c6000000002c002627?xsec_token=ABCg0dBzZKFyzOO8xVpXPfvcSRmJTGehwX4ode7mcqkZ4=&xsec_source=pc_search", "三亚", ["nanshan"], "玩"),
  xhsNote("xhs-690489c200000000030373f2", "鹿回头城市与游艇港", "橙子", "https://www.xiaohongshu.com/explore/690489c200000000030373f2?xsec_token=ABPYKECHKPDzn0BspJC6xktJcDQUK21_QaF6vwwgG5c5E=&xsec_source=pc_search", "三亚", ["luhuitou", "banshan-marina"], "玩"),
  xhsNote("xhs-6a33dac0000000002100add2", "神州半岛君悦真实入住测评", "熠民", "https://www.xiaohongshu.com/explore/6a33dac0000000002100add2", "万宁", ["grand-hyatt-wanning"], "住"),
  xhsNote("xhs-68a893f3000000001c032dad", "海南酒店攻略：陵水三正月", "肥欧", "https://www.xiaohongshu.com/explore/68a893f3000000001c032dad", "陵水", ["sangem-moon"], "住"),
  xhsNote("xhs-search-haikou-marriott", "海口万豪酒店真实入住候选池", "小红书检索", "https://www.xiaohongshu.com/search_result?keyword=海口万豪酒店真实入住", "海口", ["haikou-marriott"], "住", false),
  xhsNote("xhs-search-haikou-west-coast-holiday", "海口西海岸假日酒店真实入住候选池", "小红书检索", "https://www.xiaohongshu.com/search_result?keyword=海口西海岸假日酒店真实入住", "海口", ["haikou-west-coast-holiday"], "住", false),
  xhsNote("xhs-search-wanning-holiday", "万宁神州半岛假日度假酒店真实入住候选池", "小红书检索", "https://www.xiaohongshu.com/search_result?keyword=万宁神州半岛假日度假酒店真实入住", "万宁", ["wanning-holiday-inn"], "住", false),
  xhsNote("xhs-search-clearwater-indigo", "海南清水湾英迪格酒店真实入住候选池", "小红书检索", "https://www.xiaohongshu.com/search_result?keyword=海南清水湾英迪格酒店真实入住", "陵水", ["clearwater-indigo"], "住", false),
];

const hotelOfficialEvidence: ResearchEvidence[] = [
  officialCandidate("hotel-haikou-marriott-overview", "海口万豪酒店", "https://www.marriott.com.cn/hotels/HAKMC-haikou-marriott-hotel/overview/", "海口", ["haikou-marriott"], "住", "酒店官网"),
  officialCandidate("hotel-haikou-marriott-rooms", "海口万豪酒店客房", "https://www.marriott.com.cn/hotels/hakmc-haikou-marriott-hotel/rooms/", "海口", ["haikou-marriott"], "住", "酒店官网"),
  officialCandidate("hotel-haikou-west-coast-holiday", "海口西海岸假日酒店", "https://www.ihg.com.cn/holidayinn/hotels/cn/zh/haikou/hakbh/hoteldetail", "海口", ["haikou-west-coast-holiday"], "住", "酒店官网"),
  officialCandidate("hotel-haikou-sheraton", "海口喜来登酒店", "https://www.marriott.com.cn/hotels/hakss-sheraton-haikou-hotel/overview/", "海口", ["haikou-sheraton"], "住", "酒店官网"),
  officialCandidate("hotel-grand-hyatt-wanning", "万宁神州半岛君悦酒店", "https://www.hyatt.com/grand-hyatt/zh-CN/shhgh-grand-hyatt-shenzhou-peninsula", "万宁", ["grand-hyatt-wanning"], "住", "酒店官网"),
  officialCandidate("hotel-wanning-holiday", "万宁神州半岛假日度假酒店", "https://www.ihg.com/holidayinnresorts/hotels/cn/zh/wanning/wxjsh/hoteldetail", "万宁", ["wanning-holiday-inn"], "住", "酒店官网"),
  officialCandidate("hotel-westin-shimei", "石梅湾威斯汀度假酒店", "https://www.marriott.com.cn/hotels/syxwi-the-westin-shimei-bay-resort/overview/", "万宁", ["westin-shimei"], "住", "酒店官网"),
  officialCandidate("hotel-le-meridien-shimei", "石梅湾艾美度假酒店", "https://www.marriott.com.cn/hotels/syxmd-le-meridien-shimei-bay-beach-resort-and-spa/overview/", "万宁", ["le-meridien-shimei"], "住", "酒店官网"),
  officialCandidate("hotel-clearwater-indigo", "海南清水湾英迪格酒店", "https://www.ihg.com.cn/hotelindigo/hotels/cn/zh/lingshui/lqswb/hoteldetail", "陵水", ["clearwater-indigo"], "住", "酒店官网"),
  officialCandidate("hotel-sangem-moon", "海南三正月酒店", "https://www.sangemmoon.com/", "陵水", ["sangem-moon"], "住", "酒店官网"),
  officialCandidate("hotel-sangem-rooms", "海南三正月酒店房型", "https://www.sangemmoon.com/room.html", "陵水", ["sangem-moon"], "住", "酒店官网"),
  officialCandidate("hotel-raffles-hainan", "海南清水湾雅居乐莱佛士酒店", "https://www.raffles.com/zh/hainan/", "陵水", ["raffles-hainan"], "住", "酒店官网"),
  officialCandidate("hotel-capella-tufu", "海南土福湾嘉佩乐度假酒店", "https://www.capellahotels.com/cn/zh/capella-hainan", "陵水", ["capella-tufu"], "住", "酒店官网"),
  officialCandidate("hotel-park-hyatt-sanya", "三亚太阳湾柏悦酒店", "https://www.hyatt.com/park-hyatt/zh-CN/sanph-park-hyatt-sanya-sunny-bay-resort", "三亚", ["yalong-bay", "park-hyatt-sanya"], "住", "酒店官网"),
  officialCandidate("hotel-sanya-marriott-yalong", "三亚亚龙湾万豪度假酒店", "https://www.marriott.com.cn/hotels/syxmc-sanya-marriott-yalong-bay-resort-and-spa/overview/", "三亚", ["yalong-bay", "sanya-marriott-yalong"], "住", "酒店官网"),
  officialCandidate("hotel-sofitel-sanya", "三亚理文索菲特度假酒店", "https://all.accor.com/hotel/8167/index.zh.shtml", "三亚", ["haitang-bay", "sofitel-sanya"], "住", "酒店官网"),
  officialCandidate("hotel-sheraton-haitang", "三亚海棠湾喜来登度假酒店", "https://www.marriott.com.cn/hotels/syxsb-sheraton-sanya-haitang-bay-resort/overview/", "三亚", ["haitang-bay", "sheraton-haitang"], "住", "酒店官网"),
  officialCandidate("hotel-jw-dadonghai", "三亚山海天JW万豪酒店", "https://www.marriott.com.cn/hotels/syxdb-jw-marriott-hotel-sanya-dadonghai-bay/overview/", "三亚", ["dadonghai", "jw-dadonghai"], "住", "酒店官网"),
];

const hotelMapEvidence = [
  ["haikou-marriott", "海口万豪酒店", "海口"],
  ["haikou-west-coast-holiday", "海口西海岸假日酒店", "海口"],
  ["haikou-sheraton", "海口喜来登酒店", "海口"],
  ["grand-hyatt-wanning", "万宁神州半岛君悦酒店", "万宁"],
  ["wanning-holiday-inn", "万宁神州半岛假日度假酒店", "万宁"],
  ["westin-shimei", "石梅湾威斯汀度假酒店", "万宁"],
  ["le-meridien-shimei", "石梅湾艾美度假酒店", "万宁"],
  ["clearwater-indigo", "海南清水湾英迪格酒店", "陵水"],
  ["sangem-moon", "海南三正月酒店", "陵水"],
  ["raffles-hainan", "海南清水湾雅居乐莱佛士酒店", "陵水"],
  ["capella-tufu", "海南土福湾嘉佩乐度假酒店", "陵水"],
  ["park-hyatt-sanya", "三亚太阳湾柏悦酒店", "三亚"],
  ["sanya-marriott-yalong", "三亚亚龙湾万豪度假酒店", "三亚"],
  ["sofitel-sanya", "三亚理文索菲特度假酒店", "三亚"],
  ["sheraton-haitang", "三亚海棠湾喜来登度假酒店", "三亚"],
  ["jw-dadonghai", "三亚山海天JW万豪酒店", "三亚"],
  ["sanya-bay", "三亚湾酒店带", "三亚"],
  ["haitang-bay", "海棠湾酒店带", "三亚"],
].map(([id, title, city], index) => mapCandidate(`map-hotel-${id}`, title, city, [id], "住", index < 7));

const foodCandidates = [
  ["haikou-hengxingfa", "恒兴发茶店", "海口"], ["haikou-xitianmiao", "西天庙小吃街", "海口"],
  ["haikou-shuixiangkou", "水巷口", "海口"], ["haikou-qilou-breakfast", "骑楼老街海南粉", "海口"],
  ["haikou-dadiao", "大刁老爸茶", "海口"], ["haikou-zhen-dafu", "甄大福老盐饮品", "海口"],
  ["wanning-wuji", "吴记后安粉汤", "万宁"], ["wanning-xindazhong", "新大众茶坊", "万宁"],
  ["wanning-yuanhuiji", "原辉记清补凉", "万宁"], ["wanning-gangjiao", "港角菠萝包", "万宁"],
  ["wanning-linjie", "林姐香味海鲜", "万宁"], ["wanning-xinglong-market-food", "兴隆华侨农贸市场小吃", "万宁"],
  ["lingshui-yingjie", "英姐酸粉热粉", "陵水"], ["lingshui-xincun-seafood", "新村港渔排海鲜", "陵水"],
  ["lingshui-clearwater-light", "清水湾轻食", "陵水"], ["lingshui-indigo-dining", "清水湾英迪格观海餐厅", "陵水"],
  ["lingshui-sangem-dining", "三正月明月宫", "陵水"], ["lingshui-tufu-local", "土福湾海南菜", "陵水"],
  ["sanya-buzai", "不仔客海鲜", "三亚"], ["sanya-aju", "阿菊冷饮", "三亚"],
  ["sanya-xinma", "馨妈儋州米烂", "三亚"], ["sanya-ating", "阿婷小吃店", "三亚"],
  ["sanya-qiongxiangge", "琼乡阁海南私房菜", "三亚"], ["sanya-xiaogao", "小高后安粉餐厅", "三亚"],
].map(([id, title, city], index) => mapCandidate(`map-food-${id}`, title, city, [id], "吃", index < 4));

const playEvidence: ResearchEvidence[] = [
  officialCandidate("play-qilou", "海口骑楼老街", "https://www.haikou.gov.cn/zfdt/ztbd/2022nzt/hkqljzlswhjq/", "海口", ["qilou"], "玩", "景区官网", true),
  officialCandidate("play-shimei-bay", "石梅湾生态修复", "https://www.mee.gov.cn/home/ztbd/2021/mlhwyxalzjhd/algs/hns2/202109/t20210906_900100.shtml", "万宁", ["shimei-bay"], "玩", "景区官网", true),
  officialCandidate("play-xinglong-garden", "兴隆热带植物园", "https://zhuanti.mct.gov.cn/csxz2022/hainan/detail/1528.html", "万宁", ["xinglong-garden"], "玩", "景区官网", true),
  officialCandidate("play-xincun-port", "陵水新村疍家文化", "https://www.hainan.gov.cn/hainan/c100641g/202310/639e14e4e6ef4ae997a117ba042a0d73.shtml", "陵水", ["xincun-port"], "玩", "景区官网", true),
  officialCandidate("play-cdf", "cdf三亚国际免税城", "https://www.ctgdutyfree.com.cn/detail/4340.html", "三亚", ["cdf-sanya"], "玩", "景区官网", false),
  officialCandidate("play-luhuitou", "鹿回头风景区", "https://www.visitsanya.com/zh/venue/%E9%B9%BF%E5%9B%9E%E5%A4%B4%E9%A3%8E%E6%99%AF%E5%8C%BA", "三亚", ["luhuitou"], "玩", "景区官网", false),
  officialCandidate("play-banshan-marina", "半山半岛帆船港", "https://www.visitsanya.com/zh/venue/%E4%B8%89%E4%BA%9A%E5%8D%8A%E5%B1%B1%E5%8D%8A%E5%B2%9B%E5%B8%86%E8%88%B9%E6%B8%AF", "三亚", ["banshan-marina"], "玩", "景区官网", false),
  officialCandidate("play-nanshan", "南山文化旅游区", "https://www.nanshan.com/", "三亚", ["nanshan"], "玩", "景区官网", false),
  officialCandidate("play-dadonghai", "大东海旅游区", "https://www.visitsanya.com/zh/venue/%E5%A4%A7%E4%B8%9C%E6%B5%B7", "三亚", ["dadonghai"], "玩", "景区官网", false),
  officialCandidate("play-haitang-bay", "海棠湾", "https://www.visitsanya.com/zh/experience/%E6%B5%B7%E6%A3%A0%E6%B9%BE", "三亚", ["haitang-bay"], "玩", "景区官网", false),
  mapCandidate("play-map-west-coast", "西海岸滨海带", "海口", ["haikou-west-coast"], "玩"),
  mapCandidate("play-map-shenzhou", "神州半岛海岸", "万宁", ["shenzhou-peninsula"], "玩"),
  mapCandidate("play-map-clearwater", "清水湾海岸", "陵水", ["clearwater-coast"], "玩"),
  mapCandidate("play-map-tufu", "土福湾海岸", "陵水", ["sangem-beach"], "玩"),
  mapCandidate("play-map-sanya-bay", "三亚湾椰梦长廊", "三亚", ["sanya-bay"], "玩"),
  mapCandidate("play-map-yalong", "亚龙湾公共海滩", "三亚", ["yalong-bay"], "玩"),
  mapCandidate("play-map-sunny-bay", "太阳湾公路", "三亚", ["yalong-bay"], "玩"),
  mapCandidate("play-map-houhai", "后海村", "三亚", ["haitang-bay"], "玩"),
  mapCandidate("play-map-wuzhizhou", "蜈支洲岛码头", "三亚", ["haitang-bay"], "玩"),
  mapCandidate("play-map-xinglong-market", "兴隆华侨农贸市场", "万宁", ["xinglong-market"], "玩"),
];

const weatherEvidence: ResearchEvidence[] = [
  officialCandidate("weather-hainan-home", "海南重要气象信息", "https://www.weather.com.cn/hainan/zyqxxx/index.shtml", "海南", ["trip-clothing"], "穿", "天气", true),
  officialCandidate("weather-hainan-forecast", "海南天气预报", "https://www.weather.com.cn/hainan/index.shtml", "海南", ["trip-clothing"], "穿", "天气", true),
  officialCandidate("weather-september-climate", "海南九月气候公报参考", "https://www.weather.com.cn/hainan/zyqxxx/10/2403100.shtml", "海南", ["trip-clothing"], "穿", "天气", true),
  officialCandidate("weather-autumn-typhoon", "秋台风科普", "https://www.cma.gov.cn/2011xwzx/2011xqxxw/2011xqxyw/202110/t20211030_4082002.html", "海南", ["trip-clothing"], "穿", "天气", true),
  officialCandidate("weather-haikou", "海口天气预报", "https://www.weather.com.cn/weather/101310101.shtml", "海口", ["day-1-clothing"], "穿", "天气", false),
  officialCandidate("weather-wanning", "万宁天气预报", "https://www.weather.com.cn/weather/101310215.shtml", "万宁", ["day-2-clothing", "day-3-clothing"], "穿", "天气", false),
  officialCandidate("weather-lingshui", "陵水天气预报", "https://www.weather.com.cn/weather/101310216.shtml", "陵水", ["day-4-clothing", "day-5-clothing", "day-6-clothing"], "穿", "天气", false),
  officialCandidate("weather-sanya", "三亚天气预报", "https://www.weather.com.cn/weathern/101310201.shtml", "三亚", ["day-7-clothing"], "穿", "天气", false),
];

const transportEvidence: ResearchEvidence[] = [
  mapCandidate("transport-wuhan-airport", "武汉天河国际机场", "武汉", ["wuhan-airport"], "行", true),
  mapCandidate("transport-haikou-airport", "海口美兰国际机场", "海口", ["haikou-airport"], "行", true),
  mapCandidate("transport-sanya-airport", "三亚凤凰国际机场", "三亚", ["sanya-airport"], "行", true),
  mapCandidate("transport-haikou-wanning", "海口万宁自驾路线", "海南", ["route-haikou-wanning"], "行", true),
  mapCandidate("transport-wanning-lingshui", "万宁陵水自驾路线", "海南", ["route-wanning-lingshui"], "行", false),
  mapCandidate("transport-lingshui-sanya", "陵水三亚凤凰机场自驾路线", "海南", ["route-lingshui-sanya"], "行", false),
  mapCandidate("transport-shimei-xinglong", "石梅湾兴隆自驾路线", "万宁", ["route-shimei-xinglong"], "行", false),
  mapCandidate("transport-clearwater-cdf", "清水湾免税城自驾路线", "陵水", ["route-clearwater-cdf"], "行", false),
  mapCandidate("transport-xincun-clearwater", "新村港清水湾自驾路线", "陵水", ["route-xincun-clearwater"], "行", false),
  mapCandidate("transport-haikou-parking", "海口西海岸停车", "海口", ["parking-haikou"], "行", false),
  mapCandidate("transport-wanning-parking", "神州半岛停车", "万宁", ["parking-wanning"], "行", false),
  mapCandidate("transport-sanya-return-car", "三亚凤凰机场租车还车", "三亚", ["return-car-sanya"], "行", false),
];

export const researchEvidence: ResearchEvidence[] = [
  ...xhsEvidence,
  ...hotelOfficialEvidence,
  ...hotelMapEvidence,
  ...foodCandidates,
  ...playEvidence,
  ...weatherEvidence,
  ...transportEvidence,
];

const uniqueSourceIds = new Set(researchEvidence.map((item) => item.sourceId));
const uniqueUrls = new Set(researchEvidence.map((item) => item.url));

export const researchMetrics = {
  candidateCount: researchEvidence.length,
  deepReadCount: researchEvidence.filter((item) => item.deepRead).length,
  independentSourceCount: uniqueSourceIds.size,
  independentUrlCount: uniqueUrls.size,
  byCategory: Object.fromEntries(["吃", "穿", "住", "行", "玩"].map((category) => [category, researchEvidence.filter((item) => item.category === category).length])) as Record<ResearchCategory, number>,
  verifiedAt,
};

export function evidenceForEntity(entityId: string) {
  return researchEvidence.filter((item) => item.entityIds.includes(entityId));
}
