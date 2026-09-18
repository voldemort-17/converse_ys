import type { Prisma } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import CommentList from "./CommentList";
import PostData from "./PostData";
import PostInteraction from "./PostInteraction";

export type FeedPost = Prisma.PostGetPayload<{
  include: {
    user: true;
    likes: { select: { userId: true } };
    comments: { include: { user: true } };
    _count: { select: { comments: true; likes: true } };
  };
}>;

export default function Posts({ post, currentUserId }: { post: FeedPost; currentUserId: string }) {
  const displayName = post.user.name && post.user.surname
    ? `${post.user.name} ${post.user.surname}`
    : post.user.username;

  return (
    <article id={`post-${post.id}`} className="surface flex scroll-mt-24 flex-col gap-4 p-4 sm:p-5">
      <header className="flex items-center justify-between gap-3">
        <Link href={`/profile/${post.user.username}`} className="group flex min-w-0 items-center gap-3">
          <Image src={post.user.avatar || "/AvatarImage.jpg"} alt="" height={44} width={44} className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-white/10" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-white group-hover:text-[var(--brand)]">{displayName}</span>
            <span className="block text-xs text-[var(--muted)]">@{post.user.username} · {formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
          </span>
        </Link>
        {currentUserId === post.user.id && <PostData postId={post.id} />}
      </header>

      <p className="whitespace-pre-wrap break-words text-[15px] leading-6 text-[var(--text)]">{post.desc}</p>
      {post.image && (
        <div className="relative aspect-[4/3] max-h-[680px] overflow-hidden rounded-2xl bg-[var(--surface-2)]">
          <Image src={post.image} alt={`Media shared by ${displayName}`} fill sizes="(max-width: 1024px) 100vw, 640px" className="object-contain" />
        </div>
      )}

      <PostInteraction postId={post.id} isLiked={post.likes.length > 0} likeCount={post._count.likes} commentCount={post._count.comments} />
      <CommentList comments={post.comments} postId={post.id} totalComments={post._count.comments} />
    </article>
  );
}
