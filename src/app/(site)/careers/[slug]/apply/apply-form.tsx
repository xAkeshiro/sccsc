"use client";

import { Upload } from "lucide-react";
import { startTransition, useActionState, useState, type FormEvent } from "react";
import { Button, cx } from "@/components/ui";
import { applicationOptions, districts } from "@/content/site";
import type { ApplyState } from "./actions";

type Defaults = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  educationLevel: string;
  languages: string[];
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-brand-700">
      {message}
    </p>
  );
}

function CheckboxGroup({
  legend,
  name,
  options,
  defaults = [],
  error,
  hint,
}: {
  legend: string;
  name: string;
  options: readonly { value: string; label: string }[];
  defaults?: string[];
  error?: string;
  hint?: string;
}) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="field-label">{legend}</legend>
      {hint && <p className="-mt-1 mb-2 text-sm text-ink-500">{hint}</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink-100 bg-white px-3.5 py-2.5 has-[:checked]:border-jade-600 has-[:checked]:bg-jade-50"
          >
            <input type="checkbox" name={name} value={o.value} defaultChecked={defaults.includes(o.value)} className="size-4 accent-jade-700" />
            <span className="text-sm font-medium">{o.label}</span>
          </label>
        ))}
      </div>
      <FieldError id={`${name}-error`} message={error} />
    </fieldset>
  );
}

export function ApplyForm({
  action,
  defaults,
}: {
  action: (state: ApplyState, formData: FormData) => Promise<ApplyState>;
  defaults: Defaults;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [fileName, setFileName] = useState<string | null>(null);
  // The result a new file was picked after — its résumé error no longer applies.
  const [filePickedAfter, setFilePickedAfter] = useState<ApplyState | null>(null);
  const fe = { ...state.fieldErrors };
  if (filePickedAfter === state) delete fe.resume;
  // Submit via a transition instead of <form action> so React doesn't reset the fields when validation fails.
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }
  const invalid = (name: string) => (fe[name] ? { "aria-invalid": true, "aria-describedby": `${name}-error` } : {});

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      {state.error && (
        <p role="alert" className="rounded-xl bg-brand-50 px-4 py-3 font-medium text-brand-700">
          {state.error}
        </p>
      )}

      <section className="space-y-5">
        <h2 className="text-xl font-bold">Contact information</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="field-label">
              Full name
            </label>
            <input id="fullName" name="fullName" defaultValue={defaults.fullName} required autoComplete="name" className="field" {...invalid("fullName")} />
            <FieldError id="fullName-error" message={fe.fullName} />
          </div>
          <div>
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input id="email" value={defaults.email} readOnly className="field bg-cream-100 text-ink-500" aria-describedby="email-hint" />
            <p id="email-hint" className="mt-1.5 text-sm text-ink-500">
              From your account — we&apos;ll contact you here.
            </p>
          </div>
          <div>
            <label htmlFor="phone" className="field-label">
              Phone
            </label>
            <input id="phone" name="phone" type="tel" defaultValue={defaults.phone} required autoComplete="tel" className="field" {...invalid("phone")} />
            <FieldError id="phone-error" message={fe.phone} />
          </div>
          <div>
            <label htmlFor="city" className="field-label">
              City <span className="font-normal text-ink-500">(optional)</span>
            </label>
            <input id="city" name="city" defaultValue={defaults.city} autoComplete="address-level2" className="field" />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold">Where & when you can work</h2>
        <CheckboxGroup
          legend="Preferred school districts"
          hint="Optional — choose any that are convenient for you."
          name="preferredDistricts"
          options={districts.map((d) => ({ value: d.id, label: d.name }))}
          error={fe.preferredDistricts}
        />
        <CheckboxGroup
          legend="Availability"
          name="availability"
          options={applicationOptions.availability.map((a) => ({ value: a, label: a }))}
          error={fe.availability}
        />
        <div className="max-w-xs">
          <label htmlFor="earliestStart" className="field-label">
            Earliest start date <span className="font-normal text-ink-500">(optional)</span>
          </label>
          <input id="earliestStart" name="earliestStart" type="date" className="field" />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold">Background</h2>
        <div className="max-w-md">
          <label htmlFor="educationLevel" className="field-label">
            Highest education completed
          </label>
          <select id="educationLevel" name="educationLevel" defaultValue={defaults.educationLevel} required className="field" {...invalid("educationLevel")}>
            <option value="" disabled>
              Choose one…
            </option>
            {applicationOptions.education.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <FieldError id="educationLevel-error" message={fe.educationLevel} />
        </div>
        <CheckboxGroup
          legend="Languages you speak"
          hint="Many of our families speak languages other than English — bilingual staff are a big plus."
          name="languages"
          options={applicationOptions.languages.map((l) => ({ value: l, label: l }))}
          defaults={defaults.languages}
        />
      </section>

      <section className="space-y-5">
        <h2 className="text-xl font-bold">Résumé & note</h2>
        <div>
          <span className="field-label">Résumé</span>
          <label
            htmlFor="resume"
            className={cx(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-white px-6 py-8 text-center transition hover:border-jade-500",
              fe.resume ? "border-brand-500" : "border-ink-100",
            )}
          >
            <Upload className="size-7 text-jade-600" />
            <span className="font-semibold text-ink-900">{fileName ?? "Choose a file to upload"}</span>
            <span className="text-sm text-ink-500">PDF or Word, up to 4 MB</span>
          </label>
          <input
            id="resume"
            name="resume"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            required
            className="sr-only"
            onChange={(e) => {
              setFileName(e.currentTarget.files?.[0]?.name ?? null);
              setFilePickedAfter(state);
            }}
            {...invalid("resume")}
          />
          <FieldError id="resume-error" message={fe.resume} />
        </div>
        <div>
          <label htmlFor="coverNote" className="field-label">
            Anything you&apos;d like us to know? <span className="font-normal text-ink-500">(optional)</span>
          </label>
          <textarea id="coverNote" name="coverNote" rows={5} maxLength={3000} className="field" {...invalid("coverNote")} />
          <FieldError id="coverNote-error" message={fe.coverNote} />
        </div>
      </section>

      <div className="space-y-5 border-t border-ink-100 pt-6">
        <label className="flex items-start gap-3">
          <input type="checkbox" name="acknowledge" required className="mt-1 size-4 accent-jade-700" {...invalid("acknowledge")} />
          <span className="text-sm text-ink-700">
            I confirm the information in this application is true and complete to the best of my knowledge.
          </span>
        </label>
        <FieldError id="acknowledge-error" message={fe.acknowledge} />
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Submitting…" : "Submit application"}
        </Button>
      </div>
    </form>
  );
}
