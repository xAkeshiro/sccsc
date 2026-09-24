import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PortalOffline } from "@/components/portal/portal-offline";
import { ButtonLink, Container } from "@/components/ui";
import { getDb } from "@/db";
import { applicantProfiles, applications } from "@/db/schema";
import { getPublicJob } from "@/lib/jobs";
import { portalReady, requireUser } from "@/lib/session";
import { submitApplication } from "./actions";
import { ApplyForm } from "./apply-form";

export const metadata: Metadata = { title: "Apply" };

export default async function ApplyPage({ params }: PageProps<"/careers/[slug]/apply">) {
  if (!(await portalReady())) return <PortalOffline />;
  const { slug } = await params;
  const user = await requireUser(`/careers/${slug}/apply`);
  const job = await getPublicJob(slug);
  if (!job) notFound();
  if (job.status !== "open") redirect(`/careers/${slug}`);

  const db = getDb();
  const [[existing], [profile]] = await Promise.all([
    db
      .select({ id: applications.id })
      .from(applications)
      .where(and(eq(applications.jobId, job.id), eq(applications.userId, user.id))),
    db.select().from(applicantProfiles).where(eq(applicantProfiles.userId, user.id)),
  ]);

  return (
    <Container className="py-12 sm:py-16">
      <Link href={`/careers/${slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
        <ArrowLeft className="size-4" /> Back to job details
      </Link>
      <div className="mx-auto mt-6 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-600">Application</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{job.title}</h1>

        {existing ? (
          <div className="mt-8 rounded-3xl bg-white p-8 ring-1 ring-ink-100">
            <p className="text-lg font-semibold">You&apos;ve already applied for this position.</p>
            <p className="mt-1 text-ink-700">You can check its status any time in your applicant portal.</p>
            <ButtonLink href="/portal" className="mt-6">
              Go to my portal
            </ButtonLink>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-ink-100 sm:p-8">
            <p className="mb-8 text-ink-700">
              Takes about 5 minutes. We&apos;ll save your details so future applications are even faster.
            </p>
            <ApplyForm
              action={submitApplication.bind(null, slug)}
              defaults={{
                fullName: user.name,
                email: user.email,
                phone: profile?.phone ?? "",
                city: profile?.city ?? "",
                educationLevel: profile?.educationLevel ?? "",
                languages: profile?.languages ?? [],
              }}
            />
          </div>
        )}
      </div>
    </Container>
  );
}
