import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl().origin;
  return ["", "/programs", "/families", "/careers", "/get-involved", "/about", "/contact"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "/careers" ? "daily" : "monthly",
  }));
}
