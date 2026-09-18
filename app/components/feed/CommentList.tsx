"use client";

import { addComment, deleteComment } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import type { Prisma } from "@prisma/client";
import { SendHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useOptimistic, useState } from "react";

type CommentWithUser = Prisma.CommentGetPayload<{ include: { user: true } }>;

export default function CommentList({ comments, postId, totalComments }: { comments: CommentWithUser[]; postId: string; totalComments: number }) {
  const { user } = useUser();
  const [description, setDescription] = useState("");
  const [commentState, setCommentState] = useState(comments);
  const [error, setError] = useState("");
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    commentState,
    (state, value: CommentWithUser) => [value, ...state],
  );

  async function add() {
    const pendingDescription = description.trim();
    if (!user || !pendingDescription) return;
    setError("");
    const pendingComment = {
      id: `pending-${pendingDescription}`,
      desc: pendingDescription,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      userId: user.id,
      postId,
      user: {
        id: user.id,
        avatar: user.imageUrl || "/AvatarImage.jpg",
        username: user.username || "you",
        name: user.firstName,
        surname: user.lastName,
        work: null,
        city: null,
        website: null,
        school: null,
        createdAt: new Date(0),
        cover: null,
        description: null,
      },
    } satisfies CommentWithUser;
    addOptimisticComment(pendingComment);
    setDescription("");
    try {
      const created = await addComment(postId, pendingDescription);
      setCommentState((current) => [created, ...current]);
    } catch {
      setDescription(pendingDescription);
      setError("Your comment was not posted. Please try again.");
    }
  }

  async function remove(commentId: string) {
    setError("");
    try {
      await deleteComment(commentId);
      setCommentState((current) => current.filter(({ id }) => id !== commentId));
    } catch {
      setError("Your comment could not be deleted.");
    }
  }

  return (
    <section id={`comments-${postId}`} className="scroll-mt-24" aria-label="Comments">
      {user && (
        <form action={add} className="flex items-center gap-3">
          <Image src={user.imageUrl || "/AvatarImage.jpg"} alt="" height={34} width={34} className="h-9 w-9 rounded-full object-cover" />
          <label className="input-shell flex flex-1 items-center gap-2">
            <span className="sr-only">Write a comment</span>
            <input
              value={description}
              maxLength={500}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              placeholder="Write a comment…"
              onChange={(event) => setDescription(event.target.value)}
            />
            <button className="icon-action" aria-label="Post comment" disabled={!description.trim()}><SendHorizontal size={18} /></button>
          </label>
        </form>
      )}

      {error && <p className="mt-2 text-xs text-rose-400" role="status">{error}</p>}
      <div className="mt-4 space-y-4">
        {optimisticComments.map((comment) => {
          const displayName = comment.user.name && comment.user.surname
            ? `${comment.user.name} ${comment.user.surname}`
            : comment.user.username;
          return (
            <div className="flex items-start gap-3" key={comment.id}>
              <Link href={`/profile/${comment.user.username}`} aria-label={`View ${displayName}'s profile`}>
                <Image src={comment.user.avatar || "/AvatarImage.jpg"} alt="" height={36} width={36} className="h-9 w-9 rounded-full object-cover" />
              </Link>
              <div className="min-w-0 flex-1 rounded-2xl bg-[var(--surface-2)] px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/profile/${comment.user.username}`} className="truncate text-sm font-semibold hover:text-[var(--brand)]">{displayName}</Link>
                  {user?.id === comment.userId && !comment.id.startsWith("pending-") && (
                    <form action={() => remove(comment.id)}>
                      <button className="icon-action h-7 w-7 text-[var(--muted)] hover:text-rose-400" aria-label="Delete comment"><Trash2 size={14} /></button>
                    </form>
                  )}
                </div>
                <p className="mt-1 break-words text-sm leading-5 text-[var(--text)]">{comment.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      {totalComments > comments.length && (
        <p className="mt-4 text-center text-xs text-[var(--muted)]">Showing the latest {comments.length} of {totalComments} comments</p>
      )}
    </section>
  );
}
