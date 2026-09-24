import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const buttonVariants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  accent: "bg-brand-600 text-white hover:bg-brand-700",
  jade: "bg-jade-700 text-white hover:bg-jade-800",
  secondary: "border border-ink-100 bg-white text-ink-900 hover:border-ink-300",
  light: "bg-white text-ink-900 hover:bg-cream-100",
  ghost: "text-jade-700 hover:bg-jade-50",
  danger: "border border-brand-100 bg-white text-brand-700 hover:bg-brand-50",
} as const;

const buttonSizes = {
  sm: "px-3.5 py-1.5 text-sm",
  md: "px-5 py-2.5 text-[0.95rem]",
  lg: "px-6 py-3.5 text-base",
} as const;

type ButtonStyle = { variant?: keyof typeof buttonVariants; size?: keyof typeof buttonSizes };

export function buttonClass({ variant = "primary", size = "md" }: ButtonStyle = {}) {
  return cx(buttonBase, buttonVariants[variant], buttonSizes[size]);
}

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & ButtonStyle) {
  return <Link className={cx(buttonClass({ variant, size }), className)} {...props} />;
}

export function Button({ variant, size, className, ...props }: ComponentProps<"button"> & ButtonStyle) {
  return <button className={cx(buttonClass({ variant, size }), className)} {...props} />;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("text-sm font-bold uppercase tracking-[0.14em] text-brand-600", className)}>{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cx("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-2 text-3xl font-bold text-ink-900 sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-ink-700">{intro}</p>}
    </div>
  );
}

const photoTones = {
  jade: "from-jade-200 via-jade-100 to-lake-100",
  sun: "from-sun-300 via-sun-100 to-cream-200",
  vermilion: "from-brand-100 via-cream-200 to-sun-100",
  lake: "from-lake-300 via-lake-100 to-jade-100",
} as const;

/**
 * A photo, or a labeled placeholder until one is supplied. Real photos of the Center's own
 * students and staff (with signed media releases) matter more than any other visual on the site.
 */
export function PhotoSlot({
  label,
  src,
  tone = "jade",
  className,
  priority,
}: {
  label: string;
  src?: string | null;
  tone?: keyof typeof photoTones;
  className?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={cx("relative overflow-hidden rounded-3xl bg-cream-200", className)}>
        <Image src={src} alt={label} fill priority={priority} sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover" />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={`Photo placeholder: ${label}`}
      className={cx("relative overflow-hidden rounded-3xl bg-gradient-to-br", photoTones[tone], className)}
    >
      <span className="absolute bottom-3 left-3 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-ink-700 backdrop-blur">
        Photo: {label}
      </span>
    </div>
  );
}

export function Badge({ children, tone = "brand" }: { children: ReactNode; tone?: "brand" | "sun" | "ink" | "lake" }) {
  const tones = {
    brand: "bg-brand-50 text-brand-700 ring-brand-100",
    sun: "bg-sun-100 text-ink-900 ring-sun-300/60",
    ink: "bg-ink-100/60 text-ink-700 ring-ink-100",
    lake: "bg-lake-100 text-lake-700 ring-lake-300/60",
  };
  return (
    <span className={cx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", tones[tone])}>
      {children}
    </span>
  );
}

const heroTones = {
  jade: { section: "border-brand-600 bg-jade-800", eyebrow: "text-sun-300", intro: "text-jade-50/90" },
  // Careers area: logo red with a deep-crimson rule, no green.
  brand: { section: "border-brand-800 bg-brand-600", eyebrow: "text-sun-300", intro: "text-brand-50" },
} as const;

export function PageHero({
  eyebrow,
  title,
  intro,
  tone = "jade",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: keyof typeof heroTones;
  children?: ReactNode;
}) {
  const t = heroTones[tone];
  return (
    <section className={cx("relative overflow-hidden border-b-8 text-white", t.section)}>
      <Container className="relative py-16 sm:py-20">
        {eyebrow && <p className={cx("text-sm font-bold uppercase tracking-[0.14em]", t.eyebrow)}>{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-4xl font-bold sm:text-5xl">{title}</h1>
        {intro && <p className={cx("mt-5 max-w-2xl text-lg leading-relaxed", t.intro)}>{intro}</p>}
        {children}
      </Container>
    </section>
  );
}
