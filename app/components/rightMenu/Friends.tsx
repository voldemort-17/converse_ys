import { prisma } from "@/lib/client"
import { auth } from "@clerk/nextjs/server"
import { CircleCheck, CircleX, Cross } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import FriendReqList from "./FriendReqList"

const Friends = async () => {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) return null;

    const friendReqs = await prisma.followRequest.findMany({
        where: {
            recieverId: currentUserId!
        },
        include: {
            sender: true
        }
    });

    if (friendReqs.length === 0) return null;
    return (
        <>
            <div className="flex flex-col gap-4 p-4 bg-[#121212] rounded-lg">
                <div className="text-sm flex justify-between w-full">
                    <div className="font-medium text-[#aaa] ">Friend Requests</div>
                    <Link href='/' className="font-medium text-blue-500 cursor-pointer">See all</Link>
                </div>
                <FriendReqList friendReqs={friendReqs}/>
            </div>
        </>
    )
}

export default Friends
