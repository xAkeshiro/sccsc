"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { applicationOptions, districts } from "@/content/site";
import { getDb } from "@/db";
import { applicantProfiles, applicationEvents, applications, jobs, resumes } from "@/db/schema";
import { requireUser } from "@/lib/session";

export type ApplyState = { error?: string; fieldErrors?: Partial<Record<string, string>> };

// 3 MB keeps both the upload and the base64 download under Vercel's ~4.5 MB function payload limit.
const MAX_RESUME_BYTES = 3 * 1024 * 1024;

const RESUME_TYPES: Record<string, { mime: string; magic: number[] }> = {
  pdf: { mime: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  docx: {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    magic: [0x50, 0x4b, 0x03, 0x04], // ZIP container
  },
  doc: { mime: "application/msword", magic: [0xd0, 0xcf, 0x11, 0xe0] }, // OLE compound file
};

const oneOf = (allowed: readonly string[]) => z.array(z.string()).transform((v) => v.filter((x) => allowed.includes(x)));

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s()+.-]{7,20}$/, "Please enter a valid phone number."),
  city: z.string().trim().max(80).optional(),
  preferredDistricts: oneOf(districts.map((d) => d.id)),
  availability: oneOf(applicationOptions.availability).pipe(z.array(z.string()).min(1, "Choose at least one time you're available.")),
  earliestStart: z.string().trim().max(40).optional(),
  educationLevel: z.string().refine((v) => (applicationOptions.education as readonly string[]).includes(v), "Please choose your education level."),
  languages: oneOf(applicationOptions.languages),
  coverNote: z.string().trim().max(3000, "Please keep your note under 3,000 characters.").optional(),
  acknowledge: z.literal("on", { error: "Please confirm your information is accurate." }),
});

async function readResume(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) return { error: "Please attach your résumé." } as const;
  if (file.size > MAX_RESUME_BYTES) return { error: "Résumé must be 3 MB or smaller." } as const;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const kind = RESUME_TYPES[ext];
  if (!kind) return { error: "Résumé must be a PDF or Word document (.pdf, .doc, .docx)." } as const;
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!kind.magic.every((b, i) => bytes[i] === b)) {
    return { error: "That file doesn't look like a valid PDF or Word document." } as const;
  }
  return { file: { fileName: file.name.slice(0, 200), contentType: kind.mime, size: bytes.byteLength, data: bytes } } as const;
}

export async function submitApplication(slug: string, _prev: ApplyState, formData: FormData): Promise<ApplyState> {
  const user = await requireUser(`/demo/careers/${slug}/apply`);
  const db = getDb();

  const [job] = await db.select().from(jobs).where(eq(jobs.slug, slug));
  if (!job || job.status !== "open") return { error: "This position is no longer accepting applications." };

  const parsed = schema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    city: formData.get("city") || undefined,
    preferredDistricts: formData.getAll("preferredDistricts"),
    availability: formData.getAll("availability"),
    earliestStart: formData.get("earliestStart") || undefined,
    educationLevel: formData.get("educationLevel") ?? "",
    languages: formData.getAll("languages"),
    coverNote: formData.get("coverNote") || undefined,
    acknowledge: formData.get("acknowledge"),
  });

  const resume = await readResume(formData.get("resume"));
  if (!parsed.success || "error" in resume) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error?.issues ?? []) fieldErrors[String(issue.path[0])] ??= issue.message;
    if ("error" in resume && resume.error) fieldErrors.resume = resume.error;
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }
  const data = parsed.data;

  const [existing] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.jobId, job.id), eq(applications.userId, user.id)));
  if (existing) return { error: "You've already applied for this position — check your portal for its status." };

  try {
    await db.transaction(async (tx) => {
      const [savedResume] = await tx
        .insert(resumes)
        .values({ userId: user.id, ...resume.file })
        .returning({ id: resumes.id });
      const [application] = await tx
        .insert(applications)
        .values({
          jobId: job.id,
          userId: user.id,
          fullName: data.fullName,
          email: user.email,
          phone: data.phone,
          city: data.city,
          preferredDistricts: data.preferredDistricts,
          availability: data.availability,
          earliestStart: data.earliestStart,
          educationLevel: data.educationLevel,
          languages: data.languages,
          coverNote: data.coverNote,
          resumeId: savedResume.id,
        })
        .returning({ id: applications.id });
      await tx.insert(applicationEvents).values({ applicationId: application.id, status: "submitted", actorId: user.id });
      // Remember profile details to prefill the next application.
      const profile = { phone: data.phone, city: data.city, educationLevel: data.educationLevel, languages: data.languages, updatedAt: new Date() };
      await tx
        .insert(applicantProfiles)
        .values({ userId: user.id, ...profile })
        .onConflictDoUpdate({ target: applicantProfiles.userId, set: profile });
    });
  } catch (err) {
    // Unique (job, user) index — a double-submit raced the check above.
    if (String((err as { cause?: { code?: string } }).cause?.code ?? (err as { code?: string }).code) === "23505") {
      return { error: "You've already applied for this position — check your portal for its status." };
    }
    throw err;
  }

  // TODO: notify the recruitment team (e.g. via Resend) once an email provider is chosen.
  redirect(`/demo/portal?applied=${encodeURIComponent(slug)}`);
}
