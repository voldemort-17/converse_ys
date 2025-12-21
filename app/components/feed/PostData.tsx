"use client"

import { deletePost } from "@/lib/actions"
import { Ellipsis } from "lucide-react"
import { useState } from "react"

const PostData = ({ postId }: { postId: string }) => {

    const [open, setOpen] = useState(false);
    const deletePostWithId = deletePost.bind(null, postId);

    return (
        <div className="relative">
            <Ellipsis className="cursor-pointer" onClick={() => setOpen(prev => !prev)} />
            {open && (
                <div className="absolute top-4 w-32 right-0 p-4 rounded-lg bg-[#121212] flex flex-col gap-2 items-start text-sm shadow-md z-30">
                    <span className="cursor-pointer hover:bg-[#1e1e1e] p-1 w-full rounded-lg text-center">View Post</span>
                    <span className="cursor-pointer hover:bg-[#1e1e1e] p-1 w-full rounded-lg text-center">Repost</span>
                    <form action={deletePostWithId} className="w-full">
                        <button className="text-red-500 cursor-pointer hover:bg-[#1e1e1e] p-1 w-full rounded-lg">Delete</button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default PostData