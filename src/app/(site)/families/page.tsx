import type { Metadata } from "next";
import { Clock, HeartHandshake, MessageCircle, ShieldCheck } from "lucide-react";
import { ButtonLink, Container, PageHero, SectionHeading } from "@/components/ui";
import { districts, org } from "@/content/site";

export const metadata: Metadata = {
  title: "For Families",
  description: "Find the before- and after-school program at your child's school in Sacramento City, Twin Rivers, Natomas or Elk Grove Unified.",
};

// TODO(client): confirm these promises and the "day" timeline below match how sites actually run.
const promises = [
  { icon: ShieldCheck, title: "Safe & supervised", body: "Caring, trained adults with students every minute of the program." },
  { icon: Clock, title: "Right after the bell", body: "Programs run on campus, so there's no extra trip between school and care." },
  { icon: HeartHandshake, title: "Whole-child focus", body: "Homework help, hands-on projects, movement and social–emotional growth." },
  { icon: MessageCircle, title: "Families as partners", body: "We keep you informed and involved in your child's learning." },
];

export default function FamiliesPage() {
  return (
    <>
      <PageHero
        eyebrow="For families"
        title="A safe, fun place for your child — right at school"
        intro="We run before-school, after-school and summer programs on campus at 95+ schools. Choose your district below to get started."
      >
        <div className="mt-8 flex flex-wrap gap-2">
          {districts.map((d) => (
            <a key={d.id} href={`#${d.id}`} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-jade-800 hover:bg-cream-100">
              {d.short}
            </a>
          ))}
        </div>
      </PageHero>

      <section className="py-16">
        <Container className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl bg-white p-6 ring-1 ring-ink-100">
              <Icon className="size-7 text-jade-600" />
              <h2 className="mt-4 text-lg font-bold">{title}</h2>
              <p className="mt-1.5 text-ink-700">{body}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="bg-cream-50 py-20">
        <Container>
          <SectionHeading
            eyebrow="Find your program"
            title="Choose your school district"
            intro="Enrollment, schedules and availability are set with each school. Contact your school's program or our office and we'll help you get started."
          />
          {/* TODO(client): add the per-school site list (school, grades, program contact) for each district. */}
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {districts.map((d) => (
              <article key={d.id} id={d.id} className="scroll-mt-28 rounded-3xl bg-white p-7 ring-1 ring-ink-100">
                <p className="font-display text-3xl font-extrabold text-jade-700">{d.short}</p>
                <h3 className="mt-1 text-xl font-bold">{d.name} School District</h3>
                <p className="mt-3 text-ink-700">{d.blurb}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink href={org.phoneHref} size="sm">
                    Call {org.phone}
                  </ButtonLink>
                  <ButtonLink href="/contact" size="sm" variant="secondary">
                    Send a message
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading eyebrow="What a day looks like" title="After the bell at The Center" />
          <ol className="relative space-y-6 border-l-2 border-jade-100 pl-8">
            {[
              ["Check-in & snack", "Students sign in with their Team Leader and refuel."],
              ["Homework help", "Quiet time to finish assignments with an adult on hand to help."],
              ["Enrichment", "Project-based activities — STEM, arts, literacy, culture and more."],
              ["Recreation", "Games, sports and play to burn off energy and build friendships."],
              ["Family pick-up", "A quick hello and an update on how the day went."],
            ].map(([title, body]) => (
              <li key={title} className="relative">
                <span className="absolute -left-[2.6rem] top-1 size-4 rounded-full border-4 border-cream-100 bg-jade-600" />
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-ink-700">{body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
