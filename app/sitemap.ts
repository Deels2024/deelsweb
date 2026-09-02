import type { MetadataRoute } from "next";
import { siteUrl } from "./lib/seo";

const publicRoutes = [
  "/",
  "/challenges",
  "/feed",
  "/battles",
  "/stories",
  "/campaigns",
  "/about-us",
  "/contact-us",
  "/offer",
  "/documents/terms",
  "/documents/privacy",
  "/documents/content",
  "/documents/payments",
  "/documents/cookies",
];

async function dynamicRoutes(): Promise<MetadataRoute.Sitemap> {
  const backend = process.env.DEELS_BACKEND_URL?.replace(/\/$/, "");
  if (!backend) return [];
  const kinds = ["challenges", "battles", "stories", "campaigns"] as const;
  const results = await Promise.all(
    kinds.map(async (kind) => {
      try {
        const response = await fetch(`${backend}/api/${kind}?limit=100&status=published`, {
          headers: { Accept: "application/json" },
          next: { revalidate: 900 },
        });
        if (!response.ok) return [];
        const payload = (await response.json()) as Record<string, unknown>;
        const root = (payload.data || payload.result || payload) as unknown;
        const rows = Array.isArray(root)
          ? root
          : Array.isArray((root as Record<string, unknown>)?.items)
            ? ((root as Record<string, unknown>).items as unknown[])
            : [];
        return rows.flatMap((value) => {
          const row = value as Record<string, unknown>;
          const id = String(row.slug || row.uuid || row.id || "");
          if (!id) return [];
          return [{
            url: `${siteUrl}/${kind}/${encodeURIComponent(id)}`,
            lastModified: row.updated_at ? new Date(String(row.updated_at)) : new Date(),
            changeFrequency: "daily" as const,
            priority: kind === "challenges" || kind === "battles" ? 0.8 : 0.7,
          }];
        });
      } catch {
        return [];
      }
    }),
  );
  return results.flat();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = publicRoutes.map((route) => ({
    url: `${siteUrl}${route === "/" ? "" : route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : route === "/challenges" || route === "/battles" ? 0.9 : 0.7,
  }));
  return [...staticEntries, ...(await dynamicRoutes())];
}
