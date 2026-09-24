/**
 * Applies SQL migrations from ./drizzle.
 *
 *   npm run db:migrate          — against DATABASE_URL (skips with a notice if unset on Vercel/CI)
 *   predev (automatic)          — against the local PGlite database, seeding sample jobs on first run
 */
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { migrate as migratePostgres } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { LOCAL_DB_DIR, openLocalPglite } from "../src/db";
import * as schema from "../src/db/schema";
import { seedIfEmpty } from "../src/db/seed";

const migrationsFolder = "./drizzle";
const shouldSeed = process.argv.includes("--seed-if-empty");

async function main() {
  const url = process.env.DATABASE_URL;

  if (url) {
    const client = postgres(url, { prepare: false, max: 1, onnotice: () => {} });
    const db = drizzlePostgres(client, { schema });
    await migratePostgres(db, { migrationsFolder });
    console.log("✓ Migrations applied to DATABASE_URL");
    if (shouldSeed) await seedIfEmpty(db);
    await client.end();
    return;
  }

  if (process.env.VERCEL || process.env.CI) {
    console.log("ℹ DATABASE_URL is not set — skipping migrations. The careers portal will run in demo mode (in-memory sample data).");
    return;
  }

  const client = openLocalPglite();
  const db = drizzlePglite(client, { schema });
  await migratePglite(db, { migrationsFolder });
  console.log(`✓ Migrations applied to local database (${LOCAL_DB_DIR})`);
  // The query-builder API is identical across drivers.
  if (shouldSeed) await seedIfEmpty(db as unknown as Parameters<typeof seedIfEmpty>[0], { demoAdmin: true });
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
