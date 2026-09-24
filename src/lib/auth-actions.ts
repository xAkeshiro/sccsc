"use server";

import { parseSetCookieHeader, toCookieOptions } from "better-auth/cookies";
import { cookies, headers } from "next/headers";
import { ensureDbReady } from "@/db";
import { getAuth, isPortalConfigured } from "@/lib/auth";

export type AuthResult = { ok: true } | { ok: false; status: number; message?: string };

/**
 * Runs a Better Auth endpoint in-process from a server action.
 *
 * Why not let the browser call /api/auth directly? On Vercel, route handlers and pages are
 * deployed as separate functions. In demo mode each function has its own in-memory database,
 * so a session created by /api/auth would be unknown to the pages. Server actions execute in
 * the page function. Going through `handler` (rather than `auth.api.*`) keeps Better Auth's
 * rate limiting and origin checks.
 */
async function callAuth(path: string, body: Record<string, unknown>): Promise<AuthResult> {
  if (!isPortalConfigured()) return { ok: false, status: 503 };
  await ensureDbReady();

  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost";
  const proto = incoming.get("x-forwarded-proto") ?? (/^(localhost|127\.0\.0\.1)(:|$)/.test(host) ? "http" : "https");
  const origin = `${proto}://${host}`;

  const forwarded = new Headers({ "content-type": "application/json", origin });
  for (const name of ["cookie", "user-agent", "x-forwarded-for", "x-real-ip", "x-forwarded-host", "x-forwarded-proto"]) {
    const value = incoming.get(name);
    if (value) forwarded.set(name, value);
  }

  const response = await getAuth().handler(
    new Request(`${origin}/api/auth${path}`, { method: "POST", headers: forwarded, body: JSON.stringify(body) }),
  );

  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    const jar = await cookies();
    parseSetCookieHeader(setCookie).forEach((cookie, name) => {
      if (name) jar.set(name, cookie.value, toCookieOptions(cookie));
    });
  }

  if (response.ok) return { ok: true };
  const data = (await response.json().catch(() => null)) as { message?: string } | null;
  return { ok: false, status: response.status, message: data?.message };
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

export async function signIn(email: unknown, password: unknown) {
  return callAuth("/sign-in/email", { email: str(email, 254).trim(), password: str(password, 256) });
}

export async function signUp(name: unknown, email: unknown, password: unknown) {
  return callAuth("/sign-up/email", {
    name: str(name, 120).trim(),
    email: str(email, 254).trim(),
    password: str(password, 256),
  });
}

export async function signOut() {
  return callAuth("/sign-out", {});
}
