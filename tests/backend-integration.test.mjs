import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
test("backend integration is centralized", async () => { const [config, endpoints, proxy, env] = await Promise.all([read("app/lib/api/config.ts"), read("app/lib/api/endpoints.ts"), read("app/api/deels/[...path]/route.ts"), read(".env.example")]); assert.match(config, /NEXT_PUBLIC_DEELS_API_MODE/); assert.match(config, /demo.*auto.*live/s); assert.match(endpoints, /challenges/); assert.match(endpoints, /campaigns/); assert.match(endpoints, /notifications/); assert.match(proxy, /DEELS_BACKEND_URL/); assert.match(env, /NEXT_PUBLIC_DEELS_AUTH_MODE/); });
test("screens call services, not backend fetch directly", async () => { const [app, client] = await Promise.all([read("app/components/deels-app.tsx"), read("app/lib/api/client.ts")]); assert.doesNotMatch(app, /fetch\s*\(/); assert.match(app, /deelsApi\.auth\.login/); assert.match(app, /deelsApi\.createContent/); assert.match(client, /fetch\s*\(/); });

