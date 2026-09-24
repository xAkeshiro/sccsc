"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { employmentTypes, jobCategories } from "@/content/site";
import { getDb } from "@/db";
import { APPLICATION_STATUSES, JOB_STATUSES, applicationEvents, applications, jobs } from "@/db/schema";
import { isUuid } from "@/lib/ids";
import { requireAdmin } from "@/lib/session";

export type JobFormState = { error?: string; fieldErrors?: Partial<Record<string, string>> };

const lines = z
  .string()
  .default("")
  .transform((v) =>
    v
      .split("\n")
      .map((l) => l.replace(/^\s*[-*•]\s*/, "").trim())
      .filter(Boolean),
  );
const optional = z
  .string()
  .trim()
  .max(200)
  .optional()
  .transform((v) => v || null);

const jobSchema = z.object({
  title: z.string().trim().min(3, "Title is required.").max(140),
  category: z.enum(Object.keys(jobCategories) as [string, ...string[]]),
  employmentType: z.enum(Object.keys(employmentTypes) as [string, ...string[]]),
  location: z.string().trim().min(2, "Location is required.").max(200),
  schedule: optional,
  payRange: optional,
  summary: z.string().trim().min(10, "Add a one- or two-sentence summary.").max(400),
  description: z.string().trim().max(5000).default(""),
  responsibilities: lines,
  qualifications: lines,
  status: z.enum(JOB_STATUSES),
});

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_-]+/g, "-")
      .slice(0, 70) || "job"
  );
}

async function uniqueSlug(title: string) {
  const base = slugify(title);
  const db = getDb();
  for (let i = 0; i < 20; i++) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`;
    const [taken] = await db.select({ id: jobs.id }).from(jobs).where(eq(jobs.slug, candidate));
    if (!taken) return candidate;
  }
  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

function parseJob(formData: FormData) {
  const raw = Object.fromEntries(
    ["title", "category", "employmentType", "location", "schedule", "payRange", "summary", "description", "responsibilities", "qualifications", "status"].map(
      (k) => [k, formData.get(k) ?? undefined],
    ),
  );
  return jobSchema.safeParse(raw);
}

function fieldErrors(error: z.ZodError): JobFormState {
  const out: Record<string, string> = {};
  for (const issue of error.issues) out[String(issue.path[0])] ??= issue.message;
  return { error: "Please fix the highlighted fields.", fieldErrors: out };
}

export async function saveJob(jobId: string | null, _prev: JobFormState, formData: FormData): Promise<JobFormState> {
  await requireAdmin();
  const parsed = parseJob(formData);
  if (!parsed.success) return fieldErrors(parsed.error);
  const data = parsed.data;
  const db = getDb();

  if (jobId) {
    if (!isUuid(jobId)) return { error: "Job not found." };
    const [current] = await db.select().from(jobs).where(eq(jobs.id, jobId));
    if (!current) return { error: "Job not found." };
    await db
      .update(jobs)
      .set({
        ...data,
        // First time a posting opens, stamp it so it sorts as "new".
        postedAt: data.status === "open" && !current.postedAt ? new Date() : current.postedAt,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, jobId));
  } else {
    await db.insert(jobs).values({
      ...data,
      slug: await uniqueSlug(data.title),
      postedAt: data.status === "open" ? new Date() : null,
    });
  }

  revalidatePath("/careers");
  revalidatePath("/admin/jobs");
  redirect("/admin/jobs");
}

export async function setJobStatus(jobId: string, status: (typeof JOB_STATUSES)[number]) {
  await requireAdmin();
  if (!isUuid(jobId) || !JOB_STATUSES.includes(status)) return;
  const db = getDb();
  const [current] = await db.select({ postedAt: jobs.postedAt }).from(jobs).where(eq(jobs.id, jobId));
  if (!current) return;
  await db
    .update(jobs)
    .set({ status, postedAt: status === "open" && !current.postedAt ? new Date() : current.postedAt, updatedAt: new Date() })
    .where(eq(jobs.id, jobId));
  revalidatePath("/careers");
  revalidatePath("/admin/jobs");
}

const reviewSchema = z.object({
  status: z.enum(APPLICATION_STATUSES),
  adminNotes: z.string().max(5000).default(""),
});

export async function updateApplication(applicationId: string, formData: FormData) {
  const admin = await requireAdmin();
  if (!isUuid(applicationId)) return;
  const parsed = reviewSchema.safeParse({
    status: formData.get("status"),
    adminNotes: formData.get("adminNotes") ?? undefined,
  });
  if (!parsed.success) return;

  const db = getDb();
  const [current] = await db.select({ status: applications.status }).from(applications).where(eq(applications.id, applicationId));
  if (!current) return;

  await db
    .update(applications)
    .set({ status: parsed.data.status, adminNotes: parsed.data.adminNotes.trim() || null, updatedAt: new Date() })
    .where(eq(applications.id, applicationId));
  if (current.status !== parsed.data.status) {
    await db.insert(applicationEvents).values({ applicationId, status: parsed.data.status, actorId: admin.id });
  }
  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/admin/applications");
}
