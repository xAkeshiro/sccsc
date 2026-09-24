import Link from "next/link";
import { org } from "@/content/site";

/** Text wordmark placeholder — replace with the client's logo files once provided. */
export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={`${org.shortName} — ${org.name}, home`}>
      <span
        aria-hidden
        className={`grid size-10 place-items-center rounded-xl font-display text-lg font-extrabold ${
          inverted ? "bg-white text-jade-800" : "bg-jade-700 text-white"
        }`}
      >
        C
      </span>
      <span className="leading-none">
        <span className={`block font-display text-xl font-bold ${inverted ? "text-white" : "text-ink-900"}`}>
          {org.shortName}
        </span>
        <span className={`mt-1 block text-[0.7rem] font-semibold tracking-wide ${inverted ? "text-jade-100" : "text-ink-500"}`}>
          {org.acronym} · Since {org.founded}
        </span>
      </span>
    </Link>
  );
}
