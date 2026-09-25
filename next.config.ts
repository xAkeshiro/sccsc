import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite ships WASM + data files that must be loaded from node_modules at runtime.
  serverExternalPackages: ["@electric-sql/pglite"],
  // Demo mode migrates an in-memory database at runtime, so ship the SQL migrations and PGlite's
  // WASM/data files with every server function.
  outputFileTracingIncludes: {
    "/**": ["./drizzle/**/*", "./node_modules/@electric-sql/pglite/dist/**/*"],
  },
  // The current WordPress site (a Simply Static export in public/) is served at the root; the
  // redesign lives under /demo. Page URLs like /about-us map to their exported index.html files.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        { source: "/", destination: "/index.html" },
        { source: "/:path+", destination: "/:path+/index.html" },
      ],
    };
  },
  async headers() {
    // Keep preview deployments (including the copied WordPress pages) out of search results.
    if (process.env.NEXT_PUBLIC_SITE_LIVE === "true") return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  experimental: {
    serverActions: {
      // Résumé uploads are capped at 3 MB in the action itself; leave headroom for the rest of the form.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
