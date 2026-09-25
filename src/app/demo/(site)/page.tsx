import { ArrowRight, BookOpen, Briefcase, HandHeart, School } from "lucide-react";
import Link from "next/link";
import { ButtonLink, Container, Eyebrow, PhotoSlot, SectionHeading } from "@/components/ui";
import { districts, heroPhotos, org, programs, stats } from "@/content/site";

const pathways = [
  {
    href: "/demo/families",
    icon: School,
    title: "I'm a parent or guardian",
    body: "Find the program at your child's school and learn what a day with us looks like.",
    cta: "Find a program",
    tone: "bg-jade-50 text-jade-800",
  },
  {
    href: "/demo/careers",
    icon: Briefcase,
    title: "I want to work here",
    body: "Team Leader, coordinator and leadership roles at schools near you. Apply online in minutes.",
    cta: "See open roles",
    tone: "bg-brand-50 text-brand-700",
  },
  {
    href: "/demo/get-involved#volunteer",
    icon: BookOpen,
    title: "I want to volunteer",
    body: "Adults 50+ can become trained reading tutors through AARP Foundation Experience Corps.",
    cta: "Volunteer with us",
    tone: "bg-sun-100 text-ink-900",
  },
  {
    href: "/demo/get-involved#give",
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
        {/* Soft color washes so the cream background doesn't read flat. */}
        <div aria-hidden className="absolute -right-40 -top-40 size-[36rem] rounded-full bg-brand-100/60 blur-3xl" />
        <div aria-hidden className="absolute -bottom-48 -left-40 size-[30rem] rounded-full bg-sun-100 blur-3xl" />

        <Container className="relative grid items-center gap-14 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <Eyebrow>Sacramento · Since {org.founded}</Eyebrow>
            <h1 className="mt-4 text-5xl font-extrabold leading-[1.02] text-ink-900 sm:text-6xl lg:text-7xl">
              Where kids learn, grow and{" "}
              <span className="relative inline-block text-brand-600">
                belong
                <svg
                  aria-hidden
                  viewBox="0 0 200 20"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-3 w-full text-sun-400 sm:h-4"
                >
                  <path d="M3 14 C 50 4, 120 3, 197 9" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                </svg>
              </span>{" "}
              — after the bell.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-700 sm:text-xl">
              {org.shortName} runs before-school, after-school and summer programs at 95+ schools across four
              districts — and has stood with immigrant and underserved families in Sacramento for over four decades.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/demo/families" size="lg">
                Find a program <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/demo/careers" size="lg" variant="secondary">
                Join our team
              </ButtonLink>
            </div>
          </div>

          {/* Photo collage — every position is a percentage so it scales from phone to desktop. */}
          <div className="relative mx-auto aspect-[1/1.02] w-full max-w-[34rem]">
            <div aria-hidden className="absolute inset-y-[6%] right-0 left-[12%] rotate-3 rounded-[3rem] bg-brand-600" />
            <div aria-hidden className="absolute bottom-[2%] left-0 size-[22%] rounded-full bg-sun-400" />
            <div aria-hidden className="absolute right-[4%] top-0 size-[9%] rounded-full bg-jade-500" />
            <div aria-hidden className="absolute bottom-[30%] right-[-2%] size-[6%] rounded-full bg-sun-300" />

            <PhotoSlot
              label={heroPhotos[0].alt}
              src={heroPhotos[0].src}
              priority
              tone="jade"
              className="absolute! left-[3%] top-[4%] aspect-[4/5] w-[50%] -rotate-3 shadow-2xl ring-[6px] ring-white sm:ring-8"
            />
            <PhotoSlot
              label={heroPhotos[1].alt}
              src={heroPhotos[1].src}
              priority
              tone="sun"
              className="absolute! right-[3%] top-[13%] aspect-square w-[44%] rotate-3 shadow-2xl ring-[6px] ring-white sm:ring-8"
            />
            <PhotoSlot
              label={heroPhotos[2].alt}
              src={heroPhotos[2].src}
              priority
              tone="lake"
              className="absolute! bottom-[4%] right-[8%] aspect-[4/3] w-[52%] -rotate-2 shadow-2xl ring-[6px] ring-white sm:ring-8"
            />

            {/* Floating "stickers" */}
            <div className="absolute bottom-[10%] left-[4%] rotate-[-4deg] rounded-2xl bg-white px-4 py-3 shadow-xl sm:px-5 sm:py-4">
              <p className="font-display text-2xl font-extrabold leading-none text-brand-600 sm:text-3xl">13,000+</p>
              <p className="mt-1 text-xs font-semibold text-ink-700 sm:text-sm">students every school day</p>
            </div>
            <Link
              href="/demo/careers"
              className="absolute right-[-1%] top-[1%] flex rotate-2 items-center gap-2 rounded-full bg-ink-900 px-3.5 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-black sm:text-sm"
            >
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-sun-300 opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex size-2.5 rounded-full bg-sun-300" />
              </span>
              Now hiring Team Leaders
              <ArrowRight className="size-3.5" />
            </Link>
            <div className="absolute left-[44%] top-[50%] grid size-[19%] -translate-x-1/2 rotate-[-8deg] place-items-center rounded-full bg-sun-400 text-center shadow-lg ring-4 ring-white">
              <span className="font-display text-[0.6rem] font-extrabold uppercase leading-tight text-ink-900 sm:text-xs">
                Since
                <br />
                <span className="text-base sm:text-xl">{org.founded}</span>
              </span>
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
            <ButtonLink href="/demo/programs" variant="secondary">
              All programs <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((p, i) => (
              <Link
                key={p.id}
                href={`/demo/programs#${p.id}`}
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
      <section className="relative overflow-hidden bg-brand-600 text-white">
        <Container className="relative grid items-center gap-10 py-16 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun-300">We&apos;re hiring</p>
            <h2 className="mt-3 text-4xl font-bold sm:text-5xl">Our Team Leaders are the heart of every program.</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-50">
              Work with TK–12 students at a school in your own community, with flexible shift scheduling and a real
              path into education. Create a free applicant account, apply in minutes, and track your status online.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/demo/careers" variant="light" size="lg">
                See open roles <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/demo/signup" size="lg" className="bg-ink-900 hover:bg-black">
                Create an account
              </ButtonLink>
            </div>
          </div>
          <ol className="grid gap-3">
            {["Create your applicant account", "Pick a role and the districts near you", "Upload your résumé and submit", "Track your application in your portal"].map(
              (step, i) => (
                <li key={step} className="flex items-center gap-4 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white font-display font-bold text-brand-700">
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
            <ButtonLink href="/demo/about" variant="ghost" className="mt-6 -ml-5">
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
                href={`/demo/families#${d.id}`}
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
                <ButtonLink href="/demo/get-involved" variant="light" size="lg">
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
