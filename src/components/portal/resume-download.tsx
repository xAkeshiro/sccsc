"use client";

import { Download, FileText } from "lucide-react";
import { useState, type ReactNode } from "react";
import { downloadResume } from "@/lib/resume-actions";

export function ResumeDownload({
  resumeId,
  className,
  icon = "file",
  children,
}: {
  resumeId: string;
  className?: string;
  icon?: "file" | "download";
  children: ReactNode;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const Icon = icon === "download" ? Download : FileText;

  async function onClick() {
    setPending(true);
    setError(null);
    const result = await downloadResume(resumeId);
    setPending(false);
    if ("error" in result) return setError(result.error);
    const bytes = Uint8Array.from(atob(result.base64), (c) => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: result.contentType }));
    const a = Object.assign(document.createElement("a"), { href: url, download: result.fileName });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <span className="inline-flex flex-col">
      <button type="button" onClick={onClick} disabled={pending} className={className}>
        <Icon className="size-4" /> {pending ? "Preparing…" : children}
      </button>
      {error && <span role="alert" className="mt-1 text-xs font-medium text-brand-700">{error}</span>}
    </span>
  );
}
