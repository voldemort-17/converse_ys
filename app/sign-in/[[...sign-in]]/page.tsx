import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return <div className="grid min-h-[calc(100vh-64px)] place-items-center py-8"><SignIn /></div>;
}
