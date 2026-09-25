import type { Metadata } from "next";
import { asc, eq } from "drizzle-orm";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResumeDownload } from "@/components/portal/resume-download";
import { Badge, Button } from "@/components/ui";
import { districts } from "@/content/site";
import { getDb } from "@/db";
import { APPLICATION_STATUSES, applicationEvents, applications, jobs, resumes, user } from "@/db/schema";
import { isUuid } from "@/lib/ids";
import { requireAdmin } from "@/lib/session";
import { applicationStatusMeta } from "@/lib/status";
import { updateApplication } from "../../actions";

export const metadata: Metadata = { title: "Application" };

const dateTimeFmt = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });
const districtName = Object.fromEntries(districts.map((d) => [d.id, d.name]));

export default async function AdminApplicationDetail({ params }: PageProps<"/demo/admin/applications/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const db = getDb();

  const [app] = await db
    .select({
      application: applications,
      jobTitle: jobs.title,
      jobSlug: jobs.slug,
      resumeName: resumes.fileName,
      resumeSize: resumes.size,
    })
    .from(applications)
    .innerJoin(jobs, eq(jobs.id, applications.jobId))
    .leftJoin(resumes, eq(resumes.id, applications.resumeId))
    .where(eq(applications.id, id));
  if (!app) notFound();

  const events = await db
    .select({ status: applicationEvents.status, createdAt: applicationEvents.createdAt, actor: user.name })
    .from(applicationEvents)
    .leftJoin(user, eq(user.id, applicationEvents.actorId))
    .where(eq(applicationEvents.applicationId, id))
    .orderBy(asc(applicationEvents.createdAt));

  const a = app.application;
  const details: [string, string][] = [
    ["City", a.city || "—"],
    ["Preferred districts", a.preferredDistricts.map((d) => districtName[d] ?? d).join(", ") || "No preference"],
    ["Availability", a.availability.join(", ") || "—"],
    ["Earliest start", a.earliestStart || "—"],
    ["Education", a.educationLevel || "—"],
    ["Languages", a.languages.join(", ") || "—"],
  ];

  return (
    <div className="space-y-6">
      <Link href="/demo/admin/applications" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
        <ArrowLeft className="size-4" /> All applications
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{a.fullName}</h1>
          <p className="mt-1 text-ink-700">
            Applied for{" "}
            <Link href={`/demo/careers/${app.jobSlug}`} className="font-semibold text-brand-700 hover:underline">
              {app.jobTitle}
            </Link>{" "}
            · {dateTimeFmt.format(a.createdAt)}
          </p>
        </div>
        <Badge tone={applicationStatusMeta[a.status].tone}>{applicationStatusMeta[a.status].label}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6 ring-1 ring-ink-100">
            <div className="flex flex-wrap gap-3">
              <a href={`mailto:${a.email}`} className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800">
                <Mail className="size-4" /> {a.email}
              </a>
              <a href={`tel:${a.phone}`} className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800">
                <Phone className="size-4" /> {a.phone}
              </a>
              {a.resumeId && (
                <ResumeDownload
                  resumeId={a.resumeId}
                  icon="download"
                  className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  {app.resumeName} ({Math.ceil((app.resumeSize ?? 0) / 1024)} KB)
                </ResumeDownload>
              )}
            </div>
            <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {details.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-sm font-semibold text-ink-500">{label}</dt>
                  <dd className="mt-0.5 text-ink-900">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl bg-white p-6 ring-1 ring-ink-100">
            <h2 className="text-lg font-bold">Note from applicant</h2>
            <p className="mt-2 whitespace-pre-wrap text-ink-700">{a.coverNote || "No note provided."}</p>
          </section>
        </div>

        <aside className="space-y-6">
          <form action={updateApplication.bind(null, a.id)} className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-ink-100">
            <h2 className="text-lg font-bold">Review</h2>
            <div>
              <label htmlFor="status" className="field-label">
                Status
              </label>
              <select id="status" name="status" defaultValue={a.status} className="field">
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {applicationStatusMeta[s].label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-ink-500">The applicant sees status changes in their portal.</p>
            </div>
            <div>
              <label htmlFor="adminNotes" className="field-label">
                Internal notes
              </label>
              <textarea id="adminNotes" name="adminNotes" rows={5} defaultValue={a.adminNotes ?? ""} className="field" />
              <p className="mt-1.5 text-xs text-ink-500">Only visible to admins.</p>
            </div>
            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>

          <section className="rounded-2xl bg-white p-6 ring-1 ring-ink-100">
            <h2 className="text-lg font-bold">History</h2>
            <ol className="mt-4 space-y-3">
              {events.map((e, i) => (
                <li key={i} className="text-sm">
                  <span className="font-semibold">{applicationStatusMeta[e.status].label}</span>
                  <span className="text-ink-500">
                    {" "}
                    · {dateTimeFmt.format(e.createdAt)}
                    {e.actor ? ` · ${e.actor}` : ""}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}
