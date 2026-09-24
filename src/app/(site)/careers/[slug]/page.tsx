import type { Metadata } from "next";
import { ArrowLeft, Check, Clock, DollarSign, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortalOffline } from "@/components/portal/portal-offline";
import { Badge, ButtonLink, Container } from "@/components/ui";
import { employmentTypes, jobCategories, org } from "@/content/site";
import { jobPostingJsonLd } from "@/lib/job-syndication";
import { getPublicJob } from "@/lib/jobs";
import { isPortalConfigured } from "@/lib/auth";
import { portalReady } from "@/lib/session";

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">): Promise<Metadata> {
  if (!isPortalConfigured()) return { title: "Careers" };
  const job = await getPublicJob((await params).slug);
  return job ? { title: job.title, description: job.summary } : { title: "Job not found" };
}

export default async function JobPage({ params }: PageProps<"/careers/[slug]">) {
  if (!(await portalReady())) return <PortalOffline />;
  const job = await getPublicJob((await params).slug);
  if (!job) notFound();

  const open = job.status === "open";
  const facts = [
    { icon: MapPin, label: "Location", value: job.location },
    job.schedule && { icon: Clock, label: "Schedule", value: job.schedule },
    job.payRange && { icon: DollarSign, label: "Pay", value: job.payRange },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[];

  return (
    <Container className="py-12 sm:py-16">
      {open && (
        // Google for Jobs reads this structured data; "<" is escaped so job text can't close the script tag.
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd(job)).replace(/</g, "\\u003c") }}
        />
      )}
      <Link href="/careers" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
        <ArrowLeft className="size-4" /> All openings
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <article>
          <div className="flex flex-wrap gap-2">
            <Badge tone="brand">{jobCategories[job.category as keyof typeof jobCategories] ?? job.category}</Badge>
            <Badge tone="sun">{employmentTypes[job.employmentType as keyof typeof employmentTypes] ?? job.employmentType}</Badge>
            {!open && <Badge tone="ink">No longer accepting applications</Badge>}
          </div>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{job.title}</h1>
          <p className="mt-4 text-xl leading-relaxed text-ink-700">{job.summary}</p>
          {job.description && <p className="mt-6 text-lg leading-relaxed text-ink-700">{job.description}</p>}

          {job.responsibilities.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl font-bold">What you&apos;ll do</h2>
              <ul className="mt-4 space-y-3">
                {job.responsibilities.map((r) => (
                  <li key={r} className="flex gap-3 text-ink-900">
                    <Check className="mt-0.5 size-5 shrink-0 text-brand-600" /> {r}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {job.qualifications.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl font-bold">What we&apos;re looking for</h2>
              <ul className="mt-4 space-y-3">
                {job.qualifications.map((q) => (
                  <li key={q} className="flex gap-3 text-ink-900">
                    <Check className="mt-0.5 size-5 shrink-0 text-brand-600" /> {q}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-100">
            <dl className="space-y-4">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3">
                  <Icon className="mt-0.5 size-5 shrink-0 text-brand-600" />
                  <div>
                    <dt className="text-sm font-semibold text-ink-500">{label}</dt>
                    <dd className="text-ink-900">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            {open ? (
              <ButtonLink href={`/careers/${job.slug}/apply`} size="lg" className="mt-6 w-full">
                Apply now
              </ButtonLink>
            ) : (
              <ButtonLink href="/careers" size="lg" variant="secondary" className="mt-6 w-full">
                See current openings
              </ButtonLink>
            )}
            <p className="mt-4 text-center text-sm text-ink-500">
              Questions?{" "}
              <a href={`mailto:${org.emails.careers}`} className="font-semibold text-brand-700 underline">
                {org.emails.careers}
              </a>
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
