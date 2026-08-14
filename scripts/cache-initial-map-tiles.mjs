import { mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../public/map-tiles/osm/", import.meta.url));
const ranges = [
  { z: 5, minX: 24, maxX: 27, minY: 13, maxY: 15 },
  { z: 6, minX: 49, maxX: 54, minY: 26, maxY: 30 },
  { z: 7, minX: 98, maxX: 107, minY: 52, maxY: 59 },
  { z: 8, minX: 204, maxX: 209, minY: 111, maxY: 116 },
];

const tiles = ranges.flatMap(({ z, minX, maxX, minY, maxY }) => {
  const result = [];
  for (let x = minX; x <= maxX; x += 1) {
    for (let y = minY; y <= maxY; y += 1) result.push({ z, x, y });
  }
  return result;
});

async function downloadTile({ z, x, y }) {
  const target = join(root, String(z), String(x), `${y}.png`);
  try {
    if ((await stat(target)).size > 0) return;
  } catch {}
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(`https://tile.openstreetmap.de/${z}/${x}/${y}.png`, {
        headers: { "user-agent": "hainan-seven-day-trip/1.0 (initial overview cache)" },
      });
      if (!response.ok) throw new Error(`Tile ${z}/${x}/${y} returned ${response.status}`);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, Buffer.from(await response.arrayBuffer()));
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 300));
    }
  }
  throw lastError;
}

const concurrency = 4;
let cursor = 0;
await Promise.all(Array.from({ length: concurrency }, async () => {
  while (cursor < tiles.length) {
    const tile = tiles[cursor];
    cursor += 1;
    await downloadTile(tile);
  }
}));

process.stdout.write(`Cached ${tiles.length} initial overview tiles.\n`);
