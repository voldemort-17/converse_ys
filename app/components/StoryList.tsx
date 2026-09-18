"use client";

import { addStory } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import type { Prisma } from "@prisma/client";
import type { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { CldUploadWidget } from "next-cloudinary";
import { CheckCircle2, LoaderCircle, Plus, Send, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type StoryWithUser = Prisma.StoryGetPayload<{ include: { user: true } }>;
type StoryStatus = "idle" | "uploading" | "ready" | "publishing" | "success" | "error";

export default function StoryList({ stories, userId }: { stories: StoryWithUser[]; userId: string }) {
  const { user } = useUser();
  const [storyList, setStoryList] = useState(stories);
  const [upload, setUpload] = useState<CloudinaryUploadWidgetInfo | null>(null);
  const [activeStory, setActiveStory] = useState<StoryWithUser | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<StoryStatus>("idle");
  const publishingStory = useRef(false);

  useEffect(() => {
    if (!activeStory) return;
    const timer = window.setTimeout(() => setActiveStory(null), 5000);
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setActiveStory(null);
    window.addEventListener("keydown", closeOnEscape);
    return () => { window.clearTimeout(timer); window.removeEventListener("keydown", closeOnEscape); };
  }, [activeStory]);

  useEffect(() => {
    if (status !== "success") return;
    const timer = window.setTimeout(() => setStatus("idle"), 3000);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function publish() {
    if (!upload || publishingStory.current) return;
    publishingStory.current = true;
    setError("");
    setStatus("publishing");
    try {
      const story = await addStory(upload.secure_url);
      setStoryList((current) => [story, ...current.filter(({ userId: id }) => id !== userId)]);
      setUpload(null);
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Could not share story. Try again.");
    } finally {
      publishingStory.current = false;
    }
  }

  return (
    <>
      <div className="flex w-20 shrink-0 flex-col items-center gap-2 text-center">
        <CldUploadWidget
          uploadPreset="converse"
          options={{ maxFiles: 1, resourceType: "image", clientAllowedFormats: ["jpg", "jpeg", "png", "webp"], maxFileSize: 8_000_000 }}
          onOpen={() => {
            setError("");
            if (status === "success" || status === "error") setStatus("idle");
          }}
          onUploadAdded={() => setStatus("uploading")}
          onQueuesStart={() => setStatus("uploading")}
          onSuccess={(result) => {
            if (result.info && typeof result.info !== "string") {
              setUpload(result.info);
              setStatus("ready");
            }
          }}
          onError={() => {
            setStatus("error");
            setError("Image upload failed. Try again.");
          }}
        >
          {({ open, isLoading }) => (
            <button
              type="button"
              onClick={() => open()}
              disabled={isLoading || status === "uploading" || status === "publishing"}
              className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-dashed ring-[var(--brand)]"
              aria-label="Choose a story image"
            >
              <Image src={upload?.secure_url || user?.imageUrl || "/AvatarImage.jpg"} fill sizes="64px" alt="" className="object-cover opacity-60" />
              <span className="absolute inset-0 grid place-items-center bg-black/20">
                {status === "uploading" ? <LoaderCircle className="animate-spin" size={25} /> : <Plus size={28} />}
              </span>
            </button>
          )}
        </CldUploadWidget>
        {upload ? (
          <form action={publish}>
            <button
              className="flex items-center gap-1 text-xs font-semibold text-[var(--brand)]"
              disabled={status === "publishing"}
            >
              {status === "publishing" ? <LoaderCircle className="animate-spin" size={13} /> : <Send size={13} />}
              {status === "publishing" ? "Sharing…" : "Share"}
            </button>
          </form>
        ) : (
          <span className="text-xs font-medium">
            {status === "uploading" ? "Uploading…" : status === "success" ? "Shared" : "Add story"}
          </span>
        )}
        <span className="min-h-3 text-[10px]" role="status" aria-live="polite">
          {status === "ready" && <span className="text-emerald-400">Ready to share</span>}
          {status === "success" && <span className="inline-flex items-center gap-1 text-emerald-400"><CheckCircle2 size={11} /> Story shared</span>}
          {status === "error" && <span className="text-rose-400">{error}</span>}
        </span>
      </div>
      {storyList.map((story) => (
        <button key={story.id} type="button" className="flex w-20 shrink-0 flex-col items-center gap-2" onClick={() => setActiveStory(story)} aria-label={`View ${story.user.name || story.user.username}'s story`}>
          <span className="rounded-full bg-gradient-to-br from-sky-300 via-blue-500 to-violet-500 p-[3px]"><span className="block rounded-full bg-[var(--page)] p-[2px]"><Image src={story.user.avatar || "/AvatarImage.jpg"} width={64} height={64} alt="" className="h-16 w-16 rounded-full object-cover" /></span></span>
          <span className="w-full truncate text-xs font-medium">{story.user.name || story.user.username}</span>
        </button>
      ))}
      {activeStory && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/90 p-3" role="dialog" aria-modal="true" aria-label={`${activeStory.user.name || activeStory.user.username}'s story`}>
          <div className="relative h-[min(82vh,760px)] w-full max-w-md overflow-hidden rounded-2xl bg-black" onClick={(event) => event.stopPropagation()}>
            <Image src={activeStory.img} alt="Story" fill sizes="448px" priority className="object-contain" />
            <div className="absolute inset-x-0 top-0 h-1 bg-white/20"><div className="h-full bg-white animate-progress" /></div>
            <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-4 pt-5"><span className="text-sm font-semibold">{activeStory.user.name || activeStory.user.username}</span><button type="button" onClick={() => setActiveStory(null)} className="icon-action bg-black/30 text-white" aria-label="Close story"><X /></button></div>
          </div>
          <button className="absolute inset-0 -z-10" onClick={() => setActiveStory(null)} aria-label="Close story viewer" />
        </div>
      )}
    </>
  );
}
