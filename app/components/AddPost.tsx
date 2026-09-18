"use client";

import { addPost } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import type { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import AddPostButton from "./AddPostButton";

export default function AddPost() {
  const { user, isLoaded } = useUser();
  const formRef = useRef<HTMLFormElement>(null);
  const [image, setImage] = useState<CloudinaryUploadWidgetInfo | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  if (!isLoaded) return <div className="surface h-40 animate-pulse" aria-label="Loading post composer" />;

  async function submit(formData: FormData) {
    setError("");
    try {
      await addPost(formData, image?.secure_url || "");
      formRef.current?.reset();
      setDescription("");
      setImage(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your post could not be published.");
    }
  }

  return (
    <section className="surface p-4 sm:p-5" aria-labelledby="composer-title">
      <h2 id="composer-title" className="sr-only">Create a post</h2>
      <form ref={formRef} action={submit} className="flex gap-3 sm:gap-4">
        <Image src={user?.imageUrl || "/AvatarImage.jpg"} alt="" height={44} width={44} className="h-11 w-11 shrink-0 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <label><span className="sr-only">Post content</span><textarea name="desc" rows={3} maxLength={500} required value={description} onChange={(event) => setDescription(event.target.value)} className="input-shell w-full resize-none text-[15px] outline-none" placeholder="What do you want to share?" /></label>
          {image && <div className="relative mt-3 w-fit"><Image src={image.secure_url} width={180} height={120} alt="Selected upload preview" className="h-28 w-40 rounded-xl object-cover" /><button type="button" onClick={() => setImage(null)} className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-black text-white" aria-label="Remove selected image"><X size={15} /></button></div>}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-3">
            <CldUploadWidget uploadPreset="converse" options={{ maxFiles: 1, resourceType: "image", clientAllowedFormats: ["jpg", "jpeg", "png", "webp"], maxFileSize: 8_000_000 }} onSuccess={(result) => { if (result.info && typeof result.info !== "string") setImage(result.info); }}>
              {({ open }) => <button type="button" onClick={() => open()} className="icon-action gap-2 px-3 text-sm"><ImagePlus size={19} className="text-emerald-400" /> Add photo</button>}
            </CldUploadWidget>
            <AddPostButton disabled={!description.trim()} />
          </div>
          {error && <p className="mt-3 text-sm text-rose-400" role="status">{error}</p>}
        </div>
      </form>
    </section>
  );
}
