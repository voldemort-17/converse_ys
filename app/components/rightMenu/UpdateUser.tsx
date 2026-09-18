"use client";

import { updateUserData } from "@/lib/actions";
import type { User } from "@prisma/client";
import type { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { CldUploadWidget } from "next-cloudinary";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import UpdateButton from "./UpdateButton";

const fields = [
  ["name", "First name", "Jane"], ["surname", "Last name", "Doe"],
  ["city", "City", "Helsinki"], ["school", "School", "University"],
  ["work", "Work", "Company"], ["website", "Website", "https://example.com"],
] as const;

export default function UpdateUser({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState<CloudinaryUploadWidgetInfo | null>(null);
  const [state, formAction] = useActionState(updateUserData, { success: false, error: false });

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", close); };
  }, [open]);

  return (
    <>
      <button className="text-sm font-semibold text-[var(--brand)] hover:underline" onClick={() => setOpen(true)}>Edit profile</button>
      {open && (
        <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-black/75 p-3 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
          <button type="button" className="absolute inset-0" onClick={() => setOpen(false)} aria-label="Close profile editor" />
          <form action={(formData) => formAction({ formdata: formData, cover: cover?.secure_url || "" })} className="surface relative z-10 my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto p-5 sm:p-7">
            <div className="flex items-center justify-between"><div><h2 id="edit-profile-title" className="text-xl font-bold">Edit profile</h2><p className="mt-1 text-sm text-[var(--muted)]">Keep your profile useful and easy to recognize.</p></div><button type="button" className="icon-action" onClick={() => setOpen(false)} aria-label="Close"><X /></button></div>
            <CldUploadWidget uploadPreset="converse" options={{ maxFiles: 1, resourceType: "image", clientAllowedFormats: ["jpg", "jpeg", "png", "webp"], maxFileSize: 8_000_000 }} onSuccess={(result) => { if (result.info && typeof result.info !== "string") setCover(result.info); }}>
              {({ open: openUploader }) => <button type="button" onClick={() => openUploader()} className="relative mt-6 block h-32 w-full overflow-hidden rounded-2xl"><Image src={cover?.secure_url || user.cover || "/CoverImage.jpg"} fill sizes="640px" alt="Cover preview" className="object-cover" /><span className="absolute inset-0 grid place-items-center bg-black/35 font-semibold"><span className="flex items-center gap-2 rounded-xl bg-black/55 px-4 py-2"><Camera size={18} /> Change cover</span></span></button>}
            </CldUploadWidget>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {fields.map(([name, label, placeholder]) => <label key={name} className="text-sm font-medium"><span>{label}</span><input name={name} defaultValue={user[name] || ""} placeholder={placeholder} maxLength={name === "website" ? 200 : 60} className="input-shell mt-2 w-full outline-none" /></label>)}
              <label className="text-sm font-medium sm:col-span-2"><span>Bio</span><textarea name="description" defaultValue={user.description || ""} maxLength={255} rows={3} className="input-shell mt-2 w-full resize-none outline-none" placeholder="Tell people a little about yourself" /></label>
            </div>
            {(state.error || state.success) && <p className={`mt-4 text-sm ${state.error ? "text-rose-400" : "text-emerald-400"}`} role="status">{state.message}</p>}
            <div className="mt-6 flex justify-end gap-3"><button type="button" className="rounded-xl px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--surface-2)]" onClick={() => setOpen(false)}>Cancel</button><UpdateButton /></div>
          </form>
        </div>
      )}
    </>
  );
}
