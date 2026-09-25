import type { Metadata } from "next";
import { Check } from "lucide-react";
import { ButtonLink, Container, PageHero, PhotoSlot } from "@/components/ui";
import { programs } from "@/content/site";

export const metadata: Metadata = {
  title: "Programs",
  description: "Expanded learning, summer, early learning, youth workforce and Experience Corps programs across the Sacramento region.",
};

const tones = { jade: "jade", sun: "sun", sky: "lake", vermilion: "vermilion" } as const;

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Programs that meet families where they are"
        intro="At school, over the summer and into the workforce — every program is built around safe spaces, caring adults and real opportunities to grow."
      >
        <nav aria-label="Programs on this page" className="mt-8 flex flex-wrap gap-2">
          {programs.map((p) => (
            <a key={p.id} href={`#${p.id}`} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20">
              {p.name}
            </a>
          ))}
        </nav>
      </PageHero>

      <Container className="space-y-20 py-20">
        {programs.map((p, i) => (
          <section key={p.id} id={p.id} className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2">
            <PhotoSlot
              label={`${p.name} in action`}
              tone={tones[p.color]}
              className={`aspect-[4/3] ${i % 2 === 1 ? "lg:order-2" : ""}`}
            />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-600">{p.audience}</p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{p.name}</h2>
              <p className="mt-1 text-lg font-medium text-ink-500">{p.tagline}</p>
              <p className="mt-5 text-lg leading-relaxed text-ink-700">{p.description}</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-ink-900">
                    <Check className="mt-0.5 size-5 shrink-0 text-jade-600" /> {pt}
                  </li>
                ))}
              </ul>
              {p.id === "expanded-learning" && (
                <ButtonLink href="/demo/families" className="mt-8">
                  Find your school&apos;s program
                </ButtonLink>
              )}
              {p.id === "experience-corps" && (
                <ButtonLink href="/demo/get-involved#volunteer" className="mt-8">
                  Become a reading tutor
                </ButtonLink>
              )}
            </div>
          </section>
        ))}
      </Container>
    </>
  );
}
