import { isLive } from "@/content/site";
import { isDemoMode } from "@/db";

/** Shown on every page until NEXT_PUBLIC_SITE_LIVE=true, so nobody mistakes a preview for the real site. */
export function PreviewBanner() {
  if (isDemoMode()) {
    return (
      <div className="bg-sun-400 px-4 py-1.5 text-center text-xs font-semibold text-ink-900">
        Demo site — the careers portal uses sample data that resets periodically. Please don&apos;t upload real résumés.
      </div>
    );
  }
  if (isLive()) return null;
  return (
    <div className="bg-sun-400 px-4 py-1.5 text-center text-xs font-semibold text-ink-900">
      Redesign preview — not the official SCCSC website. Job postings and applications here are samples.
    </div>
  );
}
