import { isLive } from "@/content/site";

/** Shown on every page until NEXT_PUBLIC_SITE_LIVE=true, so nobody mistakes a preview for the real site. */
export function PreviewBanner() {
  if (isLive()) return null;
  return (
    <div className="bg-sun-400 px-4 py-1.5 text-center text-xs font-semibold text-ink-900">
      Redesign preview — not the official SCCSC website. Job postings and applications here are samples.
    </div>
  );
}
