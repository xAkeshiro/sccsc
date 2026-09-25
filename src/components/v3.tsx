import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "./ui";

/**
 * Building blocks for the v3 design exploration (/v3): warmer colors, sticker-style labels,
 * hand-drawn accents and hard offset shadows, for a friendlier, less corporate feel.
 */

const funButtonTones = {
  brand: "bg-brand-600 text-white hover:bg-brand-700",
  sun: "bg-sun-300 text-ink-900 hover:bg-sun-400",
  white: "bg-white text-ink-900 hover:bg-cream-50",
  ink: "bg-ink-900 text-white hover:bg-black",
} as const;

/** A pill button that lifts on hover and presses down on click. */
export function FunButtonLink({
  tone = "brand",
  className,
  ...props
}: ComponentProps<typeof Link> & { tone?: keyof typeof funButtonTones }) {
  return (
    <Link
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink-900 px-6 py-3 text-base font-bold shadow-hard transition",
        "hover:-translate-x-px hover:-translate-y-px hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
        funButtonTones[tone],
        className,
      )}
      {...props}
    />
  );
}

const stickerTones = {
  sun: "bg-sun-300 text-ink-900",
  brand: "bg-brand-600 text-white",
  white: "bg-white text-ink-900",
  lake: "bg-lake-200 text-ink-900",
  coral: "bg-coral-200 text-ink-900",
} as const;

/** A tilted label, used where the redesign has an uppercase eyebrow. */
export function Sticker({
  tone = "sun",
  tilt = "left",
  className,
  children,
}: {
  tone?: keyof typeof stickerTones;
  tilt?: "left" | "right";
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      className={cx(
        "inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink-900 px-3.5 py-1 text-sm font-bold shadow-hard-sm",
        tilt === "left" ? "-rotate-2" : "rotate-2",
        stickerTones[tone],
        className,
      )}
    >
      {children}
    </p>
  );
}

export function FunHeading({
  sticker,
  tone,
  title,
  intro,
  align = "left",
  className,
}: {
  sticker?: string;
  tone?: keyof typeof stickerTones;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cx("flex max-w-2xl flex-col", align === "center" ? "mx-auto items-center text-center" : "items-start", className)}>
      {sticker && <Sticker tone={tone}>{sticker}</Sticker>}
      <h2 className="mt-5 text-3xl font-extrabold text-ink-900 sm:text-5xl">{title}</h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-ink-700">{intro}</p>}
    </div>
  );
}

/** A highlighter stroke behind a word. The heading around it needs `isolate`. */
export function Highlight({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className="relative inline-block">
      <span aria-hidden className={cx("absolute -inset-x-[0.06em] bottom-[0.1em] -z-10 h-[0.42em] -rotate-1 rounded-[0.2em]", className)} />
      {children}
    </span>
  );
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      <path d="M12 0c.9 6.4 4.6 10.2 12 12-7.4 1.8-11.1 5.6-12 12-.9-6.4-4.6-10.2-12-12C7.4 10.2 11.1 6.4 12 0Z" fill="currentColor" />
    </svg>
  );
}

export function Squiggle({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 112 16" fill="none" preserveAspectRatio="none" className={className}>
      <path d="M2 8c9-8 18-8 27 0s18 8 27 0 18-8 27 0 18 8 27 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * A wavy edge in the color of the section it joins (set with a text color). Put it just above
 * that section, or `flip` it just below.
 */
export function Wave({ flip = false, className }: { flip?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 56"
      preserveAspectRatio="none"
      className={cx("block h-7 w-full sm:h-12", flip ? "-mt-px rotate-180" : "-mb-px", className)}
    >
      <path d="M0 30C240 2 480 2 720 26s480 26 720 0v30H0Z" fill="currentColor" />
    </svg>
  );
}

/**
 * A slowly scrolling strip of words. The list is repeated so the loop is seamless; screen
 * readers get it once. It stops for visitors who prefer reduced motion and pauses on hover.
 */
export function Marquee({ items, className }: { items: readonly string[]; className?: string }) {
  const row = (copy: number) => (
    <ul aria-hidden={copy > 0 || undefined} className="flex shrink-0 items-center">
      {[...items, ...items].map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center whitespace-nowrap" aria-hidden={i >= items.length || undefined}>
          <span className="px-5">{item}</span>
          <Sparkle className="size-4 shrink-0 text-sun-300" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cx("flex overflow-hidden", className)}>
      <div className="flex animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}
