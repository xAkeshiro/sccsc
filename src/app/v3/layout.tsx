import Link from "next/link";
import { PreviewBanner } from "@/components/preview-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/**
 * v3 design exploration: a warmer, more colorful take on the redesign home page. Only the home
 * page exists here so far; the header and footer link to the redesign's pages under /demo.
 */
export default function V3Layout({ children }: LayoutProps<"/v3">) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <PreviewBanner
        note={
          <>
            Home page v3 (color exploration) — compare{" "}
            <Link href="/demo" className="underline underline-offset-2 hover:text-brand-700">
              v2
            </Link>{" "}
            or the{" "}
            {/* The current site is static WordPress output, not a Next.js route, so load it in full. */}
            <a href="/" className="underline underline-offset-2 hover:text-brand-700">
              current site
            </a>
          </>
        }
      />
      <SiteHeader homeHref="/v3" />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter homeHref="/v3" />
    </>
  );
}
