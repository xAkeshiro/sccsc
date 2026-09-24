"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { resumes } from "@/db/schema";
import { isUuid } from "@/lib/ids";
import { getCurrentUser } from "@/lib/session";

export type ResumeDownload = { fileName: string; contentType: string; base64: string } | { error: string };

/**
 * Returns a résumé to its owner or an admin. A server action (rather than a route handler) so it
 * runs in the same Vercel function as the pages — required for demo mode's in-memory database.
 */
export async function downloadResume(id: string): Promise<ResumeDownload> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in again." };
  if (!isUuid(id)) return { error: "Résumé not found." };
  const [file] = await getDb().select().from(resumes).where(eq(resumes.id, id));
  if (!file || (file.userId !== user.id && user.role !== "admin")) return { error: "Résumé not found." };
  return { fileName: file.fileName, contentType: file.contentType, base64: Buffer.from(file.data).toString("base64") };
}
