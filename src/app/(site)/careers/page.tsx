import type { Metadata } from "next";
import { ArrowRight, Clock, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { PortalOffline } from "@/components/portal/portal-offline";
import { Badge, ButtonLink, Container, PageHero } from "@/components/ui";
import { employmentTypes, jobCategories } from "@/content/site";
import { listOpenJobs } from "@/lib/jobs";
import { portalReady } from "@/lib/session";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join The Center. After-school Team Leader, program leadership, AmeriCorps and volunteer roles across the Sacramento region.",
};

const perks = [
  "Work at a school in your own community",
  "Flexible shift scheduling",
  "A real path into education & youth development",
  "Bilingual staff welcome — our families speak many languages",
];

export default async function CareersPage({ searchParams }: PageProps<"/careers">) {
  if (!(await portalReady())) return <PortalOffline />;

  const params = await searchParams;
  const str = (v: string | string[] | undefined) => (typeof v === "string" && v ? v : undefined);
  const filters = {
    q: str(params.q)?.slice(0, 100),
    category: str(params.category),
    type: str(params.type),
  };
  const jobList = await listOpenJobs(filters);
  const filtered = Boolean(filters.q || filters.category || filters.type);

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Do work that matters — right after the bell"
        intro="Join the team that keeps 13,000+ students safe, engaged and inspired every school day. Create an account once, apply in minutes, and track your application online."
      >
        <ul className="mt-8 grid gap-2 sm:grid-cols-2">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-2 text-jade-50">
              <span className="size-1.5 rounded-full bg-sun-300" /> {p}
            </li>
          ))}
        </ul>
      </PageHero>

      <Container className="py-12">
        <form method="get" className="grid gap-3 rounded-3xl bg-white p-4 ring-1 ring-ink-100 sm:grid-cols-[1fr_auto_auto_auto]" role="search">
          <label className="relative">
            <span className="sr-only">Search jobs</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-ink-300" />
            <input name="q" defaultValue={filters.q} placeholder="Search by title or location" className="field pl-11" />
          </label>
          <label>
            <span className="sr-only">Category</span>
            <select name="category" defaultValue={filters.category ?? ""} className="field">
              <option value="">All categories</option>
              {Object.entries(jobCategories).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Job type</span>
            <select name="type" defaultValue={filters.type ?? ""} className="field">
              <option value="">All types</option>
              {Object.entries(employmentTypes).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700">
            Search
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-ink-700" aria-live="polite">
            <strong className="text-ink-900">{jobList.length}</strong> open {jobList.length === 1 ? "position" : "positions"}
          </p>
          {filtered && (
            <Link href="/careers" className="text-sm font-semibold text-jade-700 underline">
              Clear filters
            </Link>
          )}
        </div>

        <ul className="mt-4 grid gap-4">
          {jobList.map((job) => (
            <li key={job.id}>
              <Link
                href={`/careers/${job.slug}`}
                className="group flex flex-col gap-4 rounded-3xl bg-white p-6 ring-1 ring-ink-100 transition hover:shadow-md hover:ring-jade-200 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="jade">{jobCategories[job.category as keyof typeof jobCategories] ?? job.category}</Badge>
                    <Badge tone="sun">{employmentTypes[job.employmentType as keyof typeof employmentTypes] ?? job.employmentType}</Badge>
                  </div>
                  <h2 className="mt-3 text-xl font-bold group-hover:text-jade-700">{job.title}</h2>
                  <p className="mt-1 max-w-2xl text-ink-700">{job.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-500">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4" /> {job.location}
                    </span>
                    {job.schedule && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-4" /> {job.schedule}
                      </span>
                    )}
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-jade-700">
                  View & apply <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {jobList.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-ink-100">
            <p className="text-lg font-semibold">{filtered ? "No openings match your search." : "No openings right now."}</p>
            <p className="mt-1 text-ink-700">
              {filtered ? "Try clearing filters, or create" : "We hire throughout the year — create"} an account so you&apos;re ready when
              new roles open.
            </p>
            <ButtonLink href="/signup" className="mt-6">
              Create an account
            </ButtonLink>
          </div>
        )}
      </Container>
    </>
  );
}
