"use client";

import { switchBlock, switchFollow } from "@/lib/actions";
import { Ban } from "lucide-react";
import { useOptimistic, useState } from "react";

type UserState = { blocked: boolean; following: boolean; requestSent: boolean };

export default function UserInfoInteraction({ userId, isUserBlocked, isFollowing, isFollowReqSent }: { userId: string; isUserBlocked: boolean; isFollowing: boolean; isFollowReqSent: boolean }) {
  const [state, setState] = useState<UserState>({ blocked: isUserBlocked, following: isFollowing, requestSent: isFollowReqSent });
  const [error, setError] = useState("");
  const [optimistic, updateOptimistic] = useOptimistic(state, (current, action: "follow" | "block") => action === "block"
    ? { ...current, blocked: !current.blocked, following: false, requestSent: false }
    : { ...current, following: current.following ? false : current.following, requestSent: current.following ? false : !current.requestSent });

  async function follow() {
    updateOptimistic("follow"); setError("");
    try {
      await switchFollow(userId);
      setState((current) => ({ ...current, following: current.following ? false : current.following, requestSent: current.following ? false : !current.requestSent }));
    } catch { setError("Could not update this follow request."); }
  }
  async function block() {
    updateOptimistic("block"); setError("");
    try {
      await switchBlock(userId);
      setState((current) => ({ blocked: !current.blocked, following: false, requestSent: false }));
    } catch { setError("Could not update this block."); }
  }

  return (
    <div className="space-y-3 border-t border-[var(--border)] pt-4">
      <form action={follow}><button className="primary-button w-full" disabled={optimistic.blocked}>{optimistic.following ? "Unfollow" : optimistic.requestSent ? "Cancel request" : "Follow"}</button></form>
      <form action={block}><button className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold text-rose-400 hover:bg-rose-500/10"><Ban size={16} />{optimistic.blocked ? "Unblock" : "Block"}</button></form>
      {error && <p className="text-xs text-rose-400" role="status">{error}</p>}
    </div>
  );
}
