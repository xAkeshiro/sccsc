import { Container } from "@/components/ui";
import { org } from "@/content/site";

/** Shown in place of the careers portal until a database and auth secret are configured for the deployment. */
export function PortalOffline() {
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center ring-1 ring-ink-100">
        <h1 className="text-2xl font-bold">Our online job board is almost ready</h1>
        <p className="mt-3 text-ink-700">
          In the meantime, email your résumé and the role you&apos;re interested in to{" "}
          <a className="font-semibold text-brand-700 underline" href={`mailto:${org.emails.careers}`}>
            {org.emails.careers}
          </a>
          .
        </p>
      </div>
    </Container>
  );
}
