import Link from "next/link";
import { mainNav, org } from "@/content/site";
import { Logo } from "./logo";
import { Container } from "./ui";

export function SiteFooter({ homeHref }: { homeHref?: string } = {}) {
  const { address } = org;
  return (
    <footer className="relative mt-auto overflow-hidden bg-ink-900 text-ink-100">
      <Container className="relative grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo inverted href={homeHref} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-300">
            {org.name} is a 501(c)(3) nonprofit supporting Sacramento-area students, families and communities since{" "}
            {org.founded}.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Visit</h2>
          <address className="mt-4 text-sm not-italic leading-relaxed text-ink-300">
            {address.street}
            <br />
            {address.city}, {address.state} {address.zip}
          </address>
          <a href={org.phoneHref} className="mt-3 block text-sm font-semibold text-white hover:text-sun-300">
            {org.phone}
          </a>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-300 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/demo/contact" className="text-ink-300 hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Connect</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`mailto:${org.emails.careers}`} className="text-ink-300 hover:text-white">
                {org.emails.careers}
              </a>
            </li>
            <li>
              <a href={`mailto:${org.emails.volunteers}`} className="text-ink-300 hover:text-white">
                {org.emails.volunteers}
              </a>
            </li>
            <li>
              <a href={org.social.facebook} className="text-ink-300 hover:text-white">
                Facebook
              </a>
            </li>
            <li>
              <a href={org.social.linkedin} className="text-ink-300 hover:text-white">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <Container className="relative flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-ink-300 sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {org.name}. All rights reserved.
        </p>
        <p>
          <Link href="/demo/portal" className="hover:text-white">
            Applicant login
          </Link>
        </p>
      </Container>
    </footer>
  );
}
