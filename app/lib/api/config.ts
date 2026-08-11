import type { ApiMode, AuthMode } from "./types";

function enumValue<T extends string>(value: string | undefined, allowed: readonly T[], fallback: T): T { return allowed.includes(value as T) ? value as T : fallback; }
function cleanPath(value: string | undefined, fallback: string): string { const path = (value || fallback).trim(); if (/^https?:\/\//i.test(path)) return path.replace(/\/$/, ""); return `/${path.replace(/^\/+|\/+$/g, "")}`; }

export const apiConfig = Object.freeze({
  mode: enumValue<ApiMode>(process.env.NEXT_PUBLIC_DEELS_API_MODE, ["demo", "auto", "live"], "demo"),
  authMode: enumValue<AuthMode>(process.env.NEXT_PUBLIC_DEELS_AUTH_MODE, ["cookie", "bearer"], "cookie"),
  baseUrl: cleanPath(process.env.NEXT_PUBLIC_DEELS_API_URL, "/api/deels"),
  apiPrefix: cleanPath(process.env.NEXT_PUBLIC_DEELS_API_PREFIX, "/api"),
  csrfPath: cleanPath(process.env.NEXT_PUBLIC_DEELS_CSRF_PATH, "/sanctum/csrf-cookie"),
  timeoutMs: Math.max(2_000, Number(process.env.NEXT_PUBLIC_DEELS_API_TIMEOUT_MS || 15_000)),
});
export const apiIsEnabled = apiConfig.mode !== "demo";
export const apiMayFallback = apiConfig.mode !== "live";

