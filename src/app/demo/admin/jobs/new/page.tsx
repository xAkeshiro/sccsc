import type { Metadata } from "next";
import { requireAdmin } from "@/lib/session";
import { saveJob } from "../../actions";
import { JobForm } from "../job-form";

export const metadata: Metadata = { title: "New posting" };

export default async function NewJobPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">New job posting</h1>
      <JobForm action={saveJob.bind(null, null)} />
    </div>
  );
}
