"use client"

import { addComment } from "@/lib/actions"
import { useUser } from "@clerk/nextjs"
import { Comment, User } from "@prisma/client"
import { Ellipsis, Heart, SendHorizonalIcon, SmilePlus, Trash } from "lucide-react"
import Image from "next/image"
import { useOptimistic, useState } from "react"

type CommentType = Comment & { user: User }

const CommentList = ({ comments, postId, postCreatorId }: { comments: CommentType[], postId: string, postCreatorId: string }) => {
    const { user } = useUser();
    const [desc, setDesc] = useState("");
    const [commentState, setCommentState] = useState(comments);

    const add = async () => {
        if(!user || !desc) return;
        setOptimisticComment({
            id: Math.random().toString(),
            desc,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
            userId: user.id,
            postId: Math.random().toString(),
            user: {
                id: user.id,
                avatar: user.imageUrl || '/AvatarImage.jpg',
                username: user.username as string,
                name: '' as string,
                surname: '' as string,
                work: '' as string,
                city: '' as string,
                website: '' as string,
                school: '' as string,
                createdAt: new Date(Date.now()),
                cover: "",
                description: ''
            }
        });
        try {
            const createdComment = await addComment(postId, desc, user?.username || "", postCreatorId);
            setCommentState((prev) => [createdComment, ...prev]);
            setDesc("");
        } catch (error) {
            
        }
    }

    const [optimisticComment, setOptimisticComment] = useOptimistic(commentState, (state, value: CommentType) => [value, ...state])

    return (
        <>
            {user && <div className="flex gap-4 items-center">
                <form action={add} className="flex flex-1 gap-2 items-center">
                    <Image src={user?.imageUrl || '/AvatarImage.jpg'} alt='Avatar' height={32} width={32} className="cursor-pointer rounded-[50%] w-8 h-8 object-cover" />
                    <div className="flex flex-1 bg-[#222] items-center p-2 rounded-lg gap-3">
                        {/* TEXT Data  */}
                        <input name="" value={desc} id="" className="flex-1 p-1 rounded-md bg-transparent font-medium outline-none" placeholder="Write a comment..." onChange={(e) => setDesc(e.target.value)}></input>
                        <SmilePlus className="cursor-pointer text-[#aaa]" />
                        <button><SendHorizonalIcon className="cursor-pointer text-[#aaa]" /></button>
                    </div>
                </form>
            </div>}
            {optimisticComment.map((comment) => (
                <div className="flex gap-4 items-start" key={comment.id}>
                    <Image src={comment.user.avatar || '/AvatarImage.jpg'} alt='Avatar' height={40} width={40} className="cursor-pointer rounded-[50%] w-10 h-10 object-cover" />
                    <div className="flex gap-2 flex-1 flex-col items-start rounded-lg">
                        {/* TEXT Data  */}
                        <div className="flex w-full items-center justify-between">
                            <div className="flex font-medium flex-1">{(comment.user.name && comment.user.surname) ? comment.user.name + " " + comment.user.surname : comment.user?.username}</div>
                            <Trash className="cursor-pointer" size={16}/>
                        </div>
                        <div>{comment.desc}</div>
                        <div className="flex gap-4 my-2 items-center text-sm">
                            <div className="flex gap-1 items-center"><Heart className="cursor-pointer" size={14} />1 <span className="hidden md:inline">Likes</span></div>
                            <div className="text-[#aaa]">|</div>
                            <div className="cursor-pointer">Reply</div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default CommentList