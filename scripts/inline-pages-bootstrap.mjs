import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const startupScriptPattern = /<script\b([^>]*?)\bsrc="([^"]+)"([^>]*)><\/script>/gi;

export async function inlineInitialScripts(html, basePath, loadScript, { maxInlineBytes = Number.POSITIVE_INFINITY } = {}) {
  const matches = [...html.matchAll(startupScriptPattern)];
  let result = html;

  for (const match of matches) {
    const [tag, beforeSrc, src, afterSrc] = match;
    const localPrefix = `${basePath}/_next/static/chunks/`;
    const attributes = `${beforeSrc}${afterSrc}`;
    if (!src.startsWith(localPrefix) || /\bnomodule\b/i.test(attributes)) continue;

    const localPath = src.slice(basePath.length);
    const source = await loadScript(localPath);
    if (typeof source !== "string") throw new Error(`Unable to inline startup script: ${localPath}`);
    if (Buffer.byteLength(source, "utf8") > maxInlineBytes) {
      const prioritized = /\bfetchpriority=/i.test(tag)
        ? tag
        : tag.replace(/><\/script>$/i, ' fetchpriority="high"></script>');
      result = result.replace(tag, () => prioritized);
      continue;
    }

    const scriptUrl = `new URL(${JSON.stringify(src)},document.baseURI).href`;
    const wrappedSource = `(()=>{const __pagesInlineScript=document.currentScript;const __pagesOriginalGetAttribute=__pagesInlineScript.getAttribute.bind(__pagesInlineScript);Object.defineProperty(__pagesInlineScript,"src",{configurable:true,value:${scriptUrl}});__pagesInlineScript.getAttribute=(name)=>name==="src"?${JSON.stringify(src)}:__pagesOriginalGetAttribute(name);${source}})();`;
    const safeSource = wrappedSource.replace(/<\/script/gi, "<\\/script");
    const keptAttributes = attributes.replace(/\s+async(?:="")?/gi, "").trim();
    const kept = keptAttributes ? ` ${keptAttributes}` : "";
    const replacement = `<script${kept} data-pages-inline-bootstrap="${basename(localPath)}">${safeSource}</script>`;
    result = result.replace(tag, () => replacement);
  }

  return result;
}

async function htmlFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(root, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.isFile() && entry.name.endsWith(".html") ? [path] : [];
  }));
  return nested.flat();
}

export async function inlinePagesBootstrap({ outDir = "out", basePath = "/hainan-seven-day-trip", maxInlineBytes = 160_000 } = {}) {
  const root = resolve(outDir);
  const files = await htmlFiles(root);
  let inlined = 0;

  for (const file of files) {
    const html = await readFile(file, "utf8");
    const next = await inlineInitialScripts(html, basePath, (localPath) =>
      readFile(join(root, localPath.replace(/^\//, "")), "utf8"),
      { maxInlineBytes },
    );
    if (next === html) continue;
    await writeFile(file, next, "utf8");
    inlined += 1;
  }

  return { files: files.length, inlined };
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (invokedPath === import.meta.url) {
  const result = await inlinePagesBootstrap({ basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/hainan-seven-day-trip" });
  process.stdout.write(`Inlined startup scripts in ${result.inlined}/${result.files} exported HTML files.\n`);
}
