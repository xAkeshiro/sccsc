/**
 * Creates an admin account, or promotes an existing account to admin.
 *
 *   DATABASE_URL=... ADMIN_PASSWORD='...' npm run admin:create -- hr@sccsc.org "HR Team"
 *
 * If the email already has an account, it is promoted and its password is left unchanged.
 * (Locally, stop `npm run dev` first — the embedded database allows one process at a time.)
 */
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { createPostgresClient, openLocalPglite, type Database } from "../src/db";
import * as schema from "../src/db/schema";
import { upsertAdmin } from "../src/db/admin";

async function main() {
  const [email, ...nameParts] = process.argv.slice(2);
  if (!email) {
    console.error('Usage: npm run admin:create -- <email> "<Full Name>"   (ADMIN_PASSWORD env for new accounts)');
    process.exit(1);
  }
  const name = nameParts.join(" ") || email.split("@")[0];
  const password = process.env.ADMIN_PASSWORD;

  if (process.env.DATABASE_URL) {
    const client = createPostgresClient(process.env.DATABASE_URL, { max: 1 });
    await upsertAdmin(drizzlePostgres(client, { schema }), { email, name, password });
    await client.end();
  } else {
    const client = openLocalPglite();
    await upsertAdmin(drizzlePglite(client, { schema }) as unknown as Database, { email, name, password });
    await client.close();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
