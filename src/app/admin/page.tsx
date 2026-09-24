import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { getDb } from "@/db";
import { APPLICATION_STATUSES, applications, jobs } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { applicationStatusMeta } from "@/lib/status";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export default async function AdminOverview() {
  await requireAdmin();
  const db = getDb();

  const [byStatus, [openJobs], recent] = await Promise.all([
    db.select({ status: applications.status, n: count() }).from(applications).groupBy(applications.status),
    db.select({ n: count() }).from(jobs).where(eq(jobs.status, "open")),
    db
      .select({ id: applications.id, fullName: applications.fullName, status: applications.status, createdAt: applications.createdAt, jobTitle: jobs.title })
      .from(applications)
      .innerJoin(jobs, eq(jobs.id, applications.jobId))
      .orderBy(desc(applications.createdAt))
      .limit(8),
  ]);
  const counts = Object.fromEntries(byStatus.map((r) => [r.status, r.n])) as Record<string, number>;
  const total = byStatus.reduce((sum, r) => sum + r.n, 0);

  const tiles = [
    { label: "New (submitted)", value: counts.submitted ?? 0, href: "/admin/applications?status=submitted" },
    { label: "In review", value: counts.reviewing ?? 0, href: "/admin/applications?status=reviewing" },
    { label: "Interviewing", value: counts.interview ?? 0, href: "/admin/applications?status=interview" },
    { label: "Open postings", value: openJobs.n, href: "/admin/jobs" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Recruitment overview</h1>
        <p className="mt-1 text-ink-700">{total} applications received in total.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="rounded-2xl bg-white p-5 ring-1 ring-ink-100 hover:ring-jade-200">
            <p className="text-sm font-medium text-ink-500">{t.label}</p>
            <p className="mt-1 font-display text-4xl font-extrabold text-ink-900">{t.value}</p>
          </Link>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Latest applications</h2>
          <Link href="/admin/applications" className="text-sm font-semibold text-jade-700 hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-ink-100">
          {recent.length === 0 ? (
            <p className="p-6 text-ink-500">No applications yet.</p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {recent.map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/applications/${r.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-cream-50">
                    <span>
                      <span className="font-semibold">{r.fullName}</span>
                      <span className="text-ink-500"> · {r.jobTitle}</span>
                    </span>
                    <span className="flex items-center gap-3 text-sm text-ink-500">
                      {dateFmt.format(r.createdAt)}
                      <Badge tone={applicationStatusMeta[r.status].tone}>{applicationStatusMeta[r.status].label}</Badge>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">Pipeline</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {APPLICATION_STATUSES.map((s) => (
            <Link key={s} href={`/admin/applications?status=${s}`} className="rounded-full bg-white px-4 py-2 text-sm ring-1 ring-ink-100 hover:ring-jade-200">
              {applicationStatusMeta[s].label} <strong className="ml-1">{counts[s] ?? 0}</strong>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
