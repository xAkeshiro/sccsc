import type { Metadata } from "next";
import { AuthPage } from "@/components/portal/auth-page";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  return <AuthPage mode="login" nextParam={(await searchParams).next} />;
}
