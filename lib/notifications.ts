
import { prisma } from "@/lib/client";

export async function hasUnreadNotifications(userId: string) {
  const notification = await prisma.notifications.findFirst({
    where: {
      userId,
      isRead: false,
      expiresAt: { gt: new Date() },
    },
    select: { id: true },
  });

  return Boolean(notification);
}
