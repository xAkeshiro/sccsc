import { employmentTypes, jobCategories, org } from "@/content/site";
import type { Job } from "@/db/schema";
import { siteUrl } from "@/lib/site-url";

/**
 * Shared job data for outside job boards: the Indeed XML feed (/jobs.xml) and Google for Jobs
 * (JSON-LD on each job page). The site is the source of truth — both read from the same jobs table.
 */

export function jobUrl(job: Pick<Job, "slug">) {
  return new URL(`/careers/${job.slug}`, siteUrl()).toString();
}

/**
 * Indeed does not accept unpaid/volunteer postings, so those stay on our own board only.
 * TODO(client): confirm with the Center's Indeed rep.
 */
export function isIndeedEligible(job: Pick<Job, "employmentType" | "category">) {
  return job.employmentType !== "volunteer" && job.category !== "volunteer";
}

const indeedJobTypes: Record<string, string> = {
  "full-time": "fulltime",
  "part-time": "parttime",
  seasonal: "temporary",
  "service-term": "temporary",
};
export function indeedJobType(job: Pick<Job, "employmentType">) {
  return indeedJobTypes[job.employmentType] ?? "";
}

const googleEmploymentTypes: Record<string, string> = {
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  seasonal: "TEMPORARY",
  "service-term": "TEMPORARY",
  volunteer: "VOLUNTEER",
};

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Full job description as simple HTML (both Indeed and Google accept basic tags). */
export function jobDescriptionHtml(job: Job) {
  const parts = [`<p>${escapeHtml(job.summary)}</p>`];
  if (job.description) parts.push(`<p>${escapeHtml(job.description)}</p>`);
  const list = (title: string, items: string[]) =>
    items.length ? `<h3>${title}</h3><ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>` : "";
  parts.push(list("What you'll do", job.responsibilities), list("What we're looking for", job.qualifications));
  const facts = [
    job.schedule && `<b>Schedule:</b> ${escapeHtml(job.schedule)}`,
    job.payRange && `<b>Pay:</b> ${escapeHtml(job.payRange)}`,
    `<b>Location:</b> ${escapeHtml(job.location)}`,
  ].filter(Boolean);
  parts.push(`<p>${facts.join("<br>")}</p>`);
  parts.push(`<p>Apply online at ${escapeHtml(jobUrl(job))}</p>`);
  return parts.filter(Boolean).join("");
}

/**
 * Best-effort read of a free-text pay range such as "$19.00–$21.00/hour" or "$55,000 - $62,000 per year".
 * Returns null when it can't tell, in which case the pay text still appears in the description.
 */
export function parsePayRange(pay: string | null): { min: number; max: number; unit: "HOUR" | "YEAR" } | null {
  if (!pay) return null;
  const nums = [...pay.matchAll(/\$?\s*(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)/g)].map((m) => Number(m[1].replace(/,/g, "")));
  if (!nums.length) return null;
  const unit = /year|yr|annual|salary/i.test(pay) ? "YEAR" : /hour|hr/i.test(pay) ? "HOUR" : nums[0] >= 1000 ? "YEAR" : "HOUR";
  const [min, max = min] = nums;
  return max >= min ? { min, max, unit } : null;
}

/** schema.org JobPosting for Google for Jobs. */
export function jobPostingJsonLd(job: Job) {
  const pay = parsePayRange(job.payRange);
  const logo = org.logo.src ? new URL(org.logo.src, siteUrl()).toString() : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: jobDescriptionHtml(job),
    datePosted: (job.postedAt ?? job.createdAt).toISOString(),
    employmentType: googleEmploymentTypes[job.employmentType] ?? "OTHER",
    identifier: { "@type": "PropertyValue", name: org.name, value: job.id },
    hiringOrganization: { "@type": "Organization", name: org.name, sameAs: siteUrl().origin, ...(logo && { logo }) },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: org.address.street,
        addressLocality: org.address.city,
        addressRegion: org.address.state,
        postalCode: org.address.zip,
        addressCountry: "US",
      },
    },
    ...(pay && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "USD",
        value: { "@type": "QuantitativeValue", minValue: pay.min, maxValue: pay.max, unitText: pay.unit },
      },
    }),
    url: jobUrl(job),
    directApply: true,
  };
}

export function categoryLabel(job: Pick<Job, "category">) {
  return jobCategories[job.category as keyof typeof jobCategories] ?? job.category;
}
export function employmentLabel(job: Pick<Job, "employmentType">) {
  return employmentTypes[job.employmentType as keyof typeof employmentTypes] ?? job.employmentType;
}
