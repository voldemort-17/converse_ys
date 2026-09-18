import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Posts from "@/app/components/feed/Posts";
import { prisma } from "@/lib/client";

export const metadata: Metadata = { title: "Post" };

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, { userId }] = await Promise.all([params, auth()]);
  if (!userId) notFound();
  const post = await prisma.post.findUnique({
    where: { id },
    include: { user: true, likes: { where: { userId }, select: { userId: true } }, comments: { take: 20, orderBy: { createdAt: "desc" }, include: { user: true } }, _count: { select: { comments: true, likes: true } } },
  });
  if (!post) notFound();
  const blocked = await prisma.block.findFirst({ where: { OR: [{ blockerId: userId, blockedId: post.userId }, { blockerId: post.userId, blockedId: userId }] }, select: { id: true } });
  if (blocked) notFound();
  return <div className="mx-auto max-w-[680px] py-7"><Posts post={post} currentUserId={userId} /></div>;
}
