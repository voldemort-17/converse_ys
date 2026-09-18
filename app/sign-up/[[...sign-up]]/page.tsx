import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return <div className="grid min-h-[calc(100vh-64px)] place-items-center py-8"><SignUp /></div>;
}
