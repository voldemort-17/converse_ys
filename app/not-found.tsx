import Link from "next/link";

export default function NotFound() {
  return <div className="grid min-h-[70vh] place-items-center text-center"><div><p className="text-sm font-semibold uppercase tracking-[.2em] text-[var(--brand)]">404</p><h1 className="mt-2 text-3xl font-bold">This page is not available</h1><p className="mt-3 text-[var(--muted)]">It may have been removed, or you may not have access.</p><Link href="/" className="primary-button mt-6">Return home</Link></div></div>;
}
