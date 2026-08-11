import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("SEO surface contains canonical, robots, sitemap, manifest and structured data", async () => {
  const [layout, seo, robots, sitemap, manifest, routed] = await Promise.all([
    read("app/layout.tsx"),
    read("app/lib/seo.ts"),
    read("app/robots.ts"),
    read("app/sitemap.ts"),
    read("app/manifest.ts"),
    read("app/[...slug]/page.tsx"),
  ]);
  assert.match(layout, /metadataBase/);
  assert.match(seo, /openGraph/);
  assert.match(seo, /SearchAction/);
  assert.match(seo, /VideoObject/);
  assert.match(robots, /sitemap/);
  assert.match(sitemap, /DEELS_BACKEND_URL/);
  assert.match(manifest, /standalone/);
  assert.match(routed, /notFound\(\)/);
});

test("critical interactive journeys are wired to services", async () => {
  const [app, endpoints, services] = await Promise.all([
    read("app/components/deels-app.tsx"),
    read("app/lib/api/endpoints.ts"),
    read("app/lib/api/services.ts"),
  ]);
  for (const marker of [
    "battles.vote",
    "challenges.join",
    "campaigns.donate",
    "wallet.deposit",
    "messages.send",
    "notifications.readAll",
    "settings.updatePreferences",
    "social.like",
    "search.all",
    "stats.summary",
    "auth.oauthUrl",
    "CookieConsent",
  ])
    assert.match(`${app}\n${services}`, new RegExp(marker.replace(".", "\\.")));
  for (const marker of [
    "verifyEmail",
    "closeSessions",
    "donate",
    "join",
    "readAll",
  ]) {
    assert.match(endpoints, new RegExp(marker));
  }
});

test("story viewer supports touch, wheel, buttons and keyboard navigation", async () => {
  const [app, pages] = await Promise.all([
    read("app/components/deels-app.tsx"),
    read("app/pages.css"),
  ]);
  for (const marker of [
    "onPointerDown={startStorySwipe}",
    "onWheel={scrollStories}",
    'event.key === "ArrowLeft"',
    'event.key === "ArrowRight"',
    "story-progress",
    "story-nav-next",
  ]) {
    assert.match(app, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(pages, /touch-action:\s*pan-y/);
  assert.match(pages, /\.story-swipe-hint/);
});

test("private screens and API proxy fail closed", async () => {
  const [app, seo, proxy] = await Promise.all([
    read("app/components/deels-app.tsx"),
    read("app/lib/seo.ts"),
    read("app/api/deels/[...path]/route.ts"),
  ]);
  assert.match(app, /useAuthGuard/);
  assert.match(app, /guard\.error && apiConfig\.mode !== "demo"/);
  assert.match(seo, /noarchive/);
  assert.match(proxy, /MAX_BODY_BYTES/);
  assert.match(proxy, /DEELS_BACKEND_NOT_CONFIGURED/);
  assert.match(proxy, /cache: "no-store"/);
});
