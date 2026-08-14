import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".geojson": "application/geo+json",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

export function exportedFileForRequest(root, basePath, pathname) {
  const decoded = decodeURIComponent(pathname);
  if (decoded.split("/").includes("..")) return null;
  if (decoded !== basePath && !decoded.startsWith(`${basePath}/`)) return null;

  let relative = decoded.slice(basePath.length).replace(/^\//, "");
  if (!relative || decoded.endsWith("/")) relative += "index.html";
  const absoluteRoot = resolve(root);
  const file = resolve(absoluteRoot, relative);
  if (file !== absoluteRoot && !file.startsWith(`${absoluteRoot}${sep}`)) return null;
  return file;
}

export function servePagesExport({ root = "out", basePath = "/hainan-seven-day-trip", port = 4190 } = {}) {
  const server = createServer((request, response) => {
    const pathname = new URL(request.url || "/", "http://localhost").pathname;
    const file = exportedFileForRequest(root, basePath, pathname);
    if (!file) {
      response.writeHead(404).end("Not found");
      return;
    }
    try {
      if (!statSync(file).isFile()) throw new Error("Not a file");
      response.setHeader("Content-Type", contentTypes[extname(file)] || "application/octet-stream");
      createReadStream(file).pipe(response);
    } catch {
      response.writeHead(404).end("Not found");
    }
  });
  server.listen(port, "127.0.0.1", () => process.stdout.write(`Pages export ready at http://127.0.0.1:${port}${basePath}/\n`));
  return server;
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (invokedPath === import.meta.url) {
  servePagesExport({
    root: process.env.PAGES_OUT_DIR || "out",
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/hainan-seven-day-trip",
    port: Number(process.env.PORT || 4190),
  });
}
