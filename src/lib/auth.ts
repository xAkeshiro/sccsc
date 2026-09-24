import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { getDb, isDatabaseConfigured, schema } from "@/db";

/** The portal needs a database and, in production, a signing secret (Better Auth refuses to start without one). */
export function isPortalConfigured() {
  return isDatabaseConfigured() && (process.env.NODE_ENV !== "production" || Boolean(process.env.BETTER_AUTH_SECRET));
}

/**
 * Hosts Better Auth will accept as its base URL. Vercel injects the deployment, branch and
 * production hostnames automatically; add a custom domain via AUTH_ALLOWED_HOSTS (comma-separated).
 */
function allowedHosts() {
  const hosts = [
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    ...(process.env.AUTH_ALLOWED_HOSTS?.split(",") ?? []),
  ];
  if (process.env.NODE_ENV !== "production") hosts.push("localhost:*", "127.0.0.1:*");
  return hosts.map((h) => h?.trim()).filter((h): h is string => Boolean(h));
}

function createAuth() {
  return betterAuth({
    appName: "The Center — Careers",
    baseURL: process.env.BETTER_AUTH_URL?.trim() || {
      allowedHosts: allowedHosts(),
      protocol: process.env.NODE_ENV === "production" ? "https" : "auto",
    },
    database: drizzleAdapter(getDb(), { provider: "pg", schema }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      autoSignIn: true,
    },
    user: {
      additionalFields: {
        // Never accepted from sign-up input; promote admins with `npm run admin:create`.
        role: { type: "string", required: false, defaultValue: "applicant", input: false },
      },
    },
    rateLimit: {
      enabled: true,
      storage: "database",
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
        "/sign-up/email": { window: 60, max: 3 },
      },
    },
    // Must stay last so Set-Cookie headers from server actions reach the browser.
    plugins: [nextCookies()],
  });
}

type Auth = ReturnType<typeof createAuth>;
const globalForAuth = globalThis as unknown as { __sccscAuth?: Auth };

/** Created on first use so marketing pages build and render even before a database is attached. */
export function getAuth(): Auth {
  globalForAuth.__sccscAuth ??= createAuth();
  return globalForAuth.__sccscAuth;
}
