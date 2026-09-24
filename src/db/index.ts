import { mkdirSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { drizzle as drizzlePostgres, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

/** Where `npm run dev` keeps its embedded Postgres when DATABASE_URL is unset. */
export const LOCAL_DB_DIR = ".data/pglite";

/** Opens (creating if needed) the local embedded database. Only one process may hold it at a time. */
export function openLocalPglite() {
  mkdirSync(LOCAL_DB_DIR, { recursive: true });
  return new PGlite(LOCAL_DB_DIR);
}

/**
 * Demo mode: deployed (on Vercel) without a DATABASE_URL, or forced with DEMO_MODE=true.
 * The portal then runs on a throwaway in-memory database seeded with sample jobs and a demo
 * admin. Data lives only as long as the server instance, so it resets periodically.
 */
export function isDemoMode() {
  if (process.env.DATABASE_URL?.trim()) return false;
  return Boolean(process.env.VERCEL) || process.env.DEMO_MODE === "true";
}

/**
 * postgres.js client for a hosted database (Supabase, Neon…). Uses TLS for anything but a local
 * server, and `prepare: false` so it works through transaction poolers like Supabase's (port 6543).
 */
export function createPostgresClient(url: string, options: postgres.Options<Record<string, never>> = {}) {
  const local = /@(localhost|127\.0\.0\.1)(:|\/)/.test(url);
  return postgres(url, { prepare: false, ssl: local ? false : "require", ...options });
}

type DbGlobals = { __sccscDb?: Database; __sccscDbReady?: Promise<void> };
const globalForDb = globalThis as unknown as DbGlobals;

function createDatabase(): Database {
  const url = process.env.DATABASE_URL?.trim();
  if (url) {
    return drizzlePostgres(createPostgresClient(url), { schema });
  }
  // The PGlite and postgres-js Drizzle clients share the same query-builder API.
  const client = isDemoMode() ? new PGlite() : openLocalPglite();
  return drizzlePglite(client, { schema }) as unknown as Database;
}

/** Lazily creates one client per process (and survives dev hot reloads). */
export function getDb(): Database {
  globalForDb.__sccscDb ??= createDatabase();
  return globalForDb.__sccscDb;
}

/**
 * Resolves once the database can serve queries. Real and local databases are migrated by
 * scripts/migrate.ts; the in-memory demo database is migrated and seeded here on first use.
 */
export function ensureDbReady(): Promise<void> {
  globalForDb.__sccscDbReady ??= (async () => {
    if (!isDemoMode()) return;
    const db = getDb();
    await migratePglite(db as never, { migrationsFolder: path.join(process.cwd(), "drizzle") });
    const { seedIfEmpty } = await import("./seed");
    await seedIfEmpty(db, { demoAdmin: true, quiet: true });
  })().catch((err) => {
    // Allow a retry on the next request rather than caching the failure forever.
    globalForDb.__sccscDbReady = undefined;
    throw err;
  });
  return globalForDb.__sccscDbReady;
}

export { schema };
