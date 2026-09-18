import { hasUnreadNotifications } from "@/lib/notifications";

export default async function UnreadIndicator({ userId }: { userId: string }) {
  let hasUnread = false;

  try {
    hasUnread = await hasUnreadNotifications(userId);
  } catch {
    return null;
  }

  if (!hasUnread) return null;

  return (
    <span
      className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[var(--page)]"
      aria-label="Unread notifications"
    />
  );
}
