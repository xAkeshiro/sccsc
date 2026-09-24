import { mkdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
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

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not set. Add a Postgres database (e.g. Neon via the Vercel Marketplace).");
  }
}

/**
 * True when the careers portal has a database to talk to. On Vercel that means DATABASE_URL;
 * locally we fall back to an embedded PGlite database so the app runs with zero setup.
 */
export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL) || !process.env.VERCEL;
}

const globalForDb = globalThis as unknown as { __sccscDb?: Database };

function createDatabase(): Database {
  const url = process.env.DATABASE_URL;
  if (url) {
    // `prepare: false` keeps us compatible with pooled (PgBouncer-style) connection strings such as Neon's.
    return drizzlePostgres(postgres(url, { prepare: false }), { schema });
  }
  if (process.env.VERCEL) throw new DatabaseNotConfiguredError();
  // The PGlite and postgres-js Drizzle clients share the same query-builder API.
  return drizzlePglite(openLocalPglite(), { schema }) as unknown as Database;
}

/** Lazily creates one client per process (and survives dev hot reloads). */
export function getDb(): Database {
  globalForDb.__sccscDb ??= createDatabase();
  return globalForDb.__sccscDb;
}

export { schema };
