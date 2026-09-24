"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode, next }: { mode: "login" | "signup"; next: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    const { error } =
      mode === "signup"
        ? await authClient.signUp.email({ name: String(form.get("name") ?? "").trim(), email, password })
        : await authClient.signIn.email({ email, password });

    if (error) {
      setPending(false);
      setError(
        error.status === 429
          ? "Too many attempts. Please wait a minute and try again."
          : mode === "login"
            ? "That email and password don't match our records."
            : (error.message ?? "We couldn't create your account. Please try again."),
      );
      return;
    }
    router.replace(next);
    router.refresh();
  }

  const alt = mode === "login" ? "/signup" : "/login";
  const altHref = `${alt}?next=${encodeURIComponent(next)}`;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {mode === "signup" && (
        <div>
          <label htmlFor="name" className="field-label">
            Full name
          </label>
          <input id="name" name="name" required autoComplete="name" className="field" />
        </div>
      )}
      <div>
        <label htmlFor="email" className="field-label">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className="field" />
      </div>
      <div>
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="field"
          aria-describedby={mode === "signup" ? "password-hint" : undefined}
        />
        {mode === "signup" && (
          <p id="password-hint" className="mt-1.5 text-sm text-ink-500">
            At least 8 characters.
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-vermilion-50 px-4 py-3 text-sm font-medium text-vermilion-700">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </Button>

      <p className="text-center text-sm text-ink-700">
        {mode === "login" ? "New here? " : "Already have an account? "}
        <Link href={altHref} className="font-semibold text-jade-700 underline">
          {mode === "login" ? "Create an applicant account" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
