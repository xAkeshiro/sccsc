import type { Metadata } from "next";
import { Container, PageHero, PhotoSlot, SectionHeading } from "@/components/ui";
import { districts, org, stats } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `${org.origin} Learn about our mission, history and leadership.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title={`Serving Sacramento since ${org.founded}`} intro={org.origin} />

      <section className="py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our mission" title="Self-sufficiency, empowerment and cultural pride" />
            <blockquote className="mt-6 border-l-4 border-vermilion-500 pl-5 text-xl leading-relaxed text-ink-700">
              {org.mission}
            </blockquote>
          </div>
          <PhotoSlot label="staff and families at a community event" tone="sun" className="aspect-[4/3]" />
        </Container>
      </section>

      <section className="bg-cream-50 py-20">
        <Container>
          <SectionHeading
            eyebrow="Our story"
            title="From a welcome for new neighbors to a regional partner for schools"
            intro={`The Center began by helping newly arrived Chinese immigrants find their footing. Over the years we've grown to serve many communities — including ${org.communities
              .slice(1)
              .join(", ")} families — and to partner with ${districts.length} school districts to run expanded learning programs for thousands of students every day.`}
          />
          {/* TODO(client): replace with real milestones (founding, first school partnership, key program launches). */}
          <dl className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-3xl bg-white p-6 ring-1 ring-ink-100">
                <dt className="text-sm font-medium text-ink-500">{s.label}</dt>
                <dd className="mt-1 font-display text-4xl font-extrabold text-jade-700">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Leadership" title="Who we are" />
          {/* TODO(client): add the full executive team and board with photos. */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-100">
              <PhotoSlot label="headshot" tone="lake" className="aspect-square" />
              <h3 className="mt-5 text-xl font-bold">{org.executiveDirector}</h3>
              <p className="text-ink-500">Executive Director</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
