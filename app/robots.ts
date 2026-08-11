import type { MetadataRoute } from "next";
import { siteUrl } from "./lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/challenges", "/stories", "/campaigns", "/battles", "/feed", "/about-us", "/contact-us", "/offer"],
        disallow: ["/api/", "/profile", "/wallet", "/messages", "/notifications", "/settings", "/create", "/edit", "/login", "/register", "/forgot-password", "/reset-password", "/verify-email", "/search", "/screens"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

