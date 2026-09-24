"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { Button } from "@/components/ui";
import { employmentTypes, jobCategories } from "@/content/site";
import type { Job } from "@/db/schema";
import type { JobFormState } from "../actions";

export function JobForm({
  action,
  job,
}: {
  action: (state: JobFormState, formData: FormData) => Promise<JobFormState>;
  job?: Job;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const fe = state.fieldErrors ?? {};

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  const text = (name: keyof Job & string, label: string, opts: { required?: boolean; placeholder?: string; hint?: string } = {}) => (
    <div>
      <label htmlFor={name} className="field-label">
        {label} {!opts.required && <span className="font-normal text-ink-500">(optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={(job?.[name] as string | null) ?? ""}
        required={opts.required}
        placeholder={opts.placeholder}
        className="field"
        aria-invalid={fe[name] ? true : undefined}
      />
      {opts.hint && <p className="mt-1.5 text-xs text-ink-500">{opts.hint}</p>}
      {fe[name] && <p className="mt-1.5 text-sm font-medium text-brand-700">{fe[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl bg-white p-6 ring-1 ring-ink-100 sm:p-8">
      {state.error && (
        <p role="alert" className="rounded-xl bg-brand-50 px-4 py-3 font-medium text-brand-700">
          {state.error}
        </p>
      )}
      {text("title", "Job title", { required: true })}
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="category" className="field-label">
            Category
          </label>
          <select id="category" name="category" defaultValue={job?.category ?? "expanded-learning"} className="field">
            {Object.entries(jobCategories).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="employmentType" className="field-label">
            Type
          </label>
          <select id="employmentType" name="employmentType" defaultValue={job?.employmentType ?? "part-time"} className="field">
            {Object.entries(employmentTypes).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="field-label">
            Visibility
          </label>
          <select id="status" name="status" defaultValue={job?.status ?? "draft"} className="field">
            <option value="draft">Draft (hidden)</option>
            <option value="open">Open (accepting applications)</option>
            <option value="closed">Closed</option>
          </select>
          <p className="mt-1.5 text-xs text-ink-500">
            Open jobs also appear on Indeed and Google Jobs; edits and closures reach them within a few hours. Always make
            changes here. Edits made on Indeed are overwritten.
          </p>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {text("location", "Location", { required: true, placeholder: "e.g. School sites across Natomas Unified" })}
        {text("schedule", "Schedule", { placeholder: "e.g. Weekday afternoons during the school year" })}
        {text("payRange", "Pay", {
          placeholder: "e.g. $19.00–$21.00/hour",
          hint: "Required in California job postings; Indeed and Google also rank jobs with pay higher.",
        })}
      </div>
      <div>
        <label htmlFor="summary" className="field-label">
          Summary
        </label>
        <textarea id="summary" name="summary" rows={2} defaultValue={job?.summary ?? ""} required className="field" aria-invalid={fe.summary ? true : undefined} />
        <p className="mt-1.5 text-xs text-ink-500">One or two sentences shown on the job board.</p>
        {fe.summary && <p className="mt-1.5 text-sm font-medium text-brand-700">{fe.summary}</p>}
      </div>
      <div>
        <label htmlFor="description" className="field-label">
          About the role <span className="font-normal text-ink-500">(optional)</span>
        </label>
        <textarea id="description" name="description" rows={4} defaultValue={job?.description ?? ""} className="field" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="responsibilities" className="field-label">
            Responsibilities
          </label>
          <textarea id="responsibilities" name="responsibilities" rows={6} defaultValue={job?.responsibilities.join("\n") ?? ""} className="field" />
          <p className="mt-1.5 text-xs text-ink-500">One per line.</p>
        </div>
        <div>
          <label htmlFor="qualifications" className="field-label">
            Qualifications
          </label>
          <textarea id="qualifications" name="qualifications" rows={6} defaultValue={job?.qualifications.join("\n") ?? ""} className="field" />
          <p className="mt-1.5 text-xs text-ink-500">One per line.</p>
        </div>
      </div>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving…" : job ? "Save changes" : "Create posting"}
      </Button>
    </form>
  );
}
