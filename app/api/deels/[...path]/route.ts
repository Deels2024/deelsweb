import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 250 * 1024 * 1024;
const unsafeHeaders = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function backendBase(): URL | null {
  const value = process.env.DEELS_BACKEND_URL?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url : null;
  } catch {
    return null;
  }
}

function targetUrl(base: URL, path: string[], request: NextRequest): URL {
  const clean = path
    .filter((part) => part && part !== "." && part !== "..")
    .map(encodeURIComponent)
    .join("/");
  const basePath = base.pathname.replace(/\/$/, "");
  const target = new URL(`${basePath}/${clean}`, base.origin);
  target.search = request.nextUrl.search;
  return target;
}

function forwardedHeaders(request: NextRequest): Headers {
  const headers = new Headers(request.headers);
  unsafeHeaders.forEach((name) => headers.delete(name));
  headers.set("accept", "application/json");
  headers.set("x-forwarded-host", request.nextUrl.host);
  headers.set("x-forwarded-proto", request.nextUrl.protocol.replace(":", ""));
  headers.set("x-requested-with", "XMLHttpRequest");
  return headers;
}

function responseHeaders(source: Headers, currentOrigin: string): Headers {
  const headers = new Headers(source);
  unsafeHeaders.forEach((name) => headers.delete(name));
  headers.set("x-content-type-options", "nosniff");
  const location = headers.get("location");
  if (location) {
    try {
      const url = new URL(location);
      headers.set(
        "location",
        `${currentOrigin}/api/deels${url.pathname}${url.search}`,
      );
    } catch {
      // Relative redirects are already same-origin safe.
    }
  }
  const cookie = headers.get("set-cookie");
  if (cookie) {
    headers.set(
      "set-cookie",
      cookie
        .replace(/;\s*Domain=[^;]+/gi, "")
        .replace(/;\s*SameSite=None/gi, "; SameSite=Lax"),
    );
  }
  return headers;
}

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const base = backendBase();
  if (!base) {
    return Response.json(
      {
        message: "Backend Deels не настроен",
        code: "DEELS_BACKEND_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return Response.json(
      { message: "Файл превышает допустимый размер", code: "PAYLOAD_TOO_LARGE" },
      { status: 413 },
    );
  }

  const { path } = await context.params;
  if (!path.length || path.some((part) => !part || part === "." || part === "..")) {
    return Response.json(
      { message: "Некорректный API-маршрут", code: "INVALID_API_PATH" },
      { status: 400 },
    );
  }

  const method = request.method.toUpperCase();
  const body = ["GET", "HEAD"].includes(method)
    ? undefined
    : await request.arrayBuffer();

  if (body && body.byteLength > MAX_BODY_BYTES) {
    return Response.json(
      { message: "Файл превышает допустимый размер", code: "PAYLOAD_TOO_LARGE" },
      { status: 413 },
    );
  }

  try {
    const upstream = await fetch(targetUrl(base, path, request), {
      method,
      headers: forwardedHeaders(request),
      body,
      redirect: "manual",
      cache: "no-store",
    });
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders(upstream.headers, request.nextUrl.origin),
    });
  } catch {
    return Response.json(
      {
        message: "Бэкенд Deels временно недоступен",
        code: "DEELS_BACKEND_UNAVAILABLE",
      },
      { status: 502 },
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
