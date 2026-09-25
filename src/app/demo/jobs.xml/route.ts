import { connection } from "next/server";
import { org } from "@/content/site";
import { ensureDbReady } from "@/db";
import { isPortalConfigured } from "@/lib/auth";
import {
  categoryLabel,
  indeedJobType,
  isIndeedEligible,
  jobDescriptionHtml,
  jobUrl,
} from "@/lib/job-syndication";
import { listOpenJobs } from "@/lib/jobs";
import { siteUrl } from "@/lib/site-url";

/**
 * Indeed XML job feed. Register https://<domain>/demo/jobs.xml with Indeed once; Indeed then re-reads it
 * on its own schedule, so opening, editing or closing a job in the HR admin reaches Indeed within
 * a few hours. Edits made on Indeed itself are overwritten by the next read — the site is the source.
 */
// CDATA can't contain "]]>", so split any occurrence across two sections.
const cdata = (value: string | null | undefined) => `<![CDATA[${(value ?? "").replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
const rfc822 = (d: Date) => d.toUTCString();

export async function GET() {
  await connection(); // always read current jobs, never a build-time snapshot
  let jobList: Awaited<ReturnType<typeof listOpenJobs>> = [];
  if (isPortalConfigured()) {
    await ensureDbReady();
    jobList = (await listOpenJobs()).filter(isIndeedEligible);
  }

  const items = jobList
    .map(
      (job) => `  <job>
    <title>${cdata(job.title)}</title>
    <date>${cdata(rfc822(job.postedAt ?? job.createdAt))}</date>
    <referencenumber>${cdata(job.id)}</referencenumber>
    <requisitionid>${cdata(job.slug)}</requisitionid>
    <url>${cdata(jobUrl(job))}</url>
    <company>${cdata(org.name)}</company>
    <sourcename>${cdata(org.name)}</sourcename>
    <city>${cdata(org.address.city)}</city>
    <state>${cdata(org.address.state)}</state>
    <country>${cdata("US")}</country>
    <postalcode>${cdata(org.address.zip)}</postalcode>
    <streetaddress>${cdata(org.address.street)}</streetaddress>
    <email>${cdata(org.emails.careers)}</email>
    <description>${cdata(jobDescriptionHtml(job))}</description>
    <salary>${cdata(job.payRange)}</salary>
    <jobtype>${cdata(indeedJobType(job))}</jobtype>
    <category>${cdata(categoryLabel(job))}</category>
  </job>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<source>
  <publisher>${cdata(org.name)}</publisher>
  <publisherurl>${cdata(siteUrl().origin)}</publisherurl>
  <lastBuildDate>${cdata(rfc822(new Date()))}</lastBuildDate>
${items}
</source>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Job boards poll this; a short CDN cache keeps it cheap while staying fresh.
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=300",
    },
  });
}
