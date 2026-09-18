import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/client";
import StoryList from "./StoryList";

export default async function Stories() {
  const { userId } = await auth();
  if (!userId) return null;

  const [following, blocks] = await Promise.all([
    prisma.follower.findMany({ where: { followerId: userId }, select: { followingId: true }, take: 30 }),
    prisma.block.findMany({ where: { OR: [{ blockerId: userId }, { blockedId: userId }] }, select: { blockerId: true, blockedId: true } }),
  ]);
  const hiddenIds = new Set(blocks.map((block) => block.blockerId === userId ? block.blockedId : block.blockerId));
  const visibleIds = [userId, ...following.map(({ followingId }) => followingId).filter((id) => !hiddenIds.has(id))];
  const stories = await prisma.story.findMany({
    where: { expiresAt: { gt: new Date() }, userId: { in: visibleIds } },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return <section className="surface overflow-hidden p-4" aria-label="Stories"><div className="flex items-center gap-5 overflow-x-auto pb-1 scrollbar-hide"><StoryList userId={userId} stories={stories} /></div></section>;
}
