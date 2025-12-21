import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/client";
import NotificationsList from "../components/NotificationList";

export default async function NotificationsPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div className="p-4 text-white">Not authenticated</div>;
  }

  const notifications = await prisma.notifications.findMany({
    where: {
      userId,
      expiresAt: {
        gt: new Date(), // ignore expired notifications
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <NotificationsList notifications={notifications} />
    </div>
  );
}
