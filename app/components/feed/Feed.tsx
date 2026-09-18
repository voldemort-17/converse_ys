import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/client";
import Posts from "./Posts";

const PAGE_SIZE = 20;

export default async function Feed({ username }: { username?: string }) {
  const { userId } = await auth();
  if (!userId) return null;

  const blocks = await prisma.block.findMany({
    where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
    select: { blockerId: true, blockedId: true },
  });
  const blockedUserIds = blocks.map((block) =>
    block.blockerId === userId ? block.blockedId : block.blockerId,
  );

  let visibleUserIds: string[] | undefined;
  if (!username) {
    const following = await prisma.follower.findMany({
      where: { followerId: userId, followingId: { notIn: blockedUserIds } },
      select: { followingId: true },
    });
    visibleUserIds = [userId, ...following.map(({ followingId }) => followingId)];
  }

  const posts = await prisma.post.findMany({
    where: username
      ? { user: { username }, userId: { notIn: blockedUserIds } }
      : { userId: { in: visibleUserIds } },
    include: {
      user: true,
      likes: { where: { userId }, select: { userId: true } },
      comments: {
        take: 3,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      },
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: { createdAt: "desc" },
    take: PAGE_SIZE,
  });

  if (!posts.length) {
    return (
      <div className="empty-state">
        <p className="text-base font-semibold text-white">Your feed is ready for new conversations</p>
        <p className="mt-1 text-sm text-[var(--muted)]">Follow people or publish a post to get things moving.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 text-white" aria-label="Post feed">
      {posts.map((post) => <Posts key={post.id} post={post} currentUserId={userId} />)}
      {posts.length === PAGE_SIZE && (
        <p className="py-3 text-center text-sm text-[var(--muted)]">Showing the latest {PAGE_SIZE} posts.</p>
      )}
    </div>
  );
}
