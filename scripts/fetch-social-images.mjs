import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const outputDirectory = new URL("../public/hainan/", import.meta.url);
await mkdir(fileURLToPath(outputDirectory), { recursive: true });
const douyinOnly = process.argv.includes("--douyin-only");

const xhsCollections = [
  {
    slug: "sanya-pretrip",
    expected: 8,
    url: "https://xhslink.cn/o/6QybMpO8y3I",
  },
  {
    slug: "sanya-food",
    expected: 4,
    url: "https://xhslink.cn/o/2HxyZx28FWw",
  },
  {
    slug: "sanya-hotels",
    expected: 13,
    url: "https://xhslink.cn/o/6gqXrkMD9Zk",
  },
  {
    slug: "wanning-food",
    expected: 4,
    url: "https://www.xiaohongshu.com/discovery/item/6a7070660000000025002e78?xsec_token=CBmz0SfFtHmk_f4oQ2cE0Syi6myVeaDZHS-UFAP3rABMU%3D&xsec_source=app_share",
  },
];

const douyinCovers = [
  {
    output: "social-video-douyin-haikou-overview.webp",
    url: "https://p3-pc-sign.douyinpic.com/tos-cn-p-0015/ocn5gDmjAHp2AQLSkCQhFrtQDfCHM94eEfDeY4~tplv-dy-360p.jpeg?biz_tag=pcweb_cover&from=327834062&lk3s=138a59ce&s=PackSourceEnum_AWEME_DETAIL&sc=origin_cover&se=false&x-expires=1787738400&x-signature=kwCVetlXpRXYZTyPBR1IO9wQPHo%3D",
  },
  {
    output: "social-video-douyin-eastline-family.webp",
    url: "https://p3-pc-sign.douyinpic.com/tos-cn-p-0015/owAwIi7IyTIVA3BgcQ3a4dPCbmqjQ0tdCIiPh~tplv-dy-360p.jpeg?biz_tag=pcweb_cover&from=327834062&lk3s=138a59ce&s=PackSourceEnum_AWEME_DETAIL&sc=origin_cover&se=false&x-expires=1787738400&x-signature=tK47KI05SjzQLZhFZ0dnOTZNF30%3D",
  },
  {
    output: "social-video-douyin-sanya-lingshui.webp",
    url: "https://p3-pc-sign.douyinpic.com/tos-cn-p-0015/o4AQCuIgC8AFgE8zdj95hYfpTvDgABOIeDFocj~tplv-dy-360p.jpeg?biz_tag=pcweb_cover&from=327834062&lk3s=138a59ce&s=PackSourceEnum_AWEME_DETAIL&sc=origin_cover&se=false&x-expires=1787738400&x-signature=CiKk92wLXRsHoQRyH0%2FB3vluen0%3D",
  },
  {
    output: "social-video-douyin-lingshui-hotel-family.webp",
    url: "https://p3-pc-sign.douyinpic.com/tos-cn-p-0015c000-ce/oMiX984zoQeMANEvhCyF6OMEQWDHOvAtJwfey2~tplv-dy-360p.jpeg?biz_tag=pcweb_cover&from=327834062&lk3s=138a59ce&s=PackSourceEnum_AWEME_DETAIL&sc=origin_cover&se=false&x-expires=1787738400&x-signature=xF6oaYGTDrC8E5%2FJFOvK8FkkWSs%3D",
  },
  {
    output: "social-douyin-haikou-guide.webp",
    url: "https://p3-pc-sign.douyinpic.com/image-cut-tos-priv/9e23dd7cb44f3517415ee0a177e2a125~tplv-dy-resize-origshort-autoq-75:330.jpeg?biz_tag=pcweb_cover&from=327834062&lk3s=138a59ce&s=PackSourceEnum_MIX_AWEME&sc=cover&se=false&x-expires=2101885200&x-signature=vqFgkhrHABqAtQ%2FbL1EdWC4NnJk%3D",
  },
  {
    output: "social-douyin-wanning-guide.webp",
    url: "https://p3-pc-sign.douyinpic.com/tos-cn-p-0015c000-ce/owEIQetfWZ8QDtA9M1lo0EFjEW7DvMwEAY1fqC~tplv-dy-360p.jpeg?biz_tag=pcweb_cover&from=327834062&lk3s=138a59ce&s=PackSourceEnum_AWEME_DETAIL&sc=origin_cover&se=false&x-expires=1787734800&x-signature=hgNlRkY9oIM9uP9tJGn4uzTPkA4%3D",
  },
  {
    output: "social-douyin-lingshui-guide.webp",
    url: "https://p3-pc-sign.douyinpic.com/image-cut-tos-priv/c86a895b1964b9a6e986cb6a5735e6ff~tplv-dy-resize-origshort-autoq-75:330.jpeg?biz_tag=pcweb_cover&from=327834062&lk3s=138a59ce&s=PackSourceEnum_MIX_AWEME&sc=cover&se=false&x-expires=2101885200&x-signature=0VFrlFWVIdvvutqkSReUDQi%2Bo7o%3D",
  },
  {
    output: "social-douyin-lingshui-overview.webp",
    url: "https://p3-pc-sign.douyinpic.com/tos-cn-p-0015/ogeQgYYffYA5bk7fAMsaEtKFVH9AeIVngF4ZOg~tplv-dy-360p.jpeg?biz_tag=pcweb_cover&from=327834062&lk3s=138a59ce&s=PackSourceEnum_AWEME_DETAIL&sc=origin_cover&se=false&x-expires=1787738400&x-signature=DThbMpndo5cNWKyq66KaZ7C%2BXEQ%3D",
  },
  {
    output: "social-douyin-clearwater-hotels.webp",
    url: "https://p3-pc-sign.douyinpic.com/tos-cn-p-0015/o0zIuKa0tqMYBiiPT4qBG2IBGQWrPqImtIAAq~tplv-dy-360p.jpeg?biz_tag=pcweb_cover&from=327834062&lk3s=138a59ce&s=PackSourceEnum_AWEME_DETAIL&sc=origin_cover&se=false&x-expires=1787734800&x-signature=wZ7umma8o3NjZdtw07pB6XGrvCI%3D",
  },
  {
    output: "social-douyin-sanya-overview.webp",
    url: "https://p3-pc-sign.douyinpic.com/tos-cn-p-0015/o4IWQRBpAgoQRz9IWE1efFwARAiDaF2jNDitQA~tplv-dy-360p.jpeg?biz_tag=pcweb_cover&from=327834062&lk3s=138a59ce&s=PackSourceEnum_AWEME_DETAIL&sc=origin_cover&se=false&x-expires=1787734800&x-signature=%2BmTvMO6jc0A5yLEYqdjlL709tDs%3D",
  },
];

const browserHeaders = {
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
};

async function fetchBuffer(url, headers = browserHeaders) {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${response.status} while fetching ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

async function writePreview(buffer, outputName) {
  const output = new URL(outputName, outputDirectory);
  const result = await sharp(buffer)
    .rotate()
    .resize({ width: 960, height: 960, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 72, effort: 5 })
    .toFile(fileURLToPath(output));
  console.log(outputName, `${result.width}x${result.height}`, `${result.size} bytes`);
}

for (const collection of douyinOnly ? [] : xhsCollections) {
  const pageResponse = await fetch(collection.url, { headers: browserHeaders, redirect: "follow" });
  if (!pageResponse.ok) throw new Error(`${pageResponse.status} while fetching ${collection.url}`);
  const html = await pageResponse.text();
  const urls = [...html.matchAll(/"urlDefault":"([^"]+)"/g)]
    .map((match) => JSON.parse(`"${match[1]}"`).replace(/^http:/, "https:"))
    .filter((url, index, all) => all.indexOf(url) === index);
  if (urls.length !== collection.expected) {
    throw new Error(`${collection.slug}: expected ${collection.expected} images, found ${urls.length}`);
  }
  for (const [index, url] of urls.entries()) {
    const output = `social-xhs-${collection.slug}-${String(index + 1).padStart(2, "0")}.webp`;
    await writePreview(await fetchBuffer(url, { ...browserHeaders, referer: pageResponse.url }), output);
  }
}

for (const cover of douyinCovers) {
  await writePreview(await fetchBuffer(cover.url, { ...browserHeaders, referer: "https://www.douyin.com/" }), cover.output);
}
