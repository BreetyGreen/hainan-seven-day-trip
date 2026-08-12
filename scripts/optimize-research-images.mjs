import sharp from "sharp";
import { fileURLToPath } from "node:url";

const images = [
  ["shimei-restored.jpg", "shimei-bay-official.webp"],
  ["shimei-bookhouse.jpg", "shimei-bay-aerial-official.webp"],
  ["shimei-ctrip.jpg", "shimei-bay-coast-ctrip.webp"],
  ["xincun-thepaper.jpg", "xincun-port-thepaper.webp"],
  ["xincun-cgtn.jpg", "xincun-port-cgtn.webp"],
  ["xinglong-coffee.jpg", "xinglong-coffee-valley-official.webp"],
  ["xinglong-garden.jpg", "xinglong-garden-lake-official.webp"],
  ["xinglong-entrance.jpg", "xinglong-garden-entrance-ctrip.webp"],
];

for (const [inputName, outputName] of images) {
  const input = new URL(`../build/research-images/${inputName}`, import.meta.url);
  const output = new URL(`../public/hainan/${outputName}`, import.meta.url);
  await sharp(fileURLToPath(input))
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(fileURLToPath(output));
  const metadata = await sharp(fileURLToPath(output)).metadata();
  console.log(outputName, `${metadata.width}x${metadata.height}`, metadata.size);
}
