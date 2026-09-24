import type { ApplicationStatus, JobStatus } from "@/db/schema";

export const applicationStatusMeta: Record<
  ApplicationStatus,
  { label: string; tone: "brand" | "sun" | "ink" | "lake"; applicantHint: string }
> = {
  submitted: { label: "Submitted", tone: "lake", applicantHint: "We've received your application." },
  reviewing: { label: "In review", tone: "sun", applicantHint: "Our recruitment team is reviewing your application." },
  interview: { label: "Interview", tone: "brand", applicantHint: "We'd like to meet you — watch your email and phone for scheduling." },
  offer: { label: "Offer", tone: "brand", applicantHint: "Great news — check your email for offer details." },
  hired: { label: "Hired", tone: "brand", applicantHint: "Welcome to the team!" },
  not_selected: { label: "Not selected", tone: "ink", applicantHint: "We've moved forward with other candidates for this role. Other openings may be a great fit." },
  withdrawn: { label: "Withdrawn", tone: "ink", applicantHint: "You withdrew this application." },
};

export const jobStatusMeta: Record<JobStatus, { label: string; tone: "brand" | "sun" | "ink" }> = {
  draft: { label: "Draft", tone: "sun" },
  open: { label: "Open", tone: "brand" },
  closed: { label: "Closed", tone: "ink" },
};

/** Statuses an applicant can still withdraw from. */
export const withdrawableStatuses: ApplicationStatus[] = ["submitted", "reviewing", "interview"];
