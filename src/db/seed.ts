import { count } from "drizzle-orm";
import type { Database } from ".";
import { upsertAdmin } from "./admin";
import { jobs } from "./schema";
import { sampleJobs } from "./seed-data";

export const DEMO_ADMIN = { email: "admin@example.com", password: "center-admin-demo", name: "Demo Admin" };

/** Inserts the sample job postings if the jobs table is empty. */
export async function seedIfEmpty(db: Database, opts: { demoAdmin?: boolean; quiet?: boolean } = {}) {
  const log = opts.quiet ? () => {} : console.log;
  const [{ n }] = await db.select({ n: count() }).from(jobs);
  if (n === 0) {
    // Stagger timestamps so the board lists postings in the order they appear in seed-data.ts.
    const now = Date.now();
    await db
      .insert(jobs)
      .values(sampleJobs.map((j, i) => ({ ...j, postedAt: j.status === "open" ? new Date(now - i * 60_000) : null })));
    log(`✓ Seeded ${sampleJobs.length} sample job postings`);
  }
  // Local-only convenience so the admin dashboard can be explored immediately.
  if (opts.demoAdmin) {
    const created = await upsertAdmin(db, DEMO_ADMIN, { onlyIfMissing: true });
    if (created) log(`✓ Local demo admin: ${DEMO_ADMIN.email} / ${DEMO_ADMIN.password}`);
  }
}
