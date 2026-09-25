import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { PortalOffline } from "@/components/portal/portal-offline";
import { ResumeDownload } from "@/components/portal/resume-download";
import { SignOutButton } from "@/components/portal/sign-out-button";
import { Badge, Button, ButtonLink, Container } from "@/components/ui";
import { getDb } from "@/db";
import { applications, jobs } from "@/db/schema";
import { portalReady, requireUser } from "@/lib/session";
import { applicationStatusMeta, withdrawableStatuses } from "@/lib/status";
import { withdrawApplication } from "./actions";

export const metadata: Metadata = { title: "My applications" };

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export default async function PortalPage({ searchParams }: PageProps<"/demo/portal">) {
  if (!(await portalReady())) return <PortalOffline />;
  const user = await requireUser("/demo/portal");
  const { applied } = await searchParams;

  const rows = await getDb()
    .select({
      id: applications.id,
      status: applications.status,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
      resumeId: applications.resumeId,
      jobTitle: jobs.title,
      jobSlug: jobs.slug,
    })
    .from(applications)
    .innerJoin(jobs, eq(jobs.id, applications.jobId))
    .where(eq(applications.userId, user.id))
    .orderBy(desc(applications.createdAt));

  const justApplied = typeof applied === "string" ? rows.find((r) => r.jobSlug === applied) : undefined;

  return (
    <Container className="py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-600">Applicant portal</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Hi, {user.name.split(" ")[0]}</h1>
          <p className="mt-1 text-ink-700">{user.email}</p>
        </div>
        <div className="flex items-center gap-4">
          {user.role === "admin" && (
            <ButtonLink href="/demo/admin" variant="secondary" size="sm">
              Admin dashboard
            </ButtonLink>
          )}
          <SignOutButton />
        </div>
      </div>

      {justApplied && (
        <div role="status" className="mt-8 flex items-start gap-3 rounded-2xl bg-brand-50 p-5 ring-1 ring-brand-100">
          <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-brand-600" />
          <div>
            <p className="font-bold text-brand-800">Application submitted — thank you!</p>
            <p className="text-brand-800">
              We received your application for <strong>{justApplied.jobTitle}</strong>. Status updates will appear here.
            </p>
          </div>
        </div>
      )}

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">My applications</h2>
          <ButtonLink href="/demo/careers" size="sm">
            Browse openings
          </ButtonLink>
        </div>

        {rows.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-white p-10 text-center ring-1 ring-ink-100">
            <p className="text-lg font-semibold">You haven&apos;t applied to any positions yet.</p>
            <p className="mt-1 text-ink-700">Find a role that fits and apply in about five minutes.</p>
          </div>
        ) : (
          <ul className="mt-6 grid gap-4">
            {rows.map((row) => {
              const meta = applicationStatusMeta[row.status];
              return (
                <li key={row.id} className="rounded-3xl bg-white p-6 ring-1 ring-ink-100">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <Link href={`/demo/careers/${row.jobSlug}`} className="text-lg font-bold hover:text-brand-700">
                        {row.jobTitle}
                      </Link>
                      <p className="mt-0.5 text-sm text-ink-500">
                        Applied {dateFmt.format(row.createdAt)} · Updated {dateFmt.format(row.updatedAt)}
                      </p>
                    </div>
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </div>
                  <p className="mt-3 text-ink-700">{meta.applicantHint}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    {row.resumeId && (
                      <ResumeDownload
                        resumeId={row.resumeId}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
                      >
                        My résumé
                      </ResumeDownload>
                    )}
                    {withdrawableStatuses.includes(row.status) && (
                      <form action={withdrawApplication.bind(null, row.id)}>
                        <Button type="submit" variant="danger" size="sm">
                          Withdraw
                        </Button>
                      </form>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </Container>
  );
}
