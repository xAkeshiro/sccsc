import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sccsc.org";
  return ["", "/programs", "/families", "/careers", "/get-involved", "/about", "/contact"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "/careers" ? "daily" : "monthly",
  }));
}
