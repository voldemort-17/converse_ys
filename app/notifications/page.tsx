import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NotificationsList from "../components/NotificationList";
import { prisma } from "@/lib/client";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const notifications = await prisma.notifications.findMany({ where: { userId, expiresAt: { gt: new Date() } }, orderBy: { createdAt: "desc" }, take: 50 });
  if (notifications.some(({ isRead }) => !isRead)) await prisma.notifications.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  return <div className="mx-auto max-w-2xl py-7"><header className="mb-6"><p className="text-sm font-semibold uppercase tracking-[.18em] text-[var(--brand)]">Inbox</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Notifications</h1></header><NotificationsList notifications={notifications} /></div>;
}
