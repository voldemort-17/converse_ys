"use client"

import { updateUserData } from "@/lib/actions";
import { User } from "@prisma/client"
import { error } from "console";
import { X } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react"
import { success } from "zod";
import UpdateButton from "./UpdateButton";

const UpdateUser = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState<any>(false);
  const [state, formAction] = useActionState(updateUserData, {success: false, error: false});

  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    state.success && router.refresh();
  }

  return (
    <>
      <span className="text-sm text-blue-500 cursor-pointer" onClick={() => setOpen(true)}>Update</span>
      {open && <div className="absolute w-screen h-screen top-0 left-0 flex items-center justify-center z-50 bg-black/65">
        <form action={(formData) =>formAction({formdata: formData, cover: cover?.secure_url || ''})} className="flex flex-col rounded-lg gap-2 px-12 py-8 shadow-md w-full lg:w-1/2 xl:w-1/3 bg-[#121212] opacity-100 relative">
          <div className="flex justify-between">
            <h1 className="text-lg font-bold">Update Profile</h1>
            <div className="cursor-pointer font-bold" onClick={handleClose}><X size={18} /></div>
          </div>
          <div className="text-sx text-[#aaa] mt-4">Use the Navbar profile to change Avatar or username.</div>
          <CldUploadWidget uploadPreset="converse" onSuccess={(res) => setCover(res.info)}>
            {({ open }) => {
              return (
                <div className="my-4 flex flex-col gap-4" onClick={()=> open()}>
                  <label htmlFor="" className="font-semibold">Cover Picture</label>
                  <div className="flex gap-3 cursor-pointer items-center">
                    <Image src={user.cover || "/CoverImage.jpg"} width={48} height={32} alt="Cover Image" className="w-12 h-8 rounded-md object-cover"></Image>
                    <span className="text-xs underline text-[#aaa]">Change</span>
                  </div>
                </div>
              );
            }}
          </CldUploadWidget>
          <div className="flex flex-wrap gap-2 xl:gap-4 justify-between text-[#aaa]">
            <div className="flex flex-col gap-4">
              <label htmlFor="" className="text-xs">First Name</label>
              <input type="text" name="name" placeholder={user.name || "John"} className="p-3 outline-none border-b border-[#aaa] text-sm" />
            </div>
            <div className="flex flex-col gap-4">
              <label htmlFor="" className="text-xs">Last Name</label>
              <input type="text" name="surname" placeholder={user.surname || "Wokes"} className="p-3 outline-none border-b border-[#aaa] text-sm" />
            </div>
            <div className="flex flex-col gap-4">
              <label htmlFor="" className="text-xs">Description</label>
              <input type="text" name="description" placeholder={user.description || "Time is moving forward..."} className="p-3 outline-none border-b border-[#aaa] text-sm" />
            </div>
            <div className="flex flex-col gap-4">
              <label htmlFor="" className="text-xs">City</label>
              <input type="text" name="city" placeholder={user.city || "Finland"} className="p-3 outline-none border-b border-[#aaa] text-sm" />
            </div>
            <div className="flex flex-col gap-4">
              <label htmlFor="" className="text-xs">School</label>
              <input type="text" name="school" placeholder={user.school || "St. Cambrdidge"} className="p-3 outline-none border-b border-[#aaa] text-sm" />
            </div>
            <div className="flex flex-col gap-4">
              <label htmlFor="" className="text-xs">Work</label>
              <input type="text" name="work" placeholder={user.work || "Apple.inc"} className="p-3 outline-none border-b border-[#aaa] text-sm" />
            </div>
            <div className="flex flex-col gap-4">
              <label htmlFor="" className="text-xs">Website</label>
              <input type="text" name="website" placeholder={user.website || "https://www.google.com"} className="p-3 outline-none border-b border-[#aaa] text-sm" />
            </div>
          </div>
          <UpdateButton/>
          {state.success && <span className="text-green-500 text-sm text-center">Profile has been updated Successfully! </span>}
          {state.error && <span className="text-red-500 text-sm text-center">Something went Wrong!</span>}
        </form>
      </div>}
    </>
  )
}

export default UpdateUser