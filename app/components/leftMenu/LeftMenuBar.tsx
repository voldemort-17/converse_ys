import { Bell, Home, ShieldCheck } from "lucide-react";
import Link from "next/link";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

export default function LeftMenuBar() {
  return (
    <nav className="surface flex flex-col gap-1 p-3" aria-label="Sidebar navigation">
      {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-white"><Icon size={18} />{label}</Link>)}
      <div className="mt-2 flex items-center gap-3 border-t border-[var(--border)] px-3 pt-4 text-xs text-[var(--muted)]"><ShieldCheck size={16} /> Private by design</div>
    </nav>
  );
}
