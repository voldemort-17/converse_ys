"use client";

import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Bell, Home, LogIn, Search, UserRound, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import MobileMenu from "./MobileMenu";

type SearchResult = { id: string; username: string; name: string | null; surname: string | null; avatar: string | null };

export default function Navbar({ unreadIndicator }: { unreadIndicator: ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const normalizedQuery = query.trim();
  const visibleResults = useMemo(() => normalizedQuery.length >= 2 ? results : [], [normalizedQuery, results]);

  useEffect(() => {
    if (normalizedQuery.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(normalizedQuery)}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Search failed");
        setResults(await response.json() as SearchResult[]);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [normalizedQuery]);

  function closeSearch() {
    setMobileSearchOpen(false);
    setQuery("");
    setResults([]);
  }

  const searchResults = (
    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
      {loading && <p className="p-4 text-sm text-[var(--muted)]" role="status">Searching…</p>}
      {!loading && normalizedQuery.length >= 2 && visibleResults.length === 0 && <p className="p-4 text-sm text-[var(--muted)]">No people found</p>}
      {visibleResults.map((person) => (
        <Link key={person.id} href={`/profile/${person.username}`} onClick={closeSearch} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-2)]">
          <Image src={person.avatar || "/AvatarImage.jpg"} alt="" width={38} height={38} className="h-10 w-10 rounded-full object-cover" />
          <span className="min-w-0 text-sm"><span className="block truncate font-semibold">{[person.name, person.surname].filter(Boolean).join(" ") || person.username}</span><span className="text-[var(--muted)]">@{person.username}</span></span>
        </Link>
      ))}
    </div>
  );

  return (
    <nav className="flex h-16 items-center justify-between gap-3" aria-label="Primary navigation">
      <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-300 to-blue-600 text-[#06131e]">C</span><span className="hidden sm:inline">Converse</span></Link>
      <SignedIn>
        <div className="hidden items-center gap-1 md:flex">
          <Link href="/" className={`icon-action px-3 ${pathname === "/" ? "bg-[var(--surface-2)] text-[var(--brand)]" : ""}`} aria-label="Home"><Home size={20} /><span className="ml-2 hidden lg:inline">Home</span></Link>
          {user?.username && <Link href={`/profile/${user.username}`} className={`icon-action px-3 ${pathname.startsWith("/profile/") ? "bg-[var(--surface-2)] text-[var(--brand)]" : ""}`} aria-label="My profile"><UserRound size={20} /><span className="ml-2 hidden lg:inline">Profile</span></Link>}
        </div>
        <div className="relative hidden w-full max-w-sm md:block">
          <label className="input-shell flex items-center gap-2"><Search size={18} className="text-[var(--muted)]" /><span className="sr-only">Search people</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search people…" /></label>
          {normalizedQuery.length >= 2 && searchResults}
        </div>
      </SignedIn>
      <ClerkLoading><div className="h-9 w-24 animate-pulse rounded-lg bg-[var(--surface-2)]" aria-label="Loading account" /></ClerkLoading>
      <ClerkLoaded>
        <SignedIn>
          <div className="flex items-center gap-1 sm:gap-2">
            <MobileMenu />
            <button className="icon-action md:hidden" onClick={() => setMobileSearchOpen(true)} aria-label="Search people"><Search size={21} /></button>
            <Link href="/notifications" className={`icon-action relative ${pathname === "/notifications" ? "bg-[var(--surface-2)] text-[var(--brand)]" : ""}`} aria-label="Notifications"><Bell size={21} />{unreadIndicator}</Link>
            <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
          </div>
          {mobileSearchOpen && (
            <div className="fixed inset-0 z-[60] bg-[var(--page)] p-4 md:hidden" role="dialog" aria-modal="true" aria-label="Search people">
              <div className="mx-auto flex max-w-lg items-center gap-2"><label className="input-shell flex flex-1 items-center gap-2"><Search size={18} /><span className="sr-only">Search people</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Search people…" /></label><button onClick={closeSearch} className="icon-action" aria-label="Close search"><X /></button></div>
              <div className="relative mx-auto mt-3 max-w-lg">{normalizedQuery.length >= 2 && searchResults}</div>
            </div>
          )}
        </SignedIn>
        <SignedOut><Link href="/sign-in" className="primary-button"><LogIn size={18} /> Sign in</Link></SignedOut>
      </ClerkLoaded>
    </nav>
  );
}
