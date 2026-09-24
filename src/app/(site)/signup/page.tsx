import type { Metadata } from "next";
import { AuthPage } from "@/components/portal/auth-page";

export const metadata: Metadata = { title: "Create an account" };

export default async function SignupPage({ searchParams }: PageProps<"/signup">) {
  return <AuthPage mode="signup" nextParam={(await searchParams).next} />;
}
