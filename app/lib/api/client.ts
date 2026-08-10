import { apiConfig } from "./config";
import { endpoints } from "./endpoints";
import type { ApiRequestOptions, UnknownRecord } from "./types";

const TOKEN_KEY = "deels_access_token";
const mutationMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
let csrfReady: Promise<void> | null = null;

export class ApiError extends Error { constructor(message: string, public readonly status: number, public readonly errors: Record<string, string[]> = {}, public readonly payload?: unknown) { super(message); this.name = "ApiError"; } }
export class ApiDisabledError extends ApiError { constructor() { super("API отключён: используется демонстрационный режим", 0); this.name = "ApiDisabledError"; } }
export function setAccessToken(token?: string): void { if (typeof window === "undefined") return; if (token) window.sessionStorage.setItem(TOKEN_KEY, token); else window.sessionStorage.removeItem(TOKEN_KEY); }
export function getAccessToken(): string | undefined { if (typeof window === "undefined") return undefined; return window.sessionStorage.getItem(TOKEN_KEY) || undefined; }
function absoluteUrl(path: string): string { if (/^https?:\/\//i.test(path)) return path; return `${apiConfig.baseUrl}/${path.replace(/^\//, "")}`; }
function isRecord(value: unknown): value is UnknownRecord { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
function validationErrors(payload: unknown): Record<string, string[]> { if (!isRecord(payload) || !isRecord(payload.errors)) return {}; return Object.fromEntries(Object.entries(payload.errors).map(([key, value]) => [key, Array.isArray(value) ? value.map(String) : [String(value)]])); }
function errorMessage(payload: unknown, status: number): string { if (isRecord(payload)) { const message = payload.message ?? payload.error ?? payload.detail; if (typeof message === "string" && message.trim()) return message; } if (status === 401) return "Нужно войти в аккаунт"; if (status === 403) return "Недостаточно прав для этого действия"; if (status === 404) return "Данные не найдены"; if (status === 422) return "Проверьте заполненные поля"; if (status >= 500) return "Сервис временно недоступен"; return `Ошибка запроса (${status})`; }
async function ensureCsrf(): Promise<void> { if (apiConfig.authMode !== "cookie") return; csrfReady ??= fetch(absoluteUrl(endpoints.csrf), { method: "GET", credentials: "include", headers: { Accept: "application/json" } }).then((response) => { if (!response.ok && response.status !== 204) throw new ApiError("Не удалось инициализировать защищённую сессию", response.status); }).catch((error) => { csrfReady = null; throw error; }); return csrfReady; }

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  if (apiConfig.mode === "demo") throw new ApiDisabledError();
  const method = (options.method || "GET").toUpperCase();
  if (mutationMethods.has(method) && !options.skipCsrf) await ensureCsrf();
  const headers = new Headers(options.headers); headers.set("Accept", "application/json");
  const token = apiConfig.authMode === "bearer" ? getAccessToken() : undefined; if (token) headers.set("Authorization", `Bearer ${token}`);
  let body = options.body as BodyInit | null | undefined;
  if (body && typeof body === "object" && !(body instanceof FormData) && !(body instanceof Blob) && !(body instanceof URLSearchParams)) { headers.set("Content-Type", "application/json"); body = JSON.stringify(body); }
  const controller = new AbortController(); const timeout = globalThis.setTimeout(() => controller.abort(), options.timeoutMs ?? apiConfig.timeoutMs);
  try {
    const response = await fetch(absoluteUrl(path), { ...options, method, headers, body, credentials: "include", signal: controller.signal });
    const payload: unknown = (response.headers.get("content-type") || "").includes("application/json") ? await response.json() : await response.text();
    if (!response.ok) { if (response.status === 401 && apiConfig.authMode === "bearer") setAccessToken(); throw new ApiError(errorMessage(payload, response.status), response.status, validationErrors(payload), payload); }
    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") throw new ApiError("Сервер не ответил вовремя", 408);
    throw new ApiError("Не удалось связаться с сервером Deels", 0, {}, error);
  } finally { globalThis.clearTimeout(timeout); }
}
export function unwrapData<T>(payload: unknown): T { if (isRecord(payload) && "data" in payload) return payload.data as T; if (isRecord(payload) && "result" in payload) return payload.result as T; return payload as T; }
export function unwrapList(payload: unknown): { rows: unknown[]; total: number; nextPage?: number; nextCursor?: string } { const root = unwrapData<unknown>(payload); if (Array.isArray(root)) return { rows: root, total: root.length }; if (!isRecord(root)) return { rows: [], total: 0 }; const rows = [root.items, root.results, root.data].find(Array.isArray) as unknown[] | undefined; const meta = isRecord(root.meta) ? root.meta : root; return { rows: rows || [], total: Number(meta.total ?? (rows || []).length), nextPage: meta.next_page ? Number(meta.next_page) : undefined, nextCursor: typeof meta.next_cursor === "string" ? meta.next_cursor : undefined }; }
export function apiErrorText(error: unknown): string { return error instanceof Error ? error.message : "Неизвестная ошибка"; }
