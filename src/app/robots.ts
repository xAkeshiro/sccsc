import type { MetadataRoute } from "next";
import { isLive } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  if (!isLive()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/demo/admin", "/demo/portal", "/api/", "/v3", "/v4"] },
    // The imported WordPress pages keep their Rank Math sitemaps; the redesign has its own.
    sitemap: [new URL("/sitemap_index.xml", siteUrl()).toString(), new URL("/demo/sitemap.xml", siteUrl()).toString()],
  };
}
