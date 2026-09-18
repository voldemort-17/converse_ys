import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/client";

function usernameFor(data: { id: string; username?: string | null; first_name?: string | null; last_name?: string | null }) {
  const preferred = data.username?.trim();
  const name = `${data.first_name || ""}${data.last_name || ""}`.trim().replace(/\s+/g, "_").toLowerCase();
  return preferred || `${name || "user"}_${data.id.slice(-8)}`;
}

export async function POST(request: NextRequest) {
  try {
    const event = await verifyWebhook(request, { signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET });
    if (event.type === "user.created" || event.type === "user.updated") {
      const user = event.data;
      await prisma.user.upsert({
        where: { id: user.id },
        create: { id: user.id, username: usernameFor(user), avatar: user.image_url || "/AvatarImage.jpg", cover: "/CoverImage.jpg", name: user.first_name, surname: user.last_name },
        update: { username: usernameFor(user), avatar: user.image_url || "/AvatarImage.jpg", name: user.first_name, surname: user.last_name },
      });
    }

    if (event.type === "user.deleted" && event.data.id) {
      const userId = event.data.id;
      const posts = await prisma.post.findMany({ where: { userId }, select: { id: true, comments: { select: { id: true } } } });
      const postIds = posts.map(({ id }) => id);
      const commentIds = posts.flatMap(({ comments }) => comments.map(({ id }) => id));
      await prisma.$transaction([
        prisma.notifications.deleteMany({ where: { OR: [{ userId }, { postId: { in: postIds } }] } }),
        prisma.like.deleteMany({ where: { OR: [{ userId }, { postId: { in: postIds } }, { commentId: { in: commentIds } }] } }),
        prisma.comment.deleteMany({ where: { OR: [{ userId }, { postId: { in: postIds } }] } }),
        prisma.post.deleteMany({ where: { userId } }),
        prisma.story.deleteMany({ where: { userId } }),
        prisma.followRequest.deleteMany({ where: { OR: [{ senderId: userId }, { recieverId: userId }] } }),
        prisma.follower.deleteMany({ where: { OR: [{ followerId: userId }, { followingId: userId }] } }),
        prisma.block.deleteMany({ where: { OR: [{ blockerId: userId }, { blockedId: userId }] } }),
        prisma.user.deleteMany({ where: { id: userId } }),
      ]);
    }
    return new Response("Webhook processed", { status: 200 });
  } catch {
    return new Response("Invalid webhook", { status: 400 });
  }
}
