import { prisma } from "@/lib/client"
import { Ellipsis, Heart, SmilePlus } from "lucide-react"
import Image from "next/image"
import CommentList from "./CommentList"

const Comments = async ({ postId, postCreatorId }: { postId: string, postCreatorId: string }) => {

    const comments = await prisma.comment.findMany({
        where: {
            postId: postId
        },
        include: {
            user: true
        }
    })

    return (
        <>
            <div className="flex flex-col gap-4">
                <CommentList comments={comments} postId={postId} postCreatorId={postCreatorId}/>
            </div>
        </>
    )
}

export default Comments
