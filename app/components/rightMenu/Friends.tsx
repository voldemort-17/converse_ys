import { prisma } from "@/lib/client"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import FriendReqList from "./FriendReqList"

const Friends = async () => {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) return null;

    const friendReqs = await prisma.followRequest.findMany({
        where: {
            recieverId: currentUserId
        },
        include: {
            sender: true
        }
    });

    if (friendReqs.length === 0) return null;
    return (
        <>
            <div className="surface flex flex-col gap-4 p-4">
                <div className="text-sm flex justify-between w-full">
                    <div className="font-medium text-[#aaa] ">Friend Requests</div>
                    <Link href='/notifications' className="font-medium text-[var(--brand)]">See all</Link>
                </div>
                <FriendReqList friendReqs={friendReqs}/>
            </div>
        </>
    )
}

export default Friends
