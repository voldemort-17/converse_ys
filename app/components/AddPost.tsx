"use client"

import { prisma } from '@/lib/client'
import { useUser } from '@clerk/nextjs';
import { auth, currentUser } from "@clerk/nextjs/server";
import { Calendar1, CameraIcon, LaughIcon, PenSquare, Send, SmilePlus, Video } from "lucide-react"
import { CldUploadWidget } from 'next-cloudinary';
import Image from "next/image"
import { useState } from 'react';
import AddPostButton from './AddPostButton';
import { addPost } from '@/lib/actions';

const AddPost = () => {
    const { user, isLoaded } = useUser();
    const [img, setImg] = useState<any>();
    const [showPicker, setShowPicker] = useState(false);
    if (!isLoaded) return "Loading...";

    console.log('user Data', user)

    return (
        <div className="p-4 bg-[#121212] justify-between flex rounded-lg text-sm gap-4 shadow-md text-[#aaa]">
            {/* IMAGE  */}
            <Image src={user?.imageUrl || '/AvatarImage.jpg'} alt='Avatar' height={48} width={48} className="cursor-pointer rounded-[50%] w-12 h-12 object-cover" />
            <div className="flex flex-col flex-1">
                <form className="flex gap-4 flex-1 items-end" action={(formData) => addPost(formData, (img?.secure_url || ""))}>
                    {/* TEXT Data  */}
                    <textarea name="desc" id="" rows={4} className="bg-[#222] flex-1 p-2 rounded-md font-medium outline-none" placeholder="what's on your mind?"></textarea>
                    <div className='flex flex-col gap-3'>
                    <SmilePlus className="cursor-pointer" />
                    {/* <button className='cursor-pointer'><Send /></button> */}
                    <AddPostButton/>
                    </div>
                </form>
                <div className="flex gap-4 items-center mt-4 flex-wrap">
                    <CldUploadWidget uploadPreset="converse" onSuccess={(res) => setImg(res.info)}>
                        {({ open }) => {
                            return (
                                <div className="flex items-center gap-2 font-bold cursor-pointer" onClick={()=> open()}><CameraIcon />Photo</div>
                            );
                        }}
                    </CldUploadWidget>
                    <div className="flex items-center gap-2 font-bold cursor-pointer"><Video />Video</div>
                    <div className="flex items-center gap-2 font-bold cursor-pointer"><PenSquare />Poll</div>
                    <div className="flex items-center gap-2 font-bold cursor-pointer"><Calendar1 />Event</div>
                </div>
            </div>
        </div>
    )
}

export default AddPost
