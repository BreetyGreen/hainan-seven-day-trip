import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";

const url = process.argv[2] ?? "https://breetygreen.github.io/hainan-seven-day-trip/";
const width = Number(process.argv[3] ?? 3840);
const height = Number(process.argv[4] ?? 1991);
const chromePath = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9300 + Math.floor(Math.random() * 500);
const profile = join(tmpdir(), `hainan-map-audit-${Date.now()}`);
const screenshotPath = resolve("build", `map-audit-${basename(new URL(url).pathname) || "home"}-${Date.now()}.png`);

await mkdir(profile, { recursive: true });
await mkdir(resolve("build"), { recursive: true });

const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  `--window-size=${width},${height}`,
  "about:blank",
], { stdio: ["ignore", "ignore", "pipe"], windowsHide: true });

let chromeError = "";
chrome.stderr.setEncoding("utf8");
chrome.stderr.on("data", (chunk) => { chromeError += chunk; });

const delay = (ms) => new Promise((resolveDelay) => setTimeout(resolveDelay, ms));

async function waitForDebugger() {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {}
    await delay(200);
  }
  throw new Error(`Chrome debugger did not start. ${chromeError.slice(-1200)}`);
}

await waitForDebugger();
const targetResponse = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
const target = await targetResponse.json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolveOpen, rejectOpen) => {
  socket.addEventListener("open", resolveOpen, { once: true });
  socket.addEventListener("error", rejectOpen, { once: true });
});

let nextId = 0;
const pending = new Map();
const tileRequests = new Map();
const allRequests = new Map();
const runtimeErrors = [];
let documentStatus = null;

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const handler = pending.get(message.id);
    if (!handler) return;
    pending.delete(message.id);
    if (message.error) handler.reject(new Error(message.error.message));
    else handler.resolve(message.result);
    return;
  }

  const params = message.params;
  if (message.method === "Network.requestWillBeSent") {
    allRequests.set(params.requestId, {
      url: params.request.url,
      type: params.type,
      startedAt: params.timestamp,
      status: "pending",
      http: null,
      bytes: 0,
    });
  }
  if (message.method === "Network.responseReceived" && allRequests.has(params.requestId)) {
    const request = allRequests.get(params.requestId);
    request.http = params.response.status;
    request.protocol = params.response.protocol;
    request.fromDiskCache = params.response.fromDiskCache;
    request.fromServiceWorker = params.response.fromServiceWorker;
  }
  if (message.method === "Network.loadingFinished" && allRequests.has(params.requestId)) {
    const request = allRequests.get(params.requestId);
    request.status = "loaded";
    request.durationMs = Math.round((params.timestamp - request.startedAt) * 1000);
    request.bytes = params.encodedDataLength;
  }
  if (message.method === "Network.loadingFailed" && allRequests.has(params.requestId)) {
    const request = allRequests.get(params.requestId);
    request.status = "failed";
    request.durationMs = Math.round((params.timestamp - request.startedAt) * 1000);
    request.error = params.errorText;
  }
  if (message.method === "Runtime.exceptionThrown") {
    runtimeErrors.push(params.exceptionDetails?.exception?.description ?? params.exceptionDetails?.text ?? "Unknown exception");
  }
  if (message.method === "Runtime.consoleAPICalled" && params.type === "error") {
    runtimeErrors.push(params.args.map((arg) => arg.value ?? arg.description).join(" "));
  }
  if (message.method === "Network.responseReceived" && params.type === "Document") {
    documentStatus = params.response.status;
  }
  if (message.method === "Network.requestWillBeSent" && /arcgisonline|openstreetmap/.test(params.request.url)) {
    tileRequests.set(params.requestId, { url: params.request.url, status: "pending", http: null });
  }
  if (message.method === "Network.responseReceived" && tileRequests.has(params.requestId)) {
    const request = tileRequests.get(params.requestId);
    request.http = params.response.status;
  }
  if (message.method === "Network.loadingFinished" && tileRequests.has(params.requestId)) {
    tileRequests.get(params.requestId).status = "loaded";
  }
  if (message.method === "Network.loadingFailed" && tileRequests.has(params.requestId)) {
    const request = tileRequests.get(params.requestId);
    request.status = "failed";
    request.error = params.errorText;
  }
});

function send(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolveCall, rejectCall) => pending.set(id, { resolve: resolveCall, reject: rejectCall }));
}

async function pageState() {
  const result = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const tiles = [...document.querySelectorAll('.leaflet-tile')];
      const visible = tiles.filter((tile) => {
        const rect = tile.getBoundingClientRect();
        return rect.right > 0 && rect.bottom > 0 && rect.left < innerWidth && rect.top < innerHeight;
      });
      const loaded = (items) => items.filter((tile) => tile.complete && tile.naturalWidth > 0).length;
      const button = [...document.querySelectorAll('button')].find((item) => item.textContent.includes('七日旅程'));
      return {
        title: document.title,
        viewport: [innerWidth, innerHeight],
        allTiles: tiles.length,
        loadedTiles: loaded(tiles),
        visibleTiles: visible.length,
        loadedVisibleTiles: loaded(visible),
        startLabel: button?.textContent.trim() ?? null,
        startEnabled: button ? !button.disabled : false,
      };
    })()`,
  });
  return result.result.value;
}

await send("Page.enable");
await send("Network.enable", { maxTotalBufferSize: 20_000_000 });
await send("Runtime.enable");
if (process.env.BLOCK_IMAGES === "1") {
  await send("Network.setBlockedURLs", { urls: ["*.webp", "*.jpg", "*.jpeg", "*.png"] });
}
const started = performance.now();
await send("Page.navigate", { url });

const checkpoints = [1, 3, 5, 10, 15, 20, 30];
const snapshots = [];
for (const second of checkpoints) {
  const wait = second * 1000 - (performance.now() - started);
  if (wait > 0) await delay(wait);
  const state = await pageState();
  const requests = [...tileRequests.values()];
  snapshots.push({
    second,
    ...state,
    networkTiles: requests.length,
    networkLoaded: requests.filter((request) => request.status === "loaded").length,
    networkFailed: requests.filter((request) => request.status === "failed" || (request.http && request.http >= 400)).length,
    networkPending: requests.filter((request) => request.status === "pending").length,
  });
  if (state.startEnabled && state.visibleTiles > 0 && state.loadedVisibleTiles === state.visibleTiles) break;
}

const screenshot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
await writeFile(screenshotPath, Buffer.from(screenshot.data, "base64"));

const failed = [...tileRequests.values()].filter((request) => request.status === "failed" || (request.http && request.http >= 400));
const resourceRequests = [...allRequests.values()];
const importantRequests = resourceRequests
  .filter((request) => ["Document", "Script", "Stylesheet", "Fetch"].includes(request.type) || request.status !== "loaded")
  .sort((left, right) => (right.durationMs ?? Number.MAX_SAFE_INTEGER) - (left.durationMs ?? Number.MAX_SAFE_INTEGER));
process.stdout.write(`${JSON.stringify({
  url,
  documentStatus,
  viewport: { width, height },
  imagesBlocked: process.env.BLOCK_IMAGES === "1",
  snapshots,
  requestSummary: {
    total: resourceRequests.length,
    loaded: resourceRequests.filter((request) => request.status === "loaded").length,
    pending: resourceRequests.filter((request) => request.status === "pending").length,
    failed: resourceRequests.filter((request) => request.status === "failed" || (request.http && request.http >= 400)).length,
    transferredBytes: resourceRequests.reduce((sum, request) => sum + (request.bytes ?? 0), 0),
  },
  importantRequests: importantRequests.slice(0, 30),
  runtimeErrors,
  failedTiles: failed.slice(0, 10),
  screenshotPath,
}, null, 2)}\n`);

try { await send("Browser.close"); } catch {}
socket.close();
await delay(300);
if (!chrome.killed) chrome.kill();
