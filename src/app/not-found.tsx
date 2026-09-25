import { PreviewBanner } from "@/components/preview-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <PreviewBanner />
      <SiteHeader />
      <main className="flex-1">
        <Container className="py-24 text-center">
          <p className="font-display text-7xl font-extrabold text-jade-700">404</p>
          <h1 className="mt-4 text-3xl font-bold">We couldn&apos;t find that page</h1>
          <p className="mt-2 text-ink-700">It may have moved during our website refresh.</p>
          <div className="mt-8 flex justify-center gap-3">
            <ButtonLink href="/demo">Go home</ButtonLink>
            <ButtonLink href="/demo/careers" variant="secondary">
              See open jobs
            </ButtonLink>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
