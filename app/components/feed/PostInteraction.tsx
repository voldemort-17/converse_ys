"use client";

import { switchLike } from "@/lib/actions";
import { Bookmark, Heart, MessageSquare, Send } from "lucide-react";
import { useOptimistic, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

type LikeState = { count: number; liked: boolean };

function LikeButton({ state }: { state: LikeState }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="icon-action gap-2 px-2"
      aria-label={state.liked ? "Unlike post" : "Like post"}
      disabled={pending}
    >
      <Heart
        size={20}
        className={state.liked ? "text-rose-500" : ""}
        fill={state.liked ? "currentColor" : "none"}
      />
      <span>{state.count}</span>
      <span className="hidden sm:inline">Likes</span>
    </button>
  );
}

export default function PostInteraction({ postId, isLiked, likeCount, commentCount }: { postId: string; isLiked: boolean; likeCount: number; commentCount: number }) {
  const [error, setError] = useState("");
  const submittingLike = useRef(false);
  const [optimistic, updateOptimistic] = useOptimistic(
    { count: likeCount, liked: isLiked },
    (current) => ({
      count: current.liked ? current.count - 1 : current.count + 1,
      liked: !current.liked,
    }),
  );

  async function likeAction() {
    if (submittingLike.current) return;
    submittingLike.current = true;
    updateOptimistic(null);
    setError("");
    try {
      await switchLike(postId);
    } catch {
      setError("Could not update your like. Please try again.");
    } finally {
      submittingLike.current = false;
    }
  }

  return (
    <div className="border-y border-[var(--border)] py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2">
          <form action={likeAction}>
            <LikeButton state={optimistic} />
          </form>
          <a href={`#comments-${postId}`} className="icon-action gap-2 px-2" aria-label={`${commentCount} comments`}>
            <MessageSquare size={20} /><span>{commentCount}</span><span className="hidden sm:inline">Comments</span>
          </a>
          <button type="button" className="icon-action" aria-label="Share post" title="Share coming soon" disabled><Send size={20} /></button>
        </div>
        <button type="button" className="icon-action" aria-label="Save post" title="Save coming soon" disabled><Bookmark size={20} /></button>
      </div>
      {error && <p className="px-2 pt-2 text-xs text-rose-400" role="status">{error}</p>}
    </div>
  );
}
