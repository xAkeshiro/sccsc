import { mainNav, org } from "@/content/site";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { ButtonLink, Container } from "./ui";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-300/70 bg-cream-100/90 backdrop-blur">
      <Container className="flex h-18 items-center justify-between gap-6 py-3">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[0.95rem] font-semibold text-ink-700 hover:bg-cream-200 hover:text-ink-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/portal" className="px-3 py-2 text-sm font-semibold text-ink-700 hover:text-jade-700">
            Applicant login
          </Link>
          <ButtonLink href={org.donateUrl} variant="accent" size="sm">
            Donate
          </ButtonLink>
        </div>
        <MobileNav />
      </Container>
    </header>
  );
}
