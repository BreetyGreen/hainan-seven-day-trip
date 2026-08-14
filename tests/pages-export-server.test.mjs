import assert from "node:assert/strict";
import test from "node:test";

import { exportedFileForRequest } from "../scripts/serve-pages-export.mjs";

test("maps the GitHub Pages base path into the export directory", () => {
  const root = "B:\\trip\\out";

  assert.equal(exportedFileForRequest(root, "/hainan-seven-day-trip", "/hainan-seven-day-trip/"), "B:\\trip\\out\\index.html");
  assert.equal(
    exportedFileForRequest(root, "/hainan-seven-day-trip", "/hainan-seven-day-trip/_next/static/app.js"),
    "B:\\trip\\out\\_next\\static\\app.js",
  );
  assert.equal(exportedFileForRequest(root, "/hainan-seven-day-trip", "/hainan-seven-day-trip/places/"), "B:\\trip\\out\\places\\index.html");
});

test("rejects requests outside the configured Pages path", () => {
  assert.equal(exportedFileForRequest("B:\\trip\\out", "/hainan-seven-day-trip", "/other/file.js"), null);
  assert.equal(exportedFileForRequest("B:\\trip\\out", "/hainan-seven-day-trip", "/hainan-seven-day-trip/../secret"), null);
});
