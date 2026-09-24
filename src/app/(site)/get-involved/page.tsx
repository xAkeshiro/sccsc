import type { Metadata } from "next";
import { BookOpen, Building2, Gift, Sparkles } from "lucide-react";
import { ButtonLink, Container, PageHero, PhotoSlot, SectionHeading } from "@/components/ui";
import { org } from "@/content/site";

export const metadata: Metadata = {
  title: "Get Involved",
  description: "Volunteer as an Experience Corps reading tutor, serve with AmeriCorps VISTA, donate, or partner with The Center.",
};

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        eyebrow="Get involved"
        title="There's a place for you here"
        intro="Tutor a young reader, serve a term with AmeriCorps, give, or partner with us — every kind of support reaches students and families across Sacramento."
      />

      <section id="volunteer" className="scroll-mt-24 py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <PhotoSlot label="Experience Corps tutor with a student" tone="sun" className="aspect-[4/3]" />
          <div>
            <SectionHeading
              eyebrow="Volunteer"
              title="Become a reading tutor (ages 50+)"
              intro="Through AARP Foundation Experience Corps, we recruit and train adults over 50 to tutor students who are learning to read. You bring the patience and life experience; we provide training and support."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/careers/experience-corps-volunteer-reading-tutor">
                <BookOpen className="size-4" /> Apply to volunteer
              </ButtonLink>
              <ButtonLink href={`mailto:${org.emails.volunteers}`} variant="secondary">
                Email {org.emails.volunteers}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-cream-50 py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Serve"
              title="AmeriCorps VISTA"
              intro="Spend a 12-month service term building lasting capacity for our programs — like the technology systems that power our volunteer program."
            />
            <ButtonLink href="/careers?category=service" className="mt-8">
              <Sparkles className="size-4" /> See service positions
            </ButtonLink>
          </div>
          <PhotoSlot label="AmeriCorps members at work" tone="lake" className="aspect-[4/3] lg:order-first" />
        </Container>
      </section>

      <section id="give" className="scroll-mt-24 py-20">
        <Container>
          <SectionHeading align="center" eyebrow="Give & partner" title="Invest in Sacramento's kids and families" />
          <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
            <div className="rounded-3xl bg-vermilion-600 p-8 text-white">
              <Gift className="size-8 text-sun-300" />
              <h3 className="mt-4 text-2xl font-bold text-white">Make a gift</h3>
              <p className="mt-2 text-vermilion-50">
                Donations support programs for immigrant, refugee and underserved families that public funding doesn&apos;t
                fully cover.
              </p>
              <ButtonLink href={org.donateUrl} variant="light" className="mt-6">
                Donate
              </ButtonLink>
            </div>
            <div className="rounded-3xl bg-white p-8 ring-1 ring-ink-100">
              <Building2 className="size-8 text-jade-600" />
              <h3 className="mt-4 text-2xl font-bold">Partner with us</h3>
              <p className="mt-2 text-ink-700">
                Schools, districts, businesses and community organizations — let&apos;s talk about how we can work together.
              </p>
              <ButtonLink href="/contact" variant="secondary" className="mt-6">
                Contact us
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
