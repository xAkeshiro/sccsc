import { ArrowRight, BookOpen, Briefcase, HandHeart, School } from "lucide-react";
import Link from "next/link";
import { ButtonLink, Container, Eyebrow, PhotoSlot, SectionHeading } from "@/components/ui";
import { districts, heroPhotos, org, programs, stats } from "@/content/site";

const pathways = [
  {
    href: "/families",
    icon: School,
    title: "I'm a parent or guardian",
    body: "Find the program at your child's school and learn what a day with us looks like.",
    cta: "Find a program",
    tone: "bg-jade-50 text-jade-800",
  },
  {
    href: "/careers",
    icon: Briefcase,
    title: "I want to work here",
    body: "Team Leader, coordinator and leadership roles at schools near you. Apply online in minutes.",
    cta: "See open roles",
    tone: "bg-brand-50 text-brand-700",
  },
  {
    href: "/get-involved#volunteer",
    icon: BookOpen,
    title: "I want to volunteer",
    body: "Adults 50+ can become trained reading tutors through AARP Foundation Experience Corps.",
    cta: "Volunteer with us",
    tone: "bg-sun-100 text-ink-900",
  },
  {
    href: "/get-involved#give",
    icon: HandHeart,
    title: "I want to give or partner",
    body: "Support programs for immigrant, refugee and underserved families across the region.",
    cta: "Ways to give",
    tone: "bg-lake-100 text-lake-700",
  },
] as const;

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Container className="relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <Eyebrow>Sacramento · Since {org.founded}</Eyebrow>
            <h1 className="mt-4 text-5xl font-extrabold leading-[1.02] text-ink-900 sm:text-6xl lg:text-7xl">
              Where kids learn, grow and <span className="text-brand-600">belong</span> — after the bell.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-700 sm:text-xl">
              {org.shortName} runs before-school, after-school and summer programs at 95+ schools across four
              districts — and has stood with immigrant and underserved families in Sacramento for over four decades.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/families" size="lg">
                Find a program <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/careers" size="lg" variant="secondary">
                Join our team
              </ButtonLink>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <PhotoSlot label={heroPhotos[0].alt} src={heroPhotos[0].src} priority className="aspect-[4/5]" tone="jade" />
              <div className="grid gap-4">
                <PhotoSlot label={heroPhotos[1].alt} src={heroPhotos[1].src} priority className="aspect-square" tone="sun" />
                <PhotoSlot label={heroPhotos[2].alt} src={heroPhotos[2].src} priority className="aspect-square" tone="lake" />
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 hidden rounded-2xl bg-white px-5 py-4 shadow-xl ring-1 ring-ink-100 sm:-left-6 sm:block">
              <p className="font-display text-3xl font-extrabold text-brand-600">13,000+</p>
              <p className="text-sm font-medium text-ink-500">students every school day</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section aria-label="Our reach" className="bg-brand-600 text-white">
        <Container className="grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl font-extrabold text-white sm:text-5xl">{s.value}</p>
              <p className="mt-1 text-sm font-medium text-brand-50 sm:text-base">{s.label}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* Pathways */}
      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Start here" title="How can we help you today?" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pathways.map(({ href, icon: Icon, title, body, cta, tone }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-100 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className={`grid size-12 place-items-center rounded-2xl ${tone}`}>
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-2 flex-1 text-ink-700">{body}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-jade-700">
                  {cta} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Programs */}
      <section className="bg-cream-50 py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Programs"
              title="From the first bell to the first job"
              intro="Our programs meet students and families where they are — at school, over the summer, and as young people step into the workforce."
            />
            <ButtonLink href="/programs" variant="secondary">
              All programs <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((p, i) => (
              <Link
                key={p.id}
                href={`/programs#${p.id}`}
                className={`group rounded-3xl p-7 ring-1 ring-inset transition hover:shadow-md ${
                  i === 0 ? "bg-jade-700 text-white ring-jade-700 md:row-span-2" : "bg-white ring-ink-100"
                }`}
              >
                <p className={`text-sm font-semibold ${i === 0 ? "text-sun-300" : "text-brand-600"}`}>{p.audience}</p>
                <h3 className={`mt-2 text-2xl font-bold ${i === 0 ? "text-white" : ""}`}>{p.name}</h3>
                <p className={`mt-1 font-medium ${i === 0 ? "text-jade-100" : "text-ink-500"}`}>{p.tagline}</p>
                <p className={`mt-4 leading-relaxed ${i === 0 ? "text-jade-50/90" : "text-ink-700"}`}>{p.description}</p>
                {i === 0 && (
                  <ul className="mt-6 space-y-2">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2 text-jade-50">
                        <span className="size-1.5 rounded-full bg-sun-300" /> {pt}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Careers band */}
      <section className="relative overflow-hidden bg-jade-800 text-white">
        <Container className="relative grid items-center gap-10 py-16 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun-300">We&apos;re hiring</p>
            <h2 className="mt-3 text-4xl font-bold sm:text-5xl">Our Team Leaders are the heart of every program.</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-jade-50/90">
              Work with TK–12 students at a school in your own community, with flexible shift scheduling and a real
              path into education. Create a free applicant account, apply in minutes, and track your status online.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/careers" variant="light" size="lg">
                See open roles <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/signup" size="lg">
                Create an account
              </ButtonLink>
            </div>
          </div>
          <ol className="grid gap-3">
            {["Create your applicant account", "Pick a role and the districts near you", "Upload your résumé and submit", "Track your application in your portal"].map(
              (step, i) => (
                <li key={step} className="flex items-center gap-4 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-600 font-display font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="font-semibold">{step}</span>
                </li>
              ),
            )}
          </ol>
        </Container>
      </section>

      {/* Heritage */}
      <section className="py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <PhotoSlot label="archival photo of the Center's early years" tone="vermilion" className="aspect-[4/3]" />
          <div>
            <SectionHeading
              eyebrow="Our story"
              title={`Rooted in community since ${org.founded}`}
              intro={`${org.origin} Today we serve families from many backgrounds — and every student who walks through our doors.`}
            />
            <ul className="mt-6 flex flex-wrap gap-2">
              {org.communities.map((c) => (
                <li key={c} className="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-ink-700 ring-1 ring-ink-100">
                  {c}
                </li>
              ))}
              <li className="rounded-full bg-jade-50 px-3.5 py-1.5 text-sm font-semibold text-jade-800 ring-1 ring-jade-100">
                …and many more
              </li>
            </ul>
            <ButtonLink href="/about" variant="ghost" className="mt-6 -ml-5">
              Read our story <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Districts */}
      <section className="border-y border-cream-300 bg-cream-50 py-16">
        <Container>
          <SectionHeading align="center" eyebrow="School district partners" title="Proudly serving four Sacramento-area districts" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {districts.map((d) => (
              <Link
                key={d.id}
                href={`/families#${d.id}`}
                className="rounded-2xl bg-white p-5 text-center ring-1 ring-ink-100 transition hover:ring-jade-200"
              >
                <p className="font-display text-2xl font-extrabold text-brand-600">{d.short}</p>
                <p className="mt-1 font-semibold text-ink-900">{d.name}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="py-20">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] bg-ink-900 px-6 py-14 text-center text-white sm:px-12">
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl">Every child deserves a place to belong after school.</h2>
              <p className="mt-4 text-lg text-ink-300">
                Your gift helps immigrant, refugee and underserved families across Sacramento thrive.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink href={org.donateUrl} variant="accent" size="lg">
                  Donate today
                </ButtonLink>
                <ButtonLink href="/get-involved" variant="light" size="lg">
                  Other ways to help
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
