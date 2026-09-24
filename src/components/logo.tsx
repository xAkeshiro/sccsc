import Image from "next/image";
import Link from "next/link";
import { org } from "@/content/site";

/** Official logo when configured in content/site.ts; otherwise a text wordmark placeholder. */
export function Logo({ inverted = false }: { inverted?: boolean }) {
  const src = inverted ? (org.logo.invertedSrc ?? org.logo.src) : org.logo.src;
  if (src) {
    return (
      <Link href="/" aria-label={`${org.shortName} — ${org.name}, home`} className={inverted && !org.logo.invertedSrc ? "rounded-xl bg-white p-2" : undefined}>
        <Image src={src} alt={org.name} width={org.logo.width} height={org.logo.height} priority className="h-11 w-auto" />
      </Link>
    );
  }
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
