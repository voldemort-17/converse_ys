import { Bookmark, Ellipsis, Heart, MessageSquare, MessagesSquare, Save, Send } from "lucide-react"
import Image from "next/image"
import Comments from "./Comments"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/client"
import { use } from "react"
import Posts from "./Posts"

const Feed = async ({ username }: { username?: string }) => {

    const { userId } = await auth();
    if (!userId) return null;
    let posts: any[] = [];

    if (username) {
        posts = await prisma.post.findMany({
            where: {
                user: {
                    username: username
                }
            },
            include: {
                user: true,
                likes: {
                    select: {
                        userId: true
                    }
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })
    }

    if (!username && userId) {
        const following = await prisma.follower.findMany({
            where: {
                followingId: userId
            },
            select: {
                followerId: true,
            }
        });

        const followingIds = following.map(f => f.followerId).filter(id => typeof id === "string");
        const ids = [userId, ...followingIds]

        posts = await prisma.post.findMany({
            where: {
                userId: { in: ids }
            },
            include: { user: true, likes: { select: { userId: true } }, _count: { select: { comments: true } } },
            orderBy: { createdAt: "desc" }
        });
    }

    console.log('posts', posts)
    return (
        <div className="flex flex-col gap-4 text-white">
            {posts.length ? (posts.map((post) => (
                <Posts key={post.id} post={post} currentUser={userId} />
            ))) : "No Posts Found!"}
        </div>
    )
}

export default Feed
