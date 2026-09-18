import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import Feed from "@/app/components/feed/Feed";
import LeftMenu from "@/app/components/leftMenu/LeftMenu";
import RightMenu from "@/app/components/rightMenu/RightMenu";
import { prisma } from "@/lib/client";

type PageProps = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username}` };
}

export default async function ProfilePage({ params }: PageProps) {
  const [{ username }, { userId }] = await Promise.all([params, auth()]);
  if (!userId) notFound();

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: { select: { followerRelations: true, posts: true, followingRelations: true } },
    },
  });
  if (!user) notFound();

  const blocked = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: userId, blockedId: user.id },
        { blockerId: user.id, blockedId: userId },
      ],
    },
    select: { id: true },
  });
  if (blocked) notFound();

  const displayName = user.name && user.surname ? `${user.name} ${user.surname}` : user.username;

  return (
    <div className="grid grid-cols-1 gap-5 pt-5 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[240px_minmax(0,680px)_300px] xl:justify-center">
      <aside className="hidden xl:block"><div className="sticky top-21"><LeftMenu type="profile" /></div></aside>
      <div className="min-w-0 space-y-5">
        <section className="surface overflow-hidden">
          <div className="relative h-48 sm:h-64">
            <Image src={user.cover || "/CoverImage.jpg"} fill priority sizes="(max-width: 1024px) 100vw, 680px" alt="" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />
            <Image src={user.avatar || "/AvatarImage.jpg"} width={128} height={128} alt={`${displayName}'s profile picture`} className="absolute -bottom-14 left-5 h-28 w-28 rounded-full object-cover ring-4 ring-[var(--surface)] sm:left-8 sm:h-32 sm:w-32" />
          </div>
          <div className="px-5 pb-6 pt-18 sm:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-white">{displayName}</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">@{user.username}</p>
            <dl className="mt-5 flex gap-8 border-t border-[var(--border)] pt-4">
              <div><dt className="text-xs text-[var(--muted)]">Posts</dt><dd className="mt-1 font-bold">{user._count.posts}</dd></div>
              <div><dt className="text-xs text-[var(--muted)]">Followers</dt><dd className="mt-1 font-bold">{user._count.followerRelations}</dd></div>
              <div><dt className="text-xs text-[var(--muted)]">Following</dt><dd className="mt-1 font-bold">{user._count.followingRelations}</dd></div>
            </dl>
          </div>
        </section>
        <Feed username={user.username} />
      </div>
      <aside className="hidden lg:block"><div className="sticky top-21"><RightMenu user={user} /></div></aside>
    </div>
  );
}
