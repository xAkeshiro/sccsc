import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { isLive, org } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const display = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const sans = Figtree({ variable: "--font-figtree", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: `${org.shortName} | ${org.name}`,
    template: `%s | ${org.shortName} — ${org.acronym}`,
  },
  description:
    "Before-school, after-school and summer programs at 95+ Sacramento-area schools, plus workforce and community programs — serving families since 1978.",
  // Keep previews out of search results until the client flips NEXT_PUBLIC_SITE_LIVE.
  robots: isLive() ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#d0112b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
