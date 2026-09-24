"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { mainNav, org } from "@/content/site";
import { buttonClass } from "./ui";

export function MobileNav() {
  const pathname = usePathname();
  // Remember which page the menu was opened on, so navigating anywhere closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpenedOn(open ? null : pathname)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="grid size-11 place-items-center rounded-full text-ink-900 hover:bg-cream-200"
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>
      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full border-b border-cream-300 bg-cream-50 shadow-lg">
          <nav aria-label="Mobile" className="mx-auto flex max-w-6xl flex-col px-4 py-4 sm:px-6">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-xl px-3 py-3 text-lg font-semibold text-ink-900 hover:bg-cream-200">
                {item.label}
              </Link>
            ))}
            <Link href="/portal" className="rounded-xl px-3 py-3 text-lg font-semibold text-ink-900 hover:bg-cream-200">
              Applicant login
            </Link>
            <a href={org.donateUrl} className={`${buttonClass({ variant: "accent" })} mt-3`}>
              Donate
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
