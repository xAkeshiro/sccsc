import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { isDemoMode } from "@/db";
import { DEMO_ADMIN } from "@/db/seed";
import { getCurrentUser, portalReady, safeNext } from "@/lib/session";
import { AuthForm } from "./auth-form";
import { PortalOffline } from "./portal-offline";

export async function AuthPage({ mode, nextParam }: { mode: "login" | "signup"; nextParam: string | string[] | undefined }) {
  if (!(await portalReady())) return <PortalOffline />;
  const next = safeNext(typeof nextParam === "string" ? nextParam : undefined);
  if (await getCurrentUser()) redirect(next);

  const applying = next.startsWith("/demo/careers/");
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">{mode === "login" ? "Welcome back" : "Create your applicant account"}</h1>
          <p className="mt-3 text-ink-700">
            {applying
              ? "Sign in or create a free account to finish your application."
              : mode === "login"
                ? "Sign in to apply for jobs and check your application status."
                : "One account lets you apply to any opening and track every application in one place."}
          </p>
        </div>
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-100 sm:p-8">
          <AuthForm mode={mode} next={next} />
        </div>
        {isDemoMode() && mode === "login" && (
          <div className="mt-6 rounded-2xl bg-sun-100 p-5 text-sm text-ink-900 ring-1 ring-sun-300/60">
            <p className="font-bold">Demo: try the HR admin view</p>
            <p className="mt-1">
              Email <code className="font-semibold">{DEMO_ADMIN.email}</code> · Password{" "}
              <code className="font-semibold">{DEMO_ADMIN.password}</code>
            </p>
            <p className="mt-1 text-ink-700">Or create your own applicant account to apply for a sample job.</p>
          </div>
        )}
      </div>
    </Container>
  );
}
