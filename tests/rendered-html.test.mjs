import assert from "node:assert/strict";
import test from "node:test";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

const env = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const context = { waitUntil() {}, passThroughOnException() {} };

test("renders production SEO and structured data", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    env,
    context,
  );
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.match(html, /<html[^>]+lang=["']ru["']/i);
  assert.match(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']https:\/\/deels\.ru["']/i);
  assert.match(html, /<meta[^>]+property=["']og:title["']/i);
  assert.match(html, /<meta[^>]+name=["']robots["'][^>]+content=["']index, follow["']/i);
  assert.match(html, /application\/ld\+json/i);
  assert.match(html, /"@type":"Organization"/i);
  assert.match(html, /class=["']cookie-consent["']/i);
});

test("adds browser security headers", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("https://deels.ru/", { headers: { accept: "text/html" } }),
    env,
    context,
  );

  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
  assert.match(response.headers.get("strict-transport-security") ?? "", /max-age=31536000/);
});
