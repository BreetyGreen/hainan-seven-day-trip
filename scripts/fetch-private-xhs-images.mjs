import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const publicHainan = new URL("../public/hainan/", import.meta.url);
const outputDirectory = new URL("../public/private-hainan/", import.meta.url);
const dataModule = new URL("../app/private-social-gallery.ts", import.meta.url);
await mkdir(fileURLToPath(outputDirectory), { recursive: true });

const browserHeaders = {
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
};

const localRules = [
  { pattern: /^social-xhs-sanya-hotels-/, city: "三亚", theme: "海景酒店", title: "三亚四大湾区海景酒店", placeIds: [], sourceUrl: "https://xhslink.cn/o/6gqXrkMD9Zk" },
  { pattern: /^social-xhs-sanya-food-/, city: "三亚", theme: "吃喝", title: "三亚个人实吃版", placeIds: [], sourceUrl: "https://xhslink.cn/o/2HxyZx28FWw" },
  { pattern: /^social-xhs-wanning-food-/, city: "万宁", theme: "吃喝", title: "万宁个人实吃版", placeIds: [], sourceUrl: "https://www.xiaohongshu.com/explore/6a7070660000000025002e78" },
  { pattern: /^qilou-night-xhs/, city: "海口", theme: "城市漫游", title: "海口骑楼老街夜景", placeIds: ["qilou"], sourceUrl: "https://www.xiaohongshu.com/explore/6a689911000000000503abca" },
  { pattern: /^grand-hyatt-wanning-xhs/, city: "万宁", theme: "海景酒店", title: "万宁神州半岛君悦", placeIds: ["wanning-hyatt"], sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=万宁神州半岛君悦" },
  { pattern: /^riyue-bay-xhs/, city: "万宁", theme: "安静海岸", title: "万宁日月湾", placeIds: [], sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=万宁日月湾" },
  { pattern: /^shenzhou-peninsula-xhs/, city: "万宁", theme: "安静海岸", title: "神州半岛海岸", placeIds: ["shenzhou-peninsula"], sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=万宁神州半岛" },
  { pattern: /^shimei-bay-xhs/, city: "万宁", theme: "安静海岸", title: "万宁石梅湾", placeIds: ["shimei-bay"], sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=万宁石梅湾" },
  { pattern: /^xinglong-garden-xhs/, city: "万宁", theme: "城市漫游", title: "兴隆热带植物园", placeIds: ["xinglong-garden"], sourceUrl: "https://www.xiaohongshu.com/explore/6a786a36000000002202d176" },
  { pattern: /^xinglong-market-xhs/, city: "万宁", theme: "吃喝", title: "兴隆华侨农贸市场", placeIds: ["xinglong-market"], sourceUrl: "https://www.xiaohongshu.com/explore/68a31c74000000001d034617" },
  { pattern: /^raffles-hainan-xhs/, city: "陵水", theme: "海景酒店", title: "陵水海景酒店", placeIds: [], sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=陵水海景酒店" },
  { pattern: /^sangem-moon-xhs/, city: "陵水", theme: "海景酒店", title: "海南三正月酒店", placeIds: ["sangem-moon"], sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=海南三正月酒店" },
  { pattern: /^xincun-port-xhs/, city: "陵水", theme: "城市漫游", title: "陵水新村港", placeIds: ["xincun-port"], sourceUrl: "https://www.xiaohongshu.com/explore/6a71b3a50000000021020fc8" },
  { pattern: /^(grand-hyatt-sanya|sofitel-pool)-xhs/, city: "三亚", theme: "海景酒店", title: "三亚海景酒店", placeIds: [], sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=三亚海景酒店" },
  { pattern: /^(coconut-corridor|dadonghai)-xhs/, city: "三亚", theme: "安静海岸", title: "三亚城市海岸", placeIds: [], sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=三亚海岸" },
  { pattern: /^luhuitou-xhs/, city: "三亚", theme: "城市漫游", title: "三亚鹿回头", placeIds: ["luhuitou"], sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=三亚鹿回头" },
  { pattern: /^nanshan-xhs/, city: "三亚", theme: "城市漫游", title: "三亚南山", placeIds: [], sourceUrl: "https://www.xiaohongshu.com/search_result?keyword=三亚南山" },
];

const remoteCollections = [
  { slug: "wanning-route", city: "万宁", theme: "城市漫游", author: "逍遥", title: "万宁三天两晚区域路线", placeIds: [], url: "https://www.xiaohongshu.com/explore/6a2b733d000000000802544e?xsec_token=ABnAMbQdECihFgwj8XFK7U-wCbpQ1J-wwoBEVnkv4Jffg=&xsec_source=pc_search" },
  { slug: "wanning-reality", city: "万宁", theme: "安静海岸", author: "卷卷心", title: "万宁海岸真实体验", placeIds: [], url: "https://www.xiaohongshu.com/explore/69abee14000000000e03ce43?xsec_token=ABSflyHtUNEkaYDtjgaPlX72PUFu45v99A9k63R-lj7BI=&xsec_source=pc_search" },
  { slug: "lingshui-route", city: "陵水", theme: "安静海岸", author: "双双&豆包", title: "陵水疍家与清水湾", placeIds: ["xincun-port", "clearwater-coast"], url: "https://www.xiaohongshu.com/explore/6a79ad60000000002202c3da?xsec_token=ABEYVGrdadig7lhyus-gD04BkuOPVf-Hy6-qwIwe-hTrE=&xsec_source=pc_search" },
  { slug: "sanya-dadonghai", city: "三亚", theme: "安静海岸", author: "拾渡", title: "大东海顺路一日游", placeIds: [], url: "https://www.xiaohongshu.com/explore/6a657af900000000010307a4?xsec_token=ABjP_9LUg4g5koaqlNXaxAnfNy0MdtakAWiSgcoDnPz0g=&xsec_source=pc_search" },
  { slug: "sanya-nanshan-trip", city: "三亚", theme: "城市漫游", author: "Hs", title: "三亚南山寺一日行程", placeIds: [], url: "https://www.xiaohongshu.com/explore/6a58f880000000000c016cc9?xsec_token=ABgVnlRa7lx1XJvA5igCtNbVyvMwGtTuUsOBXFxIU9o2A=&xsec_source=pc_search" },
  { slug: "wanning-garden", city: "万宁", theme: "城市漫游", author: "lelll", title: "兴隆热带植物园", placeIds: ["xinglong-garden"], url: "https://www.xiaohongshu.com/explore/6a786a36000000002202d176?xsec_token=ABIO4HwpNBtY6l6eMsts2GMRurtC85CNDkGP6x0YSnLgw=&xsec_source=pc_search" },
  { slug: "wanning-market", city: "万宁", theme: "吃喝", author: "小z小c", title: "兴隆华侨农贸市场", placeIds: ["xinglong-market"], url: "https://www.xiaohongshu.com/explore/68a31c74000000001d034617?xsec_token=ABunHxuUfqDwAh7GMtDNCNNm6pzUpzVsMMJkFeeaQYkkQ=&xsec_source=pc_search" },
  { slug: "eastline-seven-days", city: "海口", theme: "城市漫游", author: "Coco妈咪", title: "海口出发海南东线七天", placeIds: [], url: "https://www.xiaohongshu.com/explore/69c4017c0000000023021eb9?xsec_token=AB4JxORkYxfa1HXo3F0ea-suXVgj5PlSUBrAi833uvwm0=&xsec_source=pc_search" },
  { slug: "sanya-nanshan-photo", city: "三亚", theme: "城市漫游", author: "Taurus旅拍日记", title: "南山寺日出与海上观音", placeIds: [], url: "https://www.xiaohongshu.com/explore/6a7602c6000000002c002627?xsec_token=ABCg0dBzZKFyzOO8xVpXPfvcSRmJTGehwX4ode7mcqkZ4=&xsec_source=pc_search" },
  { slug: "sanya-luhuitou", city: "三亚", theme: "城市漫游", author: "橙子", title: "鹿回头城市与游艇港", placeIds: ["luhuitou", "banshan-marina"], url: "https://www.xiaohongshu.com/explore/690489c200000000030373f2?xsec_token=ABPYKECHKPDzn0BspJC6xktJcDQUK21_QaF6vwwgG5c5E=&xsec_source=pc_search" },
];

async function fetchBuffer(url, referer) {
  const response = await fetch(url, { headers: { ...browserHeaders, referer } });
  if (!response.ok) throw new Error(`${response.status} while fetching ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

async function writePreview(buffer, outputName) {
  const output = new URL(outputName, outputDirectory);
  await sharp(buffer)
    .rotate()
    .resize({ width: 1100, height: 1100, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 70, effort: 5 })
    .toFile(fileURLToPath(output));
  return `/private-hainan/${outputName}`;
}

const items = [];
const failures = [];
const localNames = await readdir(publicHainan);
for (const name of localNames) {
  const rule = localRules.find((candidate) => candidate.pattern.test(name));
  if (!rule || !name.endsWith(".webp")) continue;
  const outputName = `local-${basename(name, extname(name))}.webp`;
  const src = await writePreview(await readFile(new URL(name, publicHainan)), outputName);
  items.push({ id: `local-${basename(name, extname(name))}`, src, city: rule.city, theme: rule.theme, title: rule.title, author: "已归档小红书素材", sourceUrl: rule.sourceUrl, placeIds: rule.placeIds });
}

for (const collection of remoteCollections) {
  try {
    const page = await fetch(collection.url, { headers: browserHeaders });
    if (!page.ok) throw new Error(`${page.status} while fetching note`);
    const html = await page.text();
    const urls = [...html.matchAll(/"urlDefault":"([^"]+)"/g)]
      .map((match) => JSON.parse(`"${match[1]}"`).replace(/^http:/, "https:"))
      .filter((url, index, all) => all.indexOf(url) === index);
    if (urls.length === 0) throw new Error("no public images found");
    for (const [index, url] of urls.entries()) {
      try {
        const outputName = `${collection.slug}-${String(index + 1).padStart(2, "0")}.webp`;
        const src = await writePreview(await fetchBuffer(url, collection.url), outputName);
        items.push({ id: `${collection.slug}-${index + 1}`, src, city: collection.city, theme: collection.theme, title: collection.title, author: collection.author, sourceUrl: collection.url, placeIds: collection.placeIds });
      } catch (error) {
        failures.push({ source: collection.slug, index: index + 1, error: String(error) });
      }
    }
  } catch (error) {
    failures.push({ source: collection.slug, error: String(error) });
  }
}

const moduleSource = `export type PrivateSocialCity = "海口" | "万宁" | "陵水" | "三亚";\nexport type PrivateSocialTheme = "海景酒店" | "安静海岸" | "城市漫游" | "吃喝";\n\nexport type PrivateSocialImage = {\n  id: string;\n  src: string;\n  city: PrivateSocialCity;\n  theme: PrivateSocialTheme;\n  title: string;\n  author: string;\n  sourceUrl: string;\n  placeIds: string[];\n};\n\nexport const privateSocialImages: PrivateSocialImage[] = ${JSON.stringify(items, null, 2)};\n\nexport function privateSocialImagesForCity(city: string) {\n  return privateSocialImages.filter((image) => image.city === city);\n}\n\nexport function privateSocialImagesForPlace(placeId: string) {\n  return privateSocialImages.filter((image) => image.placeIds.includes(placeId));\n}\n`;
await writeFile(dataModule, moduleSource, "utf8");
await writeFile(new URL("manifest.json", outputDirectory), JSON.stringify({ generatedAt: new Date().toISOString(), count: items.length, failures }, null, 2), "utf8");
console.log(`private images: ${items.length}`);
console.log(`failures: ${failures.length}`);
