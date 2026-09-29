import type { MetadataRoute } from "next";
import { isLive } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  if (!isLive()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/demo", "/api/", "/v3", "/original"] },
    // The WordPress pages' Rank Math sitemap. The redesign under /demo stays out of search.
    sitemap: new URL("/sitemap_index.xml", siteUrl()).toString(),
  };
}
