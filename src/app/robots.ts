import type { MetadataRoute } from "next";
import { isLive } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  if (!isLive()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/portal", "/api/"] },
    sitemap: new URL("/sitemap.xml", process.env.NEXT_PUBLIC_SITE_URL ?? "https://sccsc.org").toString(),
  };
}
