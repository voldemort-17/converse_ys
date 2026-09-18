"use client";

import { useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MobileMenu() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const links = [
    { href: "/", label: "Home" },
    ...(user?.username ? [{ href: `/profile/${user.username}`, label: "My profile" }] : []),
    { href: "/notifications", label: "Notifications" },
  ];

  return (
    <div className="md:hidden">
      <button className="icon-action" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"}>
        {open ? <X /> : <Menu />}
      </button>
      {open && (
        <div id="mobile-navigation" className="fixed inset-x-0 bottom-0 top-[65px] z-50 border-t border-[var(--border)] bg-[var(--page)]/98 p-5 backdrop-blur-xl">
          <nav aria-label="Mobile navigation" className="mx-auto flex max-w-md flex-col gap-2 pt-6">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-4 text-lg font-semibold hover:bg-[var(--surface-2)]">{link.label}</Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
