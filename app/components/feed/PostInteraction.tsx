"use client"

import { switchLike } from "@/lib/actions"
import { useAuth, useUser } from "@clerk/clerk-react"
import { User } from "@clerk/nextjs/dist/types/server"
import { Post } from "@prisma/client"
import { Bookmark, Heart, MessageSquare, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { useOptimistic, useState } from "react"

const PostInteraction = ({ postId, likes, commentNumber, userId, postCreatorId }: { postId: string, likes: string[], commentNumber: number, userId: string, postCreatorId: string }) => {
    const [likeState, setLikeState] = useState({
        likeCount: likes.length,
        isLiked: userId ? likes.includes(userId) : false,
    })

    const {user} = useUser();

    console.log('userId for user', userId)
    console.log('isLiked: userId ? likes.includes(userId) : false,', userId ? likes.includes(userId) : false,)
    const [optimisticLike, switchOptimisticLike] = useOptimistic(likeState, (state, value) => {
        return {
            likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
            isLiked: !state.isLiked
        }
    });
    const router = useRouter();

    const likeAction = async () => {
        switchOptimisticLike("");
        try {
            await switchLike(postId, postCreatorId, user?.username || "");
            setLikeState((state) => ({
                likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
                isLiked: !state.isLiked
            }));
        } catch (error) { }
    }

    return (
        <div className="flex justify-between my-3">
            <div className="flex gap-5">
                <form action={likeAction}>
                    <div className="flex gap-2"><button><Heart className={`${optimisticLike.isLiked ? "text-red-500" : ""} cursor-pointer`} fill={optimisticLike.isLiked ? "red" : "transparent"} /></button>{optimisticLike.likeCount}<span className="hidden md:inline">Likes</span></div>
                </form>
                <div className="flex gap-2"><MessageSquare className="cursor-pointer" />{commentNumber} <span className="md:inline hidden">Comments</span></div>
                <Send className="cursor-pointer" />
            </div>
            <Bookmark className="cursor-pointer" />
        </div>
    )
}

export default PostInteraction