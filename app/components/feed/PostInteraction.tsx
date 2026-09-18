"use client";

import { switchLike } from "@/lib/actions";
import { Bookmark, Heart, MessageSquare, Send } from "lucide-react";
import { useOptimistic, useState } from "react";

type LikeState = { count: number; liked: boolean };

export default function PostInteraction({ postId, isLiked, likeCount, commentCount }: { postId: string; isLiked: boolean; likeCount: number; commentCount: number }) {
  const [state, setState] = useState<LikeState>({ count: likeCount, liked: isLiked });
  const [error, setError] = useState("");
  const [optimistic, updateOptimistic] = useOptimistic(state, (current) => ({ count: current.liked ? current.count - 1 : current.count + 1, liked: !current.liked }));

  async function likeAction() {
    updateOptimistic(null);
    setError("");
    try {
      await switchLike(postId);
      setState((current) => ({ count: current.liked ? current.count - 1 : current.count + 1, liked: !current.liked }));
    } catch {
      setError("Could not update your like. Please try again.");
    }
  }

  return (
    <div className="border-y border-[var(--border)] py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2">
          <form action={likeAction}>
            <button className="icon-action gap-2 px-2" aria-label={optimistic.liked ? "Unlike post" : "Like post"}>
              <Heart size={20} className={optimistic.liked ? "text-rose-500" : ""} fill={optimistic.liked ? "currentColor" : "none"} />
              <span>{optimistic.count}</span><span className="hidden sm:inline">Likes</span>
            </button>
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
