import { socialVideos } from "./social-videos";

export type SocialCity = "海口" | "万宁" | "陵水" | "三亚";
export type SocialPlatform = "小红书" | "抖音";

export type SocialImage = {
  id: string;
  src: string;
  alt: string;
  city: SocialCity;
  platform: SocialPlatform;
  collection: string;
  sourceTitle: string;
  sourceUrl: string;
};

type SocialCollection = Omit<SocialImage, "id" | "src" | "alt"> & {
  files: string[];
  altPrefix: string;
};

const xhsCollections: SocialCollection[] = [
  {
    city: "三亚", platform: "小红书", collection: "下周三亚行前清单", sourceTitle: "下周出发去三亚！！！",
    sourceUrl: "https://xhslink.cn/o/6QybMpO8y3I", altPrefix: "小红书三亚行前清单",
    files: [
      "/hainan/social-xhs-sanya-pretrip-01.webp", "/hainan/social-xhs-sanya-pretrip-02.webp", "/hainan/social-xhs-sanya-pretrip-03.webp", "/hainan/social-xhs-sanya-pretrip-04.webp",
      "/hainan/social-xhs-sanya-pretrip-05.webp", "/hainan/social-xhs-sanya-pretrip-06.webp", "/hainan/social-xhs-sanya-pretrip-07.webp", "/hainan/social-xhs-sanya-pretrip-08.webp",
    ],
  },
  {
    city: "三亚", platform: "小红书", collection: "个人实吃版", sourceTitle: "个人觉得三亚无法超越的店（已吃版）",
    sourceUrl: "https://xhslink.cn/o/2HxyZx28FWw", altPrefix: "小红书三亚实吃餐厅记录",
    files: [
      "/hainan/social-xhs-sanya-food-01.webp", "/hainan/social-xhs-sanya-food-02.webp", "/hainan/social-xhs-sanya-food-03.webp", "/hainan/social-xhs-sanya-food-04.webp",
    ],
  },
  {
    city: "三亚", platform: "小红书", collection: "四大湾区海景酒店", sourceTitle: "三亚下楼就是海景的酒店已整理好（四大湾区）",
    sourceUrl: "https://xhslink.cn/o/6gqXrkMD9Zk", altPrefix: "小红书三亚海景酒店对比",
    files: [
      "/hainan/social-xhs-sanya-hotels-01.webp", "/hainan/social-xhs-sanya-hotels-02.webp", "/hainan/social-xhs-sanya-hotels-03.webp", "/hainan/social-xhs-sanya-hotels-04.webp",
      "/hainan/social-xhs-sanya-hotels-05.webp", "/hainan/social-xhs-sanya-hotels-06.webp", "/hainan/social-xhs-sanya-hotels-07.webp", "/hainan/social-xhs-sanya-hotels-08.webp",
      "/hainan/social-xhs-sanya-hotels-09.webp", "/hainan/social-xhs-sanya-hotels-10.webp", "/hainan/social-xhs-sanya-hotels-11.webp", "/hainan/social-xhs-sanya-hotels-12.webp",
      "/hainan/social-xhs-sanya-hotels-13.webp",
    ],
  },
  {
    city: "万宁", platform: "小红书", collection: "万宁个人实吃版", sourceTitle: "个人觉得万宁无法超越的店（已吃版）",
    sourceUrl: "https://www.xiaohongshu.com/explore/6a7070660000000025002e78?xsec_token=CBmz0SfFtHmk_f4oQ2cE0Syi6myVeaDZHS-UFAP3rABMU=&xsec_source=app_share", altPrefix: "小红书万宁实吃餐厅记录",
    files: [
      "/hainan/social-xhs-wanning-food-01.webp", "/hainan/social-xhs-wanning-food-02.webp", "/hainan/social-xhs-wanning-food-03.webp", "/hainan/social-xhs-wanning-food-04.webp",
    ],
  },
];

const douyinCollections: SocialCollection[] = socialVideos.filter((video) => video.platform === "抖音").flatMap((video) => (
  (video.city === "全程" ? ["海口", "万宁", "陵水", "三亚"] : [video.city]) as SocialCity[]
).map((city) => ({
  city,
  platform: "抖音",
  collection: `抖音 · ${video.theme}`,
  sourceTitle: video.title,
  sourceUrl: video.sourceUrl,
  altPrefix: `抖音${video.city}${video.theme}视频封面`,
  files: [video.poster],
})));

const collections: SocialCollection[] = [...xhsCollections, ...douyinCollections];

export const socialImages: SocialImage[] = collections.flatMap((collection) => collection.files.map((src, index) => ({
  id: `${collection.platform}-${collection.city}-${collection.collection}-${index + 1}`,
  src,
  alt: `${collection.altPrefix}第 ${index + 1} 张`,
  city: collection.city,
  platform: collection.platform,
  collection: collection.collection,
  sourceTitle: collection.sourceTitle,
  sourceUrl: collection.sourceUrl,
})));

export function socialImagesForCity(city: string) {
  return socialImages.filter((image) => image.city === city);
}
