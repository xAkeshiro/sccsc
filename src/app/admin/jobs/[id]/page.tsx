import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { jobs } from "@/db/schema";
import { isUuid } from "@/lib/ids";
import { requireAdmin } from "@/lib/session";
import { saveJob } from "../../actions";
import { JobForm } from "../job-form";

export const metadata: Metadata = { title: "Edit posting" };

export default async function EditJobPage({ params }: PageProps<"/admin/jobs/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [job] = await getDb().select().from(jobs).where(eq(jobs.id, id));
  if (!job) notFound();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit: {job.title}</h1>
      <JobForm action={saveJob.bind(null, job.id)} job={job} />
    </div>
  );
}
