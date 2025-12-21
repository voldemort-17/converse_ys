import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { auth } from "@clerk/nextjs/server";
import { hasUnreadNotifications } from "@/lib/notifications";

export const metadata: Metadata = {
  title: "Converse",
  description: "Chat your way through...",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { userId } = await auth();

  const hasUnread = userId
    ? await hasUnreadNotifications(userId)
    : false;

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className="w-full sm:px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48">
            <Navbar hasUnread={hasUnread}/>
          </div>
          <div className="sm:px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-48">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
