
import { prisma } from "@/lib/client";

export async function hasUnreadNotifications(userId: string) {
  const count = await prisma.notifications.count({
    where: {
      userId,
      isRead: false,
      expiresAt: { gt: new Date() },
    },
  });

  return count > 0;
}
