"use client";

import { useUser } from "@clerk/nextjs";
import { Bell, Home, Menu, UserRound, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";

type NavigationLink = {
  href: string;
  label: string;
  description: string;
  icon: ComponentType<{ size?: number }>;
  active: boolean;
};

export default function MobileMenu() {
  const { user } = useUser();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    const desktopQuery = window.matchMedia("(min-width: 768px)");

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    desktopQuery.addEventListener("change", closeOnDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      desktopQuery.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  const links: NavigationLink[] = [
    {
      href: "/",
      label: "Home",
      description: "See the latest posts and stories",
      icon: Home,
      active: pathname === "/",
    },
    ...(user?.username
      ? [
          {
            href: `/profile/${user.username}`,
            label: "My profile",
            description: "View your posts and profile",
            icon: UserRound,
            active: pathname === `/profile/${user.username}`,
          },
        ]
      : []),
    {
      href: "/notifications",
      label: "Notifications",
      description: "Review your recent activity",
      icon: Bell,
      active: pathname === "/notifications",
    },
  ];

  const drawer = open
    ? createPortal(
        <div
          className="fixed inset-0 z-[100] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-navigation-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(88vw,22rem)] flex-col border-l border-[var(--border)] bg-[var(--page)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <div>
                <p id="mobile-navigation-title" className="text-lg font-bold">Menu</p>
                <p className="text-xs text-[var(--muted)]">Navigate Converse</p>
              </div>
              <button
                type="button"
                className="icon-action"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                autoFocus
              >
                <X size={22} />
              </button>
            </div>

            {user && (
              <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
                <Image
                  src={user.imageUrl || "/AvatarImage.jpg"}
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {[user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "Your account"}
                  </p>
                  {user.username && <p className="truncate text-xs text-[var(--muted)]">@{user.username}</p>}
                </div>
              </div>
            )}

            <nav aria-label="Mobile navigation" className="flex-1 space-y-2 overflow-y-auto p-4">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={link.active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                      link.active
                        ? "border-sky-400/30 bg-sky-400/10 text-[var(--brand)]"
                        : "border-transparent hover:border-[var(--border)] hover:bg-[var(--surface-2)]"
                    }`}
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${link.active ? "bg-sky-400/15" : "bg-[var(--surface-2)]"}`}>
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold">{link.label}</span>
                      <span className="block truncate text-xs text-[var(--muted)]">{link.description}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <p className="border-t border-[var(--border)] px-5 py-4 text-center text-xs text-[var(--muted)]">
              Tap outside the menu or press Escape to close
            </p>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="icon-action"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Open navigation"
      >
        <Menu size={22} />
      </button>
      {drawer}
    </div>
  );
}
