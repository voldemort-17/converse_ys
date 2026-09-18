import type { User } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { Briefcase, Calendar, GraduationCap, MapPin, Paperclip } from "lucide-react";
import { prisma } from "@/lib/client";
import UserInfoInteraction from "./UserInfoInteraction";
import UpdateUser from "./UpdateUser";

function safeWebsite(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch { return null; }
}

export default async function UserInfo({ user }: { user: User }) {
  const { userId } = await auth();
  const [block, following, request] = userId ? await Promise.all([
    prisma.block.findUnique({ where: { blockerId_blockedId: { blockerId: userId, blockedId: user.id } }, select: { id: true } }),
    prisma.follower.findUnique({ where: { followerId_followingId: { followerId: userId, followingId: user.id } }, select: { id: true } }),
    prisma.followRequest.findUnique({ where: { senderId_recieverId: { senderId: userId, recieverId: user.id } }, select: { id: true } }),
  ]) : [null, null, null];
  const website = safeWebsite(user.website);
  const displayName = user.name && user.surname ? `${user.name} ${user.surname}` : user.username;
  const joined = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(user.createdAt);

  return (
    <section className="surface flex flex-col gap-4 p-5">
      <header className="flex items-center justify-between"><h2 className="text-sm font-semibold text-[var(--muted)]">About</h2>{userId === user.id && <UpdateUser user={user} />}</header>
      <div><p className="font-bold text-white">{displayName}</p><p className="text-sm text-[var(--muted)]">@{user.username}</p></div>
      {user.description && <p className="text-sm leading-6 text-[var(--text)]">{user.description}</p>}
      <dl className="space-y-3 text-sm text-[var(--muted)]">
        {user.city && <div className="flex gap-2"><MapPin size={17} className="shrink-0" /><span>Lives in <strong className="text-[var(--text)]">{user.city}</strong></span></div>}
        {user.school && <div className="flex gap-2"><GraduationCap size={17} className="shrink-0" /><span>Studied at <strong className="text-[var(--text)]">{user.school}</strong></span></div>}
        {user.work && <div className="flex gap-2"><Briefcase size={17} className="shrink-0" /><span>Works at <strong className="text-[var(--text)]">{user.work}</strong></span></div>}
        <div className="flex gap-2"><Calendar size={17} className="shrink-0" /><span>Joined {joined}</span></div>
        {website && <div className="flex min-w-0 gap-2"><Paperclip size={17} className="shrink-0" /><a href={website} target="_blank" rel="noreferrer" className="truncate text-[var(--brand)] hover:underline">{user.website}</a></div>}
      </dl>
      {userId && userId !== user.id && <UserInfoInteraction userId={user.id} isUserBlocked={Boolean(block)} isFollowReqSent={Boolean(request)} isFollowing={Boolean(following)} />}
    </section>
  );
}
