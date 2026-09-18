import type { Notifications } from "@prisma/client";
import { Bell, Check } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsList({ notifications }: { notifications: Notifications[] }) {
  if (!notifications.length) return <div className="empty-state"><Bell className="mx-auto text-[var(--brand)]" /><p className="mt-4 font-semibold">You’re all caught up</p><p className="mt-1 text-sm text-[var(--muted)]">New likes, comments, and requests will appear here.</p></div>;
  return <div className="space-y-3">{notifications.map((notification) => <Link key={notification.id} href={`/post/${notification.postId}`} className="surface flex items-start gap-3 p-4 transition hover:border-[var(--brand)]/50 hover:bg-[var(--surface-2)]"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-500/15 text-[var(--brand)]">{notification.isRead ? <Check size={18} /> : <Bell size={18} />}</span><span className="min-w-0 flex-1"><span className="block text-sm leading-5">{notification.desc}</span><span className="mt-1 block text-xs text-[var(--muted)]">{formatDistanceToNow(notification.createdAt, { addSuffix: true })}</span></span>{!notification.isRead && <span className="mt-2 h-2 w-2 rounded-full bg-[var(--brand)]" aria-label="Unread" />}</Link>)}</div>;
}
