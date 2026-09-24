import type { MetadataRoute } from "next";
import { isLive } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  if (!isLive()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/portal", "/api/"] },
    sitemap: new URL("/sitemap.xml", siteUrl()).toString(),
  };
}
