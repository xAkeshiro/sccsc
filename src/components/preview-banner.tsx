import type { ReactNode } from "react";
import { isLive } from "@/content/site";
import { isDemoMode } from "@/db";

/**
 * Shown on every page until NEXT_PUBLIC_SITE_LIVE=true, so nobody mistakes a preview for the real site.
 * `note` adds page-specific context, such as links for comparing design versions.
 */
export function PreviewBanner({ note }: { note?: ReactNode } = {}) {
  const message = isDemoMode()
    ? "Demo site — the careers portal uses sample data that resets periodically. Please don't upload real résumés."
    : isLive()
      ? null
      : "Redesign preview — not the official SCCSC website. Job postings and applications here are samples.";
  if (!message && !note) return null;
  return (
    <div className="bg-sun-400 px-4 py-1.5 text-center text-xs font-semibold text-ink-900">
      {message}
      {message && note && <span className="mx-1.5">·</span>}
      {note}
    </div>
  );
}
