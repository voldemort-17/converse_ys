"use client";

import { addStory } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import type { Prisma } from "@prisma/client";
import type { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { CldUploadWidget } from "next-cloudinary";
import { Plus, Send, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type StoryWithUser = Prisma.StoryGetPayload<{ include: { user: true } }>;

export default function StoryList({ stories, userId }: { stories: StoryWithUser[]; userId: string }) {
  const { user } = useUser();
  const [storyList, setStoryList] = useState(stories);
  const [upload, setUpload] = useState<CloudinaryUploadWidgetInfo | null>(null);
  const [activeStory, setActiveStory] = useState<StoryWithUser | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!activeStory) return;
    const timer = window.setTimeout(() => setActiveStory(null), 5000);
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setActiveStory(null);
    window.addEventListener("keydown", closeOnEscape);
    return () => { window.clearTimeout(timer); window.removeEventListener("keydown", closeOnEscape); };
  }, [activeStory]);

  async function publish() {
    if (!upload) return;
    setError("");
    try {
      const story = await addStory(upload.secure_url);
      setStoryList((current) => [story, ...current.filter(({ userId: id }) => id !== userId)]);
      setUpload(null);
    } catch {
      setError("Could not publish story.");
    }
  }

  return (
    <>
      <div className="flex w-20 shrink-0 flex-col items-center gap-2 text-center">
        <CldUploadWidget uploadPreset="converse" options={{ maxFiles: 1, resourceType: "image", clientAllowedFormats: ["jpg", "jpeg", "png", "webp"], maxFileSize: 8_000_000 }} onSuccess={(result) => { if (result.info && typeof result.info !== "string") setUpload(result.info); }}>
          {({ open }) => <button type="button" onClick={() => open()} className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-dashed ring-[var(--brand)]" aria-label="Choose a story image"><Image src={upload?.secure_url || user?.imageUrl || "/AvatarImage.jpg"} fill sizes="64px" alt="" className="object-cover opacity-60" /><span className="absolute inset-0 grid place-items-center"><Plus size={28} /></span></button>}
        </CldUploadWidget>
        {upload ? <form action={publish}><button className="flex items-center gap-1 text-xs font-semibold text-[var(--brand)]"><Send size={13} /> Share</button></form> : <span className="text-xs font-medium">Add story</span>}
        {error && <span className="text-[10px] text-rose-400">Retry</span>}
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
