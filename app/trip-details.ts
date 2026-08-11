export type ResearchSource = {
  id: string;
  title: string;
  scope: "三亚吃喝" | "万宁吃喝" | "三亚酒店" | "三亚备忘";
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
  optional?: {
    title: string;
    detail: string;
    sourceUrl: string;
  };
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
const wanningFood = "https://www.xiaohongshu.com/explore/6a7070660000000025002e78?xsec_token=CBmz0SfFtHmk_f4oQ2cE0Syi6myVeaDZHS-UFAP3rABMU=&xsec_source=app_share";

export const userResearchSources: ResearchSource[] = [
  {
    id: "sanya-memo",
    title: "下周出发去三亚！！！",
    scope: "三亚备忘",
    url: sanyaMemo,
    note: "用于补充饮品、糕点与出发前想买清单；只做候选，不把笔记热度当推荐理由。",
  },
  {
    id: "sanya-food",
    title: "个人觉得三亚无法超越的店（已吃版）",
    scope: "三亚吃喝",
    url: sanyaFood,
    note: "用于三亚城市日与返程日的顺路吃喝候选。",
  },
  {
    id: "sanya-hotels",
    title: "三亚下楼就是海景的酒店已整理好（四大湾区）",
    scope: "三亚酒店",
    url: sanyaHotels,
    note: "用于比较四大湾区的住宿位置，不采用笔记中的即时价格。",
  },
  {
    id: "wanning-food",
    title: "个人觉得万宁无法超越的店（已吃版）",
    scope: "万宁吃喝",
    url: wanningFood,
    note: "原笔记标题为万宁，只用于 Day 2–3，避免错放进三亚。",
  },
];

export const dayGuides: DayGuide[] = [
  {
    dayId: 1,
    headline: "抵达日不排队：航班决定午饭，天黑前到万宁",
    rhythm: ["落地后先取车与补水", "13:30 前离开机场才短停骑楼", "晚到就直接酒店吃晚饭"],
    foodStops: [{
      name: "骑楼老街现选海南粉／清补凉",
      area: "海口骑楼老街",
      when: "只在早班机准点时作为午饭",
      order: ["海南粉或抱罗粉", "一份清补凉两人分食"],
      reason: "第一顿落在真实老街，但不绑定一家需要排队的店。",
      sourceUrl: "https://www.amap.com/search?query=%E6%B5%B7%E5%8F%A3%E9%AA%91%E6%A5%BC%E8%80%81%E8%A1%97",
      sourceLabel: "地图核验 · 骑楼老街",
    }],
  },
  {
    dayId: 2,
    headline: "兴隆吃南洋味，石梅湾只留安静海岸",
    rhythm: ["植物园开园后进入", "午饭集中在兴隆", "下午石梅湾，晚饭回神州半岛"],
    foodStops: [
      {
        name: "新大众茶坊",
        area: "万宁兴隆",
        when: "植物园后做早午饭",
        order: ["斑斓排骨", "斑斓糕", "兴隆咖啡或西多士"],
        reason: "和兴隆的南洋饮食脉络一致，适合少量多样。",
        sourceUrl: wanningFood,
        sourceLabel: "用户提供笔记 · 万宁已吃版",
      },
      {
        name: "原辉记清补凉",
        area: "万宁兴隆",
        when: "午后返程前降温",
        order: ["椰奶清补凉", "斑斓炒冰清补凉"],
        reason: "放在兴隆午饭后，不为甜品单独绕路。",
        sourceUrl: wanningFood,
        sourceLabel: "用户提供笔记 · 万宁已吃版",
      },
    ],
  },
  {
    dayId: 3,
    headline: "冲浪日前后都吃轻一点，把日落留给神州半岛",
    rhythm: ["课前只吃七分饱", "冲浪结束补水和碳水", "回神州半岛看海后再吃正餐"],
    foodStops: [
      {
        name: "港角菠萝包",
        area: "万宁沿海行程候选",
        when: "冲浪后简餐；顺路才去",
        order: ["斑斓菠萝包", "猪扒菠萝包"],
        reason: "比海边长时间排队正餐更适合冲浪后的节奏。",
        sourceUrl: wanningFood,
        sourceLabel: "用户提供笔记 · 万宁已吃版",
      },
      {
        name: "林姐香味海鲜",
        area: "万宁石梅湾／兴隆片区候选",
        when: "晚饭；先看当天距离和排队",
        order: ["清蒸海鲜", "椒盐皮皮虾", "一份蔬菜"],
        reason: "安排在万宁最后一个完整夜晚，但不牺牲神州半岛日落。",
        sourceUrl: wanningFood,
        sourceLabel: "用户提供笔记 · 万宁已吃版",
      },
    ],
  },
  {
    dayId: 4,
    headline: "带行李南下，只换这一次酒店",
    rhythm: ["退房后行李全程随车", "新村港先确认船况", "16:20 前离开清水湾去海棠湾"],
    foodStops: [{
      name: "新村港明码标价午饭",
      area: "陵水新村镇",
      when: "乘船前后，按班次调整",
      order: ["陵水酸粉或汤粉", "当天明码标价海鲜"],
      reason: "把午饭留在换宿线路中段，不为网红店横穿县城。",
      sourceUrl: "https://www.amap.com/search?query=%E9%99%B5%E6%B0%B4%E6%96%B0%E6%9D%91%E6%B8%AF",
      sourceLabel: "地图核验 · 新村港",
    }],
  },
  {
    dayId: 5,
    headline: "南山是唯一主线，返程把晚饭放回海棠湾",
    rhythm: ["酒店早餐后再出发", "南山完整半日", "晚饭回海棠湾，不再塞一个景点"],
    foodStops: [{
      name: "太琼糟粕醋火锅",
      area: "三亚海棠湾候选",
      when: "南山返程后的晚饭",
      order: ["糟粕醋锅底", "海鲜拼盘", "蔬菜和粉"],
      reason: "住海棠湾时顺路，不需要再往市中心折返。",
      sourceUrl: sanyaHotels,
      sourceLabel: "用户提供笔记 · 四大湾区酒店整理",
    }],
    optional: {
      title: "免税购物可选分支",
      detail: "若不想再跑景点，可把返程晚饭前后留给 cdf 三亚国际免税城；官方当前列出的营业时间为 10:00–22:00，出发前再复核。",
      sourceUrl: "https://www.cdfg.com.cn/p/huiyuankashiyongmendian.html",
    },
  },
  {
    dayId: 6,
    headline: "城市日按海岸向西走，吃喝夹在景点之间",
    rhythm: ["大东海看海况", "午饭与午后降温", "鹿回头后去三亚湾日落"],
    foodStops: [
      {
        name: "正合中西茶店",
        area: "三亚市区",
        when: "大东海结束后的午饭候选",
        order: ["炸鸡翅", "腌面", "冰豆花"],
        reason: "适合城市日中段坐下休息，菜单偏小吃可控制份量。",
        sourceUrl: sanyaFood,
        sourceLabel: "用户提供笔记 · 三亚已吃版",
      },
      {
        name: "琼乡阁海南私房菜",
        area: "三亚市区",
        when: "两人晚饭候选；日落后再决定",
        order: ["阿婆手工豆腐", "簸箕饭", "黎族特色烤鱼"],
        reason: "想吃完整海南菜时选它；一人则优先下面食和小吃。",
        sourceUrl: sanyaFood,
        sourceLabel: "用户提供笔记 · 三亚已吃版",
      },
      {
        name: "海南椰子果冻",
        area: "三亚市区候选",
        when: "城市日顺路甜品",
        order: ["椰子冻", "酸豆汁"],
        reason: "作为步行间隙的轻补给，不单独跨区打卡。",
        sourceUrl: sanyaFood,
        sourceLabel: "用户提供笔记 · 三亚已吃版",
      },
    ],
  },
  {
    dayId: 7,
    headline: "返程日只做离店、加油、还车三件事",
    rhythm: ["起飞前 3.5 小时离开酒店", "先加油再进还车点", "预留摆渡与行李时间"],
    foodStops: [{
      name: "小高后安粉餐厅",
      area: "三亚候选",
      when: "仅限晚班机且导航显示顺路",
      order: ["后安粉", "海南粉或肉粽"],
      reason: "快进快出的海南早餐；早班机直接吃酒店早餐。",
      sourceUrl: sanyaFood,
      sourceLabel: "用户提供笔记 · 三亚已吃版",
    }],
    optional: {
      title: "想带走的饮品与糕点",
      detail: "五号手作、靠杯鲜果茶、老盐季、斑斓故事与港隆菠萝包只作为用户笔记候选；必须顺路、现查营业，再决定是否买。",
      sourceUrl: sanyaMemo,
    },
  },
];

export const hotelBayGuide: HotelBayGuide[] = [
  {
    bay: "三亚湾",
    fit: "离凤凰机场与市区近，适合抵离便利和城市餐饮。",
    tradeoff: "本路线前三天从陵水南下，住这里会让 Day 4 与后续海棠湾活动多一次横穿。",
    examples: ["洛克铂金", "海韵度假", "皇冠假日", "康年"],
  },
  {
    bay: "大东海",
    fit: "市区生活方便，公共海滩与餐饮密度高。",
    tradeoff: "更适合城市型停留，不如海棠湾匹配本路线的陵水南下与度假留白。",
    examples: ["南中国", "半山半岛洲际", "珊瑚湾文华东方"],
  },
  {
    bay: "亚龙湾",
    fit: "成熟海湾与度假酒店集中，沙滩体验完整。",
    tradeoff: "位置在海棠湾和市区之间，但与本路线的陵水、免税可选分支不如海棠湾顺。",
    examples: ["亚龙湾希尔顿", "美高梅", "丽思卡尔顿", "瑞吉", "太阳湾柏悦"],
  },
  {
    bay: "海棠湾",
    fit: "最适合这条自驾线：从陵水顺路入住，连住三晚，并保留免税与酒店休息的弹性。",
    tradeoff: "去南山和三亚市区更远，所以 Day 5、Day 6 必须各守一条主线。",
    examples: ["海棠湾九号", "海棠湾君悦", "海棠湾威斯汀", "艾迪逊"],
  },
];

export function getDayGuide(dayId: number) {
  return dayGuides.find((guide) => guide.dayId === dayId);
}
