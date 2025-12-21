import Comments from "./Comments"
import Image from "next/image"
import { Post, User } from "@prisma/client"
import PostInteraction from "./PostInteraction"
import { Suspense } from "react"
import PostData from "./PostData"

type PostType = Post & { user: User } & { likes: [{ userId: string }] } & { _count: { comments: number } }

const Posts = ({ post, currentUser }: { post: PostType, currentUser: string }) => {
    console.log('post.likes', post.likes)
    return (
        <>
            <div className="flex flex-col gap-4 p-4 bg-[#121212] rounded-lg text-sm shadow-md">
                <div className="flex justify-between items-center">
                    <div className="flex flex-1 items-center gap-4 font-bold text-white">
                        <Image src={post.user.avatar || '/AvatarImage.jpg'} alt='Avatar' height={40} width={40} className="cursor-pointer rounded-[50%] w-10 h-10 object-cover" />
                        <span className="cursor-pointer">{(post.user.name && post.user.surname) ? post.user.name + " " + post.user.surname : post.user?.username}</span>
                    </div>
                    {currentUser === post.user.id && <PostData postId={post.id}/>}
                </div>
                {post.image && <Image src={post.image} alt='Avatar' height={40} width={40} className="cursor-pointer rounded-lg w-full h-auto object-cover" />}
                {post.desc && <div><span className="font-bold">{post.user.username}</span> {post.desc}</div>}
                <Suspense fallback="loading...">
                    <PostInteraction userId={currentUser} postCreatorId={post.user.id} postId={post.id} commentNumber={post._count.comments} likes={post.likes.map((like: any) => like.userId)} />
                </Suspense>
                <Comments postId={post.id} postCreatorId={post.user.id}/>
            </div>
        </>
    )
}

export default Posts