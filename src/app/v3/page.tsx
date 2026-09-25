import { ArrowRight, Backpack, BookOpen, Briefcase, HandHeart, Heart, School, Sprout, Sun } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, PhotoSlot, cx } from "@/components/ui";
import { FunButtonLink, FunHeading, Highlight, Marquee, Sparkle, Squiggle, Sticker, Wave } from "@/components/v3";
import { districts, heroPhotos, org, programs, stats } from "@/content/site";

export const metadata: Metadata = {
  title: "Home (v3 design preview)",
};

/**
 * Photos from the Center's current website (copied into public/photos/v3/). The alt text
 * describes what's in each photo, not which program it came from.
 */
const photos = {
  friends: { src: "/photos/v3/friends.jpg", alt: "Two smiling students sitting side by side at a classroom table, working on worksheets" },
  tutor: { src: "/photos/v3/reading-tutor.jpg", alt: "An older volunteer reading picture books with two young students at a classroom table" },
  staff: { src: "/photos/v3/staff-activity.jpg", alt: "A staff member leading a table game with a group of students" },
  group: { src: "/photos/v3/community-group.jpg", alt: "A large group gathered behind a banner with The Center's logo" },
};

// Each word here is drawn from the program descriptions in content/site.ts.
const activities = [
  "Homework help",
  "Hands-on projects",
  "STEAM",
  "The arts",
  "Recreation",
  "Reading tutors",
  "Summer learning",
  "First jobs",
  "Family engagement",
] as const;

const statStyles = [
  "bg-sun-300 -rotate-2",
  "bg-lake-200 rotate-1",
  "bg-coral-200 -rotate-1",
  "bg-brand-600 text-white rotate-2",
] as const;

const pathways = [
  {
    href: "/demo/families",
    icon: School,
    title: "I'm a parent or guardian",
    body: "Find the program at your child's school and learn what a day with us looks like.",
    cta: "Find a program",
    card: "bg-sun-300 text-ink-900 shadow-[6px_6px_0_0_var(--color-sun-400)]",
    text: "text-ink-700",
  },
  {
    href: "/demo/careers",
    icon: Briefcase,
    title: "I want to work here",
    body: "Team Leader, coordinator and leadership roles at schools near you. Apply online in minutes.",
    cta: "See open roles",
    card: "bg-brand-600 text-white shadow-[6px_6px_0_0_var(--color-brand-800)]",
    text: "text-brand-50",
  },
  {
    href: "/demo/get-involved#volunteer",
    icon: BookOpen,
    title: "I want to volunteer",
    body: "Adults 50+ can become trained reading tutors through AARP Foundation Experience Corps.",
    cta: "Volunteer with us",
    card: "bg-lake-200 text-ink-900 shadow-[6px_6px_0_0_var(--color-lake-300)]",
    text: "text-ink-700",
  },
  {
    href: "/demo/get-involved#give",
    icon: HandHeart,
    title: "I want to give or partner",
    body: "Support programs for immigrant, refugee and underserved families across the region.",
    cta: "Ways to give",
    card: "bg-coral-200 text-ink-900 shadow-[6px_6px_0_0_var(--color-coral-300)]",
    text: "text-ink-700",
  },
] as const;

type ProgramId = (typeof programs)[number]["id"];

const programStyles: Record<ProgramId, { card: string; icon: typeof Sun; iconBg: string }> = {
  "expanded-learning": { card: "bg-brand-600 text-white md:row-span-2", icon: Backpack, iconBg: "bg-sun-300 text-ink-900" },
  summer: { card: "bg-sun-300", icon: Sun, iconBg: "bg-white text-brand-600" },
  "early-learning": { card: "bg-lake-200", icon: Sprout, iconBg: "bg-white text-lake-700" },
  "youth-workforce": { card: "bg-coral-200", icon: Briefcase, iconBg: "bg-white text-coral-700" },
  "experience-corps": { card: "bg-white", icon: BookOpen, iconBg: "bg-lake-200 text-lake-700" },
};

const communityTones = ["bg-sun-200", "bg-lake-200", "bg-coral-200", "bg-brand-50", "bg-sun-300", "bg-lake-100"];

const districtStyles = [
  { tile: "bg-white", acronym: "text-brand-600" },
  { tile: "bg-sun-300", acronym: "text-ink-900" },
  { tile: "bg-white", acronym: "text-lake-700" },
  { tile: "bg-coral-200", acronym: "text-ink-900" },
] as const;

export default function HomeV3() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Container className="relative grid items-center gap-14 pb-10 pt-12 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:pb-14 lg:pt-20">
          <div>
            <Sticker tone="white">
              <Heart className="size-4 fill-brand-600 text-brand-600" /> Serving Sacramento&apos;s communities since {org.founded}
            </Sticker>
            <h1 className="isolate mt-7 text-5xl font-extrabold leading-[1.04] text-ink-900 sm:text-6xl lg:text-7xl">
              Where kids{" "}
              <span className="whitespace-nowrap">
                <Highlight className="bg-sun-300">learn</Highlight>,
              </span>{" "}
              <Highlight className="bg-lake-200">grow</Highlight> and{" "}
              <span className="whitespace-nowrap">
                <span className="relative inline-block text-brand-600">
                  belong
                  <Squiggle className="absolute -bottom-2.5 left-0 h-3 w-full text-sun-400 sm:h-4" />
                </span>{" "}
                —
              </span>{" "}
              after the bell.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-700 sm:text-xl">
              {org.shortName} runs before-school, after-school and summer programs at 95+ schools across four
              districts — and has stood with immigrant and underserved families in Sacramento for over four decades.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <FunButtonLink href="/demo/families">
                Find a program <ArrowRight className="size-4" />
              </FunButtonLink>
              <FunButtonLink href="/demo/careers" tone="sun">
                Join our team
              </FunButtonLink>
            </div>
          </div>

          {/* Photo collage — every position is a percentage so it scales from phone to desktop. */}
          <div className="relative mx-auto aspect-[1/1.02] w-full max-w-[34rem]">
            <div aria-hidden className="absolute inset-y-[5%] left-[9%] right-[-2%] rounded-[46%_54%_42%_58%/52%_44%_56%_48%] bg-sun-300" />
            <div aria-hidden className="absolute bottom-[1%] left-[-3%] size-[27%] rounded-full bg-lake-200" />
            <div aria-hidden className="absolute right-[10%] top-[-1%] size-[12%] rounded-full bg-coral-300" />
            <Sparkle className="absolute left-[-1%] top-[1%] size-[9%] text-brand-600" />
            <Sparkle className="absolute bottom-[31%] right-[-3%] size-[6%] text-lake-500" />

            <PhotoSlot
              label={heroPhotos[0].alt}
              src={heroPhotos[0].src}
              priority
              tone="jade"
              className="absolute! left-[3%] top-[4%] aspect-[4/5] w-[50%] -rotate-3 shadow-xl ring-[6px] ring-white sm:ring-8"
            />
            <PhotoSlot
              label={heroPhotos[1].alt}
              src={heroPhotos[1].src}
              priority
              tone="sun"
              className="absolute! right-[3%] top-[13%] aspect-square w-[44%] rotate-3 shadow-xl ring-[6px] ring-white sm:ring-8"
            />
            <PhotoSlot
              label={heroPhotos[2].alt}
              src={heroPhotos[2].src}
              priority
              tone="lake"
              className="absolute! bottom-[4%] right-[8%] aspect-[4/3] w-[52%] -rotate-2 shadow-xl ring-[6px] ring-white sm:ring-8"
            />

            {/* Stickers */}
            <div className="absolute bottom-[9%] left-[3%] -rotate-3 rounded-2xl border-2 border-ink-900 bg-white px-4 py-3 shadow-hard sm:px-5 sm:py-4">
              <p className="font-display text-2xl font-extrabold leading-none text-brand-600 sm:text-3xl">13,000+</p>
              <p className="mt-1 text-xs font-semibold text-ink-700 sm:text-sm">students every school day</p>
            </div>
            <Link
              href="/demo/careers"
              className="absolute right-[-1%] top-[1%] flex rotate-2 items-center gap-2 rounded-full border-2 border-ink-900 bg-brand-600 px-3.5 py-2 text-xs font-bold text-white shadow-hard-sm transition hover:bg-brand-700 sm:text-sm"
            >
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-sun-300 opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex size-2.5 rounded-full bg-sun-300" />
              </span>
              Now hiring Team Leaders
              <ArrowRight className="size-3.5" />
            </Link>
            <div className="absolute left-[44%] top-[50%] grid size-[19%] -translate-x-1/2 rotate-[-8deg] place-items-center rounded-full border-2 border-ink-900 bg-lake-200 text-center shadow-hard-sm">
              <span className="font-display text-[0.6rem] font-extrabold uppercase leading-tight text-ink-900 sm:text-xs">
                Since
                <br />
                <span className="text-base sm:text-xl">{org.founded}</span>
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Activity ribbon */}
      <div className="overflow-hidden py-6 sm:py-8">
        <div className="-mx-[5%] -rotate-2 border-y-2 border-ink-900 bg-brand-600 py-3 font-display text-lg font-bold text-white sm:py-4 sm:text-2xl">
          <Marquee items={activities} />
        </div>
      </div>

      {/* Stats */}
      <section aria-label="Our reach">
        <Container className="grid grid-cols-2 gap-4 py-8 sm:gap-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={cx("rounded-[1.75rem] border-2 border-ink-900 p-5 shadow-hard sm:p-6", statStyles[i])}>
              <p className="font-display text-4xl font-extrabold sm:text-5xl">{s.value}</p>
              <p className="mt-1 text-sm font-semibold sm:text-base">{s.label}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* Pathways */}
      <section className="py-20">
        <Container>
          <FunHeading sticker="Start here" tone="lake" title="How can we help you today?" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pathways.map(({ href, icon: Icon, title, body, cta, card, text }, i) => (
              <Link
                key={href}
                href={href}
                className={cx(
                  "group flex flex-col rounded-[2rem] p-6 transition hover:-translate-y-1",
                  i % 2 ? "hover:rotate-1" : "hover:-rotate-1",
                  card,
                )}
              >
                <span className="grid size-14 place-items-center rounded-full border-2 border-ink-900 bg-white text-ink-900 shadow-hard-sm">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
                <p className={cx("mt-2 flex-1", text)}>{body}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-bold">
                  {cta} <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Programs */}
      <section className="px-3 sm:px-6">
        <div className="mx-auto max-w-[88rem] rounded-[2.5rem] bg-sun-100 py-16 sm:py-20">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <FunHeading
                sticker="Programs"
                tone="coral"
                title="From the first bell to the first job"
                intro="Our programs meet students and families where they are — at school, over the summer, and as young people step into the workforce."
              />
              <FunButtonLink href="/demo/programs" tone="white">
                All programs <ArrowRight className="size-4" />
              </FunButtonLink>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((p) => {
                const style = programStyles[p.id];
                const featured = p.id === "expanded-learning";
                const Icon = style.icon;
                return (
                  <Link
                    key={p.id}
                    href={`/demo/programs#${p.id}`}
                    className={cx(
                      "group flex flex-col rounded-[2rem] border-2 border-ink-900 p-7 shadow-hard transition hover:-translate-y-1 hover:shadow-hard-lg",
                      style.card,
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className={cx("text-sm font-bold", featured ? "text-white" : "text-ink-700")}>{p.audience}</p>
                      <span className={cx("grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink-900", style.iconBg)}>
                        <Icon className="size-5" />
                      </span>
                    </div>
                    <h3 className="mt-1 text-2xl font-extrabold">{p.name}</h3>
                    <p className={cx("mt-1 font-semibold", featured ? "text-brand-50" : "text-ink-700")}>{p.tagline}</p>
                    <p className={cx("mt-4 leading-relaxed", featured ? "text-brand-50" : "text-ink-700")}>{p.description}</p>
                    {featured && (
                      <>
                        <ul className="mt-6 space-y-2">
                          {p.points.map((pt) => (
                            <li key={pt} className="flex items-start gap-2.5 font-semibold text-white">
                              <Sparkle className="mt-1 size-3.5 shrink-0 text-sun-300" /> {pt}
                            </li>
                          ))}
                        </ul>
                        <PhotoSlot
                          label={photos.friends.alt}
                          src={photos.friends.src}
                          sizes="(min-width: 1024px) 22rem, (min-width: 768px) 45vw, 90vw"
                          className="mt-7 aspect-[4/3] rotate-1 ring-[6px] ring-white"
                        />
                      </>
                    )}
                    {p.id === "experience-corps" && (
                      <PhotoSlot
                        label={photos.tutor.alt}
                        src={photos.tutor.src}
                        sizes="(min-width: 1024px) 22rem, (min-width: 768px) 45vw, 90vw"
                        className="mt-5 aspect-[2/1] -rotate-1"
                      />
                    )}
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-bold">
                      Learn more <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </Container>
        </div>
      </section>

      {/* Careers band */}
      <div className="pt-20">
        <Wave className="text-brand-600" />
      </div>
      <section className="relative overflow-x-clip bg-brand-600 text-white">
        <Container className="grid items-center gap-14 py-12 lg:grid-cols-[1.2fr_1fr] lg:py-14">
          <div>
            <Sticker tone="sun">We&apos;re hiring!</Sticker>
            <h2 className="mt-5 text-4xl font-extrabold sm:text-5xl">Our Team Leaders are the heart of every program.</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-50">
              Work with TK–12 students at a school in your own community, with flexible shift scheduling and a real
              path into education. Create a free applicant account, apply in minutes, and track your status online.
            </p>
            <ol className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Create your applicant account", "Pick a role and the districts near you", "Upload your résumé and submit", "Track your application in your portal"].map(
                (step, i) => (
                  <li key={step} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink-900 bg-sun-300 font-display text-sm font-extrabold text-ink-900">
                      {i + 1}
                    </span>
                    <span className="font-semibold">{step}</span>
                  </li>
                ),
              )}
            </ol>
            <div className="mt-8 flex flex-wrap gap-4">
              <FunButtonLink href="/demo/careers" tone="white">
                See open roles <ArrowRight className="size-4" />
              </FunButtonLink>
              <FunButtonLink href="/demo/signup" tone="ink">
                Create an account
              </FunButtonLink>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[22rem] lg:max-w-sm">
            <div aria-hidden className="absolute inset-0 translate-x-4 translate-y-4 rotate-3 rounded-[2rem] bg-sun-300" />
            <div className="relative -rotate-2 rounded-[2rem] bg-white p-3 shadow-2xl">
              <PhotoSlot label={photos.staff.alt} src={photos.staff.src} sizes="(min-width: 1024px) 24rem, 22rem" className="aspect-[4/5]" />
            </div>
            <Sticker tone="white" tilt="right" className="absolute -left-4 top-8 sm:-left-8">
              Flexible shifts
            </Sticker>
            <Sticker tone="sun" className="absolute -right-2 bottom-10 sm:-right-6">
              Schools near you
            </Sticker>
          </div>
        </Container>
      </section>
      <Wave flip className="text-brand-600" />

      {/* Heritage */}
      <section className="overflow-x-clip py-20">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-xl">
            <div aria-hidden className="absolute -inset-3 rotate-2 rounded-[2.25rem] bg-lake-200 sm:-inset-4" />
            <PhotoSlot
              label={photos.group.alt}
              src={photos.group.src}
              sizes="(min-width: 1024px) 34rem, 90vw"
              className="aspect-[16/10] -rotate-1 shadow-xl ring-8 ring-white"
            />
            <Sparkle className="absolute -right-3 -top-5 size-10 text-brand-600" />
          </div>
          <div>
            <FunHeading
              sticker="Our story"
              tone="sun"
              title={`Rooted in community since ${org.founded}`}
              intro={`${org.origin} Today we serve families from many backgrounds — and every student who walks through our doors.`}
            />
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {org.communities.map((c, i) => (
                <li
                  key={c}
                  className={cx(
                    "rounded-full border-2 border-ink-900 px-3.5 py-1 text-sm font-bold text-ink-900",
                    communityTones[i % communityTones.length],
                    i % 2 ? "rotate-1" : "-rotate-1",
                  )}
                >
                  {c}
                </li>
              ))}
              <li className="rounded-full border-2 border-dashed border-ink-900 bg-white px-3.5 py-1 text-sm font-bold text-ink-900">
                …and many more
              </li>
            </ul>
            <FunButtonLink href="/demo/about" tone="white" className="mt-9">
              Read our story <ArrowRight className="size-4" />
            </FunButtonLink>
          </div>
        </Container>
      </section>

      {/* Districts */}
      <section className="px-3 sm:px-6">
        <div className="mx-auto max-w-[88rem] rounded-[2.5rem] bg-lake-100 py-16">
          <Container>
            <FunHeading
              align="center"
              sticker="School district partners"
              tone="white"
              title="Proudly serving four Sacramento-area districts"
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {districts.map((d, i) => (
                <Link
                  key={d.id}
                  href={`/demo/families#${d.id}`}
                  className={cx(
                    "rounded-[1.75rem] border-2 border-ink-900 p-6 text-center shadow-hard transition hover:-translate-y-1 hover:shadow-hard-lg",
                    districtStyles[i].tile,
                  )}
                >
                  <p className={cx("font-display text-4xl font-extrabold", districtStyles[i].acronym)}>{d.short}</p>
                  <p className="mt-1 font-semibold text-ink-900">{d.name}</p>
                </Link>
              ))}
            </div>
          </Container>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-ink-900 bg-sun-300 px-6 py-16 text-center shadow-hard-lg sm:px-12">
            <Sparkle className="absolute left-[6%] top-8 size-9 text-brand-600" />
            <Sparkle className="absolute bottom-10 right-[8%] size-7 text-white" />
            <div aria-hidden className="absolute -bottom-16 -left-10 size-44 rounded-full bg-coral-300" />
            <div aria-hidden className="absolute -right-12 -top-14 size-40 rounded-full bg-lake-200" />
            <Heart aria-hidden className="absolute bottom-8 left-[12%] size-10 rotate-[-14deg] fill-brand-600 text-brand-600 max-sm:hidden" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-extrabold text-ink-900 sm:text-5xl">Every child deserves a place to belong after school.</h2>
              <p className="mt-5 text-lg text-ink-700">
                Your gift helps immigrant, refugee and underserved families across Sacramento thrive.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <FunButtonLink href={org.donateUrl}>Donate today</FunButtonLink>
                <FunButtonLink href="/demo/get-involved" tone="white">
                  Other ways to help
                </FunButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
