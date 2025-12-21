import { prisma } from "@/lib/client"
import { auth } from "@clerk/nextjs/server";
import StoryList from "./StoryList";
import Image from "next/image";

const Stories = async () => {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) return null;

    const stories = await prisma.story.findMany({
        where: {
            expiresAt: {
                gt: new Date()
            },
            OR: [
                {
                    user: {
                        followers: {
                            some: {
                                followerId: currentUserId
                            }
                        }
                    }
                },
                {
                    userId: currentUserId
                }
            ]
        },
        include: {
            user: true
        }
    })

    return (
        <div className="p-4 bg-[#121212] rounded-lg text-sm shadow-md overflow-scroll scroll-smooth scrollbar-hide">
            <div className="flex gap-8 w-max">
                <StoryList userId={currentUserId} stories={stories} />
            </div>
        </div>
    )
}

export default Stories
