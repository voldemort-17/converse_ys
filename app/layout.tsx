import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import Navbar from "./components/Navbar";
import UnreadIndicator from "./components/UnreadIndicator";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Converse", template: "%s · Converse" },
  description: "Share moments and stay close to the people who matter.",
};

export const viewport: Viewport = { themeColor: "#080b11", colorScheme: "dark" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <a href="#main-content" className="sr-only z-[100] rounded-md bg-white p-3 text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
          <header className="sticky top-0 z-40 border-b border-white/5 bg-[rgb(8_11_17/85%)] backdrop-blur-xl">
            <div className="mx-auto max-w-[1480px] px-3 sm:px-5 lg:px-8">
              <Navbar
                unreadIndicator={
                  userId ? (
                    <Suspense fallback={null}>
                      <UnreadIndicator userId={userId} />
                    </Suspense>
                  ) : null
                }
              />
            </div>
          </header>
          <main id="main-content" className="mx-auto max-w-[1480px] px-3 pb-12 sm:px-5 lg:px-8">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
