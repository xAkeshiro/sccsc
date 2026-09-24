import type { Metadata } from "next";
import { Briefcase, HandHeart, MapPin, Phone } from "lucide-react";
import { Container, PageHero } from "@/components/ui";
import { org } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Reach The Center at ${org.phone} or visit ${org.address.street}, ${org.address.city}.`,
};

export default function ContactPage() {
  const { address } = org;
  const mapQuery = encodeURIComponent(`${address.street}, ${address.city}, ${address.state} ${address.zip}`);
  const cards = [
    { icon: Phone, title: "Call our office", body: org.phone, href: org.phoneHref },
    {
      icon: MapPin,
      title: "Visit",
      body: `${address.street}, ${address.city}, ${address.state} ${address.zip}`,
      href: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
    },
    { icon: Briefcase, title: "Jobs & applications", body: org.emails.careers, href: `mailto:${org.emails.careers}` },
    { icon: HandHeart, title: "Volunteering", body: org.emails.volunteers, href: `mailto:${org.emails.volunteers}` },
  ];

  return (
    <>
      <PageHero eyebrow="Contact" title="We're here to help" intro="Questions about a program, a job or volunteering? Reach the right team directly." />
      <Container className="grid gap-5 py-16 sm:grid-cols-2">
        {cards.map(({ icon: Icon, title, body, href }) => (
          <a key={title} href={href} className="flex gap-4 rounded-3xl bg-white p-6 ring-1 ring-ink-100 transition hover:ring-jade-200">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-jade-50 text-jade-700">
              <Icon className="size-6" />
            </span>
            <span>
              <span className="block text-lg font-bold">{title}</span>
              <span className="mt-0.5 block text-ink-700">{body}</span>
            </span>
          </a>
        ))}
      </Container>
      {/* TODO(client): add office hours and a general inquiry form (routes to the right team). */}
    </>
  );
}
