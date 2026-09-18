"use client";

import { deletePost } from "@/lib/actions";
import { Ellipsis, Trash2, X } from "lucide-react";
import { useState } from "react";

export default function PostData({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    setError("");
    try { await deletePost(postId); setOpen(false); }
    catch { setError("Could not delete this post."); }
  }

  return (
    <div className="relative">
      <button className="icon-action" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Post options"><Ellipsis /></button>
      {open && <div className="absolute right-0 top-12 z-30 w-56 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 text-sm shadow-2xl">
        <button className="absolute right-1 top-1 icon-action h-7 w-7" onClick={() => setOpen(false)} aria-label="Close post options"><X size={14} /></button>
        {!confirming ? <button onClick={() => setConfirming(true)} className="mt-7 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-rose-400 hover:bg-rose-500/10"><Trash2 size={16} /> Delete post</button> : <div className="p-2"><p className="font-medium">Delete this post?</p><p className="mt-1 text-xs text-[var(--muted)]">This cannot be undone.</p><div className="mt-3 flex gap-2"><button onClick={() => setConfirming(false)} className="rounded-lg px-3 py-2 hover:bg-[var(--surface-2)]">Cancel</button><form action={remove}><button className="rounded-lg bg-rose-500 px-3 py-2 font-semibold text-white">Delete</button></form></div></div>}
        {error && <p className="p-2 text-xs text-rose-400" role="status">{error}</p>}
      </div>}
    </div>
  );
}
