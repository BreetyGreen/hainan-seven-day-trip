import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { researchEvidence, researchMetrics } from "../app/research-evidence.ts";

const snapshotUrl = new URL("../build/hainan-evidence-snapshot.json", import.meta.url);
const verifyOnly = process.argv.includes("--verify");
const browserHeaders = {
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/127.0.0.0 Safari/537.36",
  "accept-language": "zh-CN,zh;q=0.9",
};

function readInitialState(html) {
  const marker = "window.__INITIAL_STATE__=";
  const start = html.indexOf(marker);
  if (start < 0) throw new Error("window.__INITIAL_STATE__ is missing");
  const jsonStart = start + marker.length;
  const jsonEnd = html.indexOf("</script>", jsonStart);
  if (jsonEnd < 0) throw new Error("initial-state script is incomplete");
  return JSON.parse(html.slice(jsonStart, jsonEnd).replace(/:undefined([,}])/g, ":null$1"));
}

async function inspectXhsSource(item) {
  try {
    const response = await fetch(item.url, { redirect: "follow", headers: browserHeaders });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    const state = readInitialState(html);
    const noteDetailMap = state?.note?.noteDetailMap ?? {};
    const detail = Object.values(noteDetailMap)[0]?.note;
    if (!detail) throw new Error("noteDetailMap contains no public note");
    return {
      sourceId: item.sourceId,
      ok: true,
      canonicalUrl: response.url,
      title: detail.title,
      author: detail.user?.nickname ?? "",
      imageCount: detail.imageList?.length ?? 0,
      engagement: {
        likes: Number(detail.interactInfo?.likedCount || 0),
        collects: Number(detail.interactInfo?.collectedCount || 0),
        comments: Number(detail.interactInfo?.commentCount || 0),
        shares: Number(detail.interactInfo?.shareCount || 0),
      },
    };
  } catch (error) {
    return { sourceId: item.sourceId, ok: false, error: String(error) };
  }
}

const sourceIndex = researchEvidence.map((item) => ({
  sourceId: item.sourceId,
  category: item.category,
  city: item.city,
  sourceType: item.sourceType,
  title: item.title,
  url: item.url,
  entityIds: item.entityIds,
  deepRead: item.deepRead,
  promoRisk: item.promoRisk.level,
  mediaCount: item.media.length,
}));

if (verifyOnly) {
  const existing = JSON.parse(await readFile(snapshotUrl, "utf8"));
  const keys = ["candidateCount", "deepReadCount", "independentSourceCount", "independentUrlCount"];
  const mismatches = keys.filter((key) => existing.metrics[key] !== researchMetrics[key]);
  if (mismatches.length > 0) {
    throw new Error(`snapshot mismatch: ${mismatches.join(", ")}`);
  }
  console.log(`verified ${researchMetrics.candidateCount} candidates and ${researchMetrics.deepReadCount} deep reads`);
  process.exit(0);
}

const publicXhsNotes = researchEvidence.filter((item) =>
  item.sourceType === "小红书"
  && item.deepRead
  && !item.url.includes("/search_result"),
);
const xhsChecks = await Promise.all(publicXhsNotes.map(inspectXhsSource));
const snapshot = {
  generatedAt: new Date().toISOString(),
  method: "Independent source IDs plus public Xiaohongshu SSR parsing; image pages never increment candidate counts.",
  metrics: researchMetrics,
  xhsChecks,
  sources: sourceIndex,
};

await writeFile(snapshotUrl, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`snapshot: ${fileURLToPath(snapshotUrl)}`);
console.log(`candidates: ${researchMetrics.candidateCount}`);
console.log(`deep reads: ${researchMetrics.deepReadCount}`);
console.log(`public XHS checks: ${xhsChecks.filter((item) => item.ok).length}/${xhsChecks.length}`);
