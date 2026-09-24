import "server-only";

import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import { jobs, type Job } from "@/db/schema";

export type JobFilters = { q?: string; category?: string; type?: string };

export async function listOpenJobs(filters: JobFilters = {}): Promise<Job[]> {
  const conditions: SQL[] = [eq(jobs.status, "open")];
  if (filters.category) conditions.push(eq(jobs.category, filters.category));
  if (filters.type) conditions.push(eq(jobs.employmentType, filters.type));
  if (filters.q) {
    const pattern = `%${filters.q.replace(/[%_\\]/g, (c) => `\\${c}`)}%`;
    conditions.push(or(ilike(jobs.title, pattern), ilike(jobs.summary, pattern), ilike(jobs.location, pattern))!);
  }
  return getDb()
    .select()
    .from(jobs)
    .where(and(...conditions))
    .orderBy(desc(jobs.postedAt), jobs.title);
}

/** Public lookup: only open or closed postings are visible (drafts 404). */
export async function getPublicJob(slug: string): Promise<Job | null> {
  const [job] = await getDb().select().from(jobs).where(eq(jobs.slug, slug));
  if (!job || job.status === "draft") return null;
  return job;
}
