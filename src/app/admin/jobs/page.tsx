import type { Metadata } from "next";
import { count, desc, eq, getTableColumns } from "drizzle-orm";
import Link from "next/link";
import { Badge, Button, ButtonLink } from "@/components/ui";
import { employmentTypes } from "@/content/site";
import { getDb } from "@/db";
import { applications, jobs } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { jobStatusMeta } from "@/lib/status";
import { setJobStatus } from "../actions";

export const metadata: Metadata = { title: "Job postings" };

export default async function AdminJobs() {
  await requireAdmin();
  const rows = await getDb()
    .select({ ...getTableColumns(jobs), applicants: count(applications.id) })
    .from(jobs)
    .leftJoin(applications, eq(applications.jobId, jobs.id))
    .groupBy(jobs.id)
    .orderBy(desc(jobs.updatedAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Job postings</h1>
        <ButtonLink href="/admin/jobs/new">New posting</ButtonLink>
      </div>
      <ul className="grid gap-3">
        {rows.map((job) => (
          <li key={job.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 ring-1 ring-ink-100">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={jobStatusMeta[job.status].tone}>{jobStatusMeta[job.status].label}</Badge>
                <span className="text-sm text-ink-500">{employmentTypes[job.employmentType as keyof typeof employmentTypes]}</span>
              </div>
              <Link href={`/admin/jobs/${job.id}`} className="mt-1 block text-lg font-bold hover:text-jade-700">
                {job.title}
              </Link>
              <Link href={`/admin/applications?job=${job.id}`} className="text-sm font-semibold text-jade-700 hover:underline">
                {job.applicants} {job.applicants === 1 ? "applicant" : "applicants"}
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.status !== "open" && (
                <form action={setJobStatus.bind(null, job.id, "open")}>
                  <Button size="sm" type="submit">
                    Publish
                  </Button>
                </form>
              )}
              {job.status === "open" && (
                <form action={setJobStatus.bind(null, job.id, "closed")}>
                  <Button size="sm" variant="secondary" type="submit">
                    Close
                  </Button>
                </form>
              )}
              <ButtonLink href={`/admin/jobs/${job.id}`} size="sm" variant="secondary">
                Edit
              </ButtonLink>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
