import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the place hero compact and defers heavy media libraries", async () => {
  const [hero, privateGallery, videoGallery] = await Promise.all([
    readFile(new URL("../app/PlacePhotoGallery.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/PrivateSocialGallery.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/SocialVideoGallery.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(hero, /photos\.slice\(0, 4\)/);
  assert.match(hero, /decoding="async"/);
  assert.match(privateGallery, /const \[activated, setActivated\] = useState\(false\)/);
  assert.match(privateGallery, /if \(!activated\)/);
  assert.match(videoGallery, /const \[activated, setActivated\] = useState\(false\)/);
  assert.match(videoGallery, /if \(!activated\)/);
});
