"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { cx } from "@/components/ui";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await authClient.signOut();
        router.replace("/");
        router.refresh();
      }}
      className={cx("inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-brand-700", className)}
    >
      <LogOut className="size-4" /> {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
