import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite ships WASM + data files that must be loaded from node_modules at runtime.
  serverExternalPackages: ["@electric-sql/pglite"],
  // Demo mode migrates an in-memory database at runtime, so ship the SQL migrations and PGlite's
  // WASM/data files with every server function.
  outputFileTracingIncludes: {
    "/**": ["./drizzle/**/*", "./node_modules/@electric-sql/pglite/dist/**/*"],
  },
  experimental: {
    serverActions: {
      // Résumé uploads are capped at 4 MB in the action itself; leave headroom for the rest of the form.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
