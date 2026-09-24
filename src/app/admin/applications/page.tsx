import type { Metadata } from "next";
import { and, desc, eq, type SQL } from "drizzle-orm";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { districts } from "@/content/site";
import { getDb } from "@/db";
import { APPLICATION_STATUSES, applications, jobs, type ApplicationStatus } from "@/db/schema";
import { isUuid } from "@/lib/ids";
import { requireAdmin } from "@/lib/session";
import { applicationStatusMeta } from "@/lib/status";

export const metadata: Metadata = { title: "Applications" };

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const districtShort = Object.fromEntries(districts.map((d) => [d.id, d.short]));

export default async function AdminApplications({ searchParams }: PageProps<"/admin/applications">) {
  await requireAdmin();
  const params = await searchParams;
  const status = APPLICATION_STATUSES.find((s) => s === params.status) as ApplicationStatus | undefined;
  const jobId = isUuid(params.job) ? params.job : undefined;

  const db = getDb();
  const conditions: SQL[] = [];
  if (status) conditions.push(eq(applications.status, status));
  if (jobId) conditions.push(eq(applications.jobId, jobId));

  const [rows, jobOptions] = await Promise.all([
    db
      .select({
        id: applications.id,
        fullName: applications.fullName,
        email: applications.email,
        status: applications.status,
        preferredDistricts: applications.preferredDistricts,
        languages: applications.languages,
        createdAt: applications.createdAt,
        jobTitle: jobs.title,
      })
      .from(applications)
      .innerJoin(jobs, eq(jobs.id, applications.jobId))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(applications.createdAt))
      .limit(500),
    db.select({ id: jobs.id, title: jobs.title }).from(jobs).orderBy(jobs.title),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Applications</h1>

      <form method="get" className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink-100">
        <label>
          <span className="field-label">Status</span>
          <select name="status" defaultValue={status ?? ""} className="field">
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {applicationStatusMeta[s].label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="field-label">Position</span>
          <select name="job" defaultValue={jobId ?? ""} className="field">
            <option value="">All positions</option>
            {jobOptions.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="rounded-xl bg-jade-700 px-5 py-2.5 font-semibold text-white hover:bg-jade-800">
          Filter
        </button>
        {(status || jobId) && (
          <Link href="/admin/applications" className="px-2 py-2.5 text-sm font-semibold text-jade-700 underline">
            Clear
          </Link>
        )}
      </form>

      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-ink-100">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-ink-100 bg-cream-50 text-ink-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Applicant</th>
              <th className="px-4 py-3 font-semibold">Position</th>
              <th className="px-4 py-3 font-semibold">Districts</th>
              <th className="px-4 py-3 font-semibold">Languages</th>
              <th className="px-4 py-3 font-semibold">Applied</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-cream-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/applications/${r.id}`} className="font-semibold text-ink-900 hover:text-jade-700">
                    {r.fullName}
                  </Link>
                  <div className="text-ink-500">{r.email}</div>
                </td>
                <td className="px-4 py-3">{r.jobTitle}</td>
                <td className="px-4 py-3">{r.preferredDistricts.map((d) => districtShort[d] ?? d).join(", ") || "—"}</td>
                <td className="px-4 py-3">{r.languages.join(", ") || "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap">{dateFmt.format(r.createdAt)}</td>
                <td className="px-4 py-3">
                  <Badge tone={applicationStatusMeta[r.status].tone}>{applicationStatusMeta[r.status].label}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-6 text-ink-500">No applications match these filters.</p>}
      </div>
    </div>
  );
}
