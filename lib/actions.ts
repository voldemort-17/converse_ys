"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "./client";

const text = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional();
const cloudinaryUrl = z.string().url().refine((value) => {
  try {
    const url = new URL(value);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    return url.hostname === "res.cloudinary.com" && Boolean(cloudName) && url.pathname.startsWith(`/${cloudName}/`);
  } catch {
    return false;
  }
}, "Invalid media URL");

async function requireUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("You must be signed in to continue.");
  return userId;
}

async function usersAreBlocked(firstUserId: string, secondUserId: string) {
  return prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: firstUserId, blockedId: secondUserId },
        { blockerId: secondUserId, blockedId: firstUserId },
      ],
    },
    select: { id: true },
  });
}

export async function switchFollow(targetUserId: string) {
  const currentUserId = await requireUserId();
  if (currentUserId === targetUserId) throw new Error("You cannot follow yourself.");
  if (await usersAreBlocked(currentUserId, targetUserId)) throw new Error("This profile is not available.");

  const existingFollow = await prisma.follower.findUnique({
    where: { followerId_followingId: { followerId: currentUserId, followingId: targetUserId } },
  });

  if (existingFollow) {
    await prisma.follower.delete({ where: { id: existingFollow.id } });
  } else {
    const existingRequest = await prisma.followRequest.findUnique({
      where: { senderId_recieverId: { senderId: currentUserId, recieverId: targetUserId } },
    });
    if (existingRequest) {
      await prisma.followRequest.delete({ where: { id: existingRequest.id } });
    } else {
      await prisma.followRequest.create({ data: { senderId: currentUserId, recieverId: targetUserId } });
    }
  }
  revalidatePath("/", "layout");
}

export async function switchBlock(targetUserId: string) {
  const currentUserId = await requireUserId();
  if (currentUserId === targetUserId) throw new Error("You cannot block yourself.");

  const existingBlock = await prisma.block.findUnique({
    where: { blockerId_blockedId: { blockerId: currentUserId, blockedId: targetUserId } },
  });
  if (existingBlock) {
    await prisma.block.delete({ where: { id: existingBlock.id } });
  } else {
    await prisma.$transaction([
      prisma.block.create({ data: { blockerId: currentUserId, blockedId: targetUserId } }),
      prisma.follower.deleteMany({
        where: {
          OR: [
            { followerId: currentUserId, followingId: targetUserId },
            { followerId: targetUserId, followingId: currentUserId },
          ],
        },
      }),
      prisma.followRequest.deleteMany({
        where: {
          OR: [
            { senderId: currentUserId, recieverId: targetUserId },
            { senderId: targetUserId, recieverId: currentUserId },
          ],
        },
      }),
    ]);
  }
  revalidatePath("/", "layout");
}

export async function acceptReq(senderId: string) {
  const currentUserId = await requireUserId();
  if (await usersAreBlocked(currentUserId, senderId)) throw new Error("This request is no longer available.");

  const request = await prisma.followRequest.findUnique({
    where: { senderId_recieverId: { senderId, recieverId: currentUserId } },
  });
  if (!request) return;

  await prisma.$transaction([
    prisma.followRequest.delete({ where: { id: request.id } }),
    prisma.follower.upsert({
      where: { followerId_followingId: { followerId: senderId, followingId: currentUserId } },
      create: { followerId: senderId, followingId: currentUserId },
      update: {},
    }),
  ]);
  revalidatePath("/", "layout");
}

export async function rejectReq(senderId: string) {
  const currentUserId = await requireUserId();
  await prisma.followRequest.deleteMany({ where: { senderId, recieverId: currentUserId } });
  revalidatePath("/", "layout");
}

type ProfileState = { success: boolean; error: boolean; message?: string };

export async function updateUserData(
  _previousState: ProfileState,
  payload: { formdata: FormData; cover: string },
): Promise<ProfileState> {
  const currentUserId = await requireUserId();
  const fields = Object.fromEntries(payload.formdata);
  const filteredFields = Object.fromEntries(
    Object.entries(fields).filter(([, value]) => typeof value === "string" && value.trim() !== ""),
  );
  const profileSchema = z.object({
    cover: cloudinaryUrl.optional(),
    name: optionalText(60),
    surname: optionalText(60),
    description: optionalText(255),
    city: optionalText(60),
    work: optionalText(60),
    website: z.string().trim().url().max(200).optional(),
    school: optionalText(60),
  });
  const parsed = profileSchema.safeParse({ ...(payload.cover ? { cover: payload.cover } : {}), ...filteredFields });
  if (!parsed.success) {
    return { success: false, error: true, message: "Please check the information and try again." };
  }

  try {
    await prisma.user.update({ where: { id: currentUserId }, data: parsed.data });
    revalidatePath("/", "layout");
    return { success: true, error: false, message: "Profile updated." };
  } catch {
    return { success: false, error: true, message: "We could not update your profile." };
  }
}

export async function switchLike(postId: string) {
  const userId = await requireUserId();
  const [post, actor] = await Promise.all([
    prisma.post.findUnique({ where: { id: postId }, select: { userId: true } }),
    prisma.user.findUnique({ where: { id: userId }, select: { username: true, name: true } }),
  ]);
  if (!post) throw new Error("Post not found.");
  if (await usersAreBlocked(userId, post.userId)) throw new Error("Post not available.");

  const existingLike = await prisma.like.findFirst({ where: { postId, userId } });
  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } });
  } else {
    await prisma.like.create({ data: { userId, postId } });
    if (post.userId !== userId) {
      await prisma.notifications.create({
        data: {
          userId: post.userId,
          postId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          desc: `${actor?.name || actor?.username || "Someone"} liked your post.`,
        },
      });
    }
  }
  revalidatePath("/", "layout");
}

export async function addComment(postId: string, rawDescription: string) {
  const userId = await requireUserId();
  const description = text(500).parse(rawDescription);
  const [post, actor] = await Promise.all([
    prisma.post.findUnique({ where: { id: postId }, select: { userId: true } }),
    prisma.user.findUnique({ where: { id: userId }, select: { username: true, name: true } }),
  ]);
  if (!post) throw new Error("Post not found.");
  if (await usersAreBlocked(userId, post.userId)) throw new Error("Post not available.");

  const createdComment = await prisma.comment.create({
    data: { postId, desc: description, userId },
    include: { user: true },
  });
  if (post.userId !== userId) {
    await prisma.notifications.create({
      data: {
        userId: post.userId,
        postId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        desc: `${actor?.name || actor?.username || "Someone"} commented on your post.`,
      },
    });
  }
  revalidatePath("/", "layout");
  return createdComment;
}

export async function deleteComment(commentId: string) {
  const userId = await requireUserId();
  const comment = await prisma.comment.findFirst({
    where: { id: commentId, userId },
    select: { id: true, postId: true },
  });
  if (!comment) throw new Error("Comment not found or you do not have permission to delete it.");

  await prisma.$transaction([
    prisma.like.deleteMany({ where: { commentId } }),
    prisma.comment.delete({ where: { id: commentId } }),
  ]);
  revalidatePath("/", "layout");
}

export async function addPost(formdata: FormData, image: string) {
  const userId = await requireUserId();
  const description = text(500).parse(formdata.get("desc"));
  const parsedImage = image ? cloudinaryUrl.parse(image) : null;
  await prisma.post.create({ data: { desc: description, userId, image: parsedImage } });
  revalidatePath("/", "layout");
}

export async function addStory(image: string) {
  const userId = await requireUserId();
  const parsedImage = cloudinaryUrl.parse(image);
  const existingStory = await prisma.story.findUnique({ where: { userId } });
  if (existingStory) {
    return prisma.story.update({
      where: { id: existingStory.id },
      data: { img: parsedImage, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
      include: { user: true },
    });
  }
  return prisma.story.create({
    data: { img: parsedImage, userId, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    include: { user: true },
  });
}

export async function deletePost(postId: string) {
  const userId = await requireUserId();
  const post = await prisma.post.findFirst({
    where: { id: postId, userId },
    select: { comments: { select: { id: true } } },
  });
  if (!post) throw new Error("Post not found or you do not have permission to delete it.");

  const commentIds = post.comments.map(({ id }) => id);
  await prisma.$transaction([
    prisma.notifications.deleteMany({ where: { postId } }),
    prisma.like.deleteMany({ where: { OR: [{ postId }, { commentId: { in: commentIds } }] } }),
    prisma.comment.deleteMany({ where: { postId } }),
    prisma.post.delete({ where: { id: postId } }),
  ]);
  revalidatePath("/", "layout");
}

export async function markNotificationsAsRead() {
  const userId = await requireUserId();
  await prisma.notifications.updateMany({
    where: { userId, isRead: false, expiresAt: { gt: new Date() } },
    data: { isRead: true },
  });
  revalidatePath("/notifications");
}
