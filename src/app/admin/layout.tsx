import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { SignOutButton } from "@/components/portal/sign-out-button";
import { PortalOffline } from "@/components/portal/portal-offline";
import { PreviewBanner } from "@/components/preview-banner";
import { Container } from "@/components/ui";
import { portalReady, requireAdmin } from "@/lib/session";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin — The Center" },
  robots: { index: false, follow: false },
};

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/jobs", label: "Job postings" },
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  if (!(await portalReady())) return <PortalOffline />;
  const admin = await requireAdmin();

  return (
    <>
      <PreviewBanner />
      <header className="border-b border-ink-100 bg-white">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-6">
            <Logo />
            <span className="rounded-full bg-ink-900 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">Admin</span>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <span className="hidden text-ink-500 sm:inline">{admin.email}</span>
            <Link href="/" className="font-semibold text-ink-700 hover:text-brand-700">
              View site
            </Link>
            <SignOutButton />
          </div>
        </Container>
        <Container>
          <nav aria-label="Admin" className="-mb-px flex gap-1 overflow-x-auto">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap border-b-2 border-transparent px-3 py-3 text-sm font-semibold text-ink-700 hover:border-brand-200 hover:text-ink-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </Container>
      </header>
      <main className="flex-1 bg-cream-50">
        <Container className="py-10">{children}</Container>
      </main>
    </>
  );
}
