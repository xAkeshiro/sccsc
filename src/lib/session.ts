import "server-only";

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { getAuth, isPortalConfigured } from "@/lib/auth";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

/**
 * Whether the careers portal can run. Always evaluated at request time, so portal pages never get
 * prerendered in an "offline" state that would outlive a database being attached later.
 */
export async function portalReady() {
  await connection();
  return isPortalConfigured();
}

/** Current signed-in user, or null. Memoized per request. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  if (!(await portalReady())) return null;
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) return null;
  const { id, name, email, role } = session.user as typeof session.user & { role?: string };
  return { id, name, email, role: role ?? "applicant" };
});

/** Only allow same-site relative paths as post-login destinations. */
export function safeNext(next: string | null | undefined, fallback = "/portal") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}

export async function requireUser(next?: string): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(safeNext(next))}`);
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser("/admin");
  // 404 rather than 403 so the admin area isn't advertised to applicants.
  if (user.role !== "admin") notFound();
  return user;
}
