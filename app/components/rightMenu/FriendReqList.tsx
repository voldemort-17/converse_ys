"use client"

import { acceptReq, rejectReq } from "@/lib/actions"
import { FollowRequest, User } from "@prisma/client"
import { CircleCheck, CircleX } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useOptimistic, useState } from "react"

type RequestWithUser = FollowRequest & {
    sender: User
}

const FriendReqList = ({ friendReqs }: { friendReqs: RequestWithUser[] }) => {
    
    const [reqState, setReqState] = useState(friendReqs); 
    const [error, setError] = useState("");
    const [optimisticReqState, setOptimisticReqState] = useOptimistic(reqState, (state, value: string) => state.filter((req) => req.id !== value));

    const accept = async (requestId: string, userId: string) => {
        setOptimisticReqState(requestId);
        setError("");
        try {
            await acceptReq(userId);
            setReqState(prev => prev.filter((req) => req.id !== requestId))
        } catch {
            setError("Could not accept the request.");
        }
    }

    const reject = async (requestId: string, userId: string) => {
        setOptimisticReqState(requestId);
        setError("");
        try {
            await rejectReq(userId);
            setReqState(prev => prev.filter((req) => req.id !== requestId))
        } catch {
            setError("Could not dismiss the request.");
        }
    }

    return (
        <div className="space-y-3">
            {optimisticReqState.map((req) => (
                <div className="flex justify-between items-center" key={req.id}>
                    <div className="flex flex-1 items-center gap-3 text-sm font-bold text-white">
                        <Image src={req.sender.avatar || "/AvatarImage.jpg"} alt="" height={32} width={32} className="h-8 w-8 rounded-full object-cover" />
                        <Link href={`/profile/${req.sender.username}`} className="truncate hover:text-[var(--brand)]">{(req.sender.name && req.sender.surname) ? req.sender.name + " " + req.sender.surname : req.sender.username}</Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <form action={() => accept(req.id, req.sender.id)}>
                            <button aria-label={`Accept ${req.sender.username}'s follow request`}>
                                <CircleCheck className="cursor-pointer text-blue-500" />
                            </button>
                        </form>
                        <form action={() => reject(req.id, req.sender.id)}>
                            <button aria-label={`Dismiss ${req.sender.username}'s follow request`}>
                                <CircleX className="cursor-pointer text-red-500" />
                            </button>
                        </form>
                    </div>
                </div>
            ))}
            {error && <p className="text-xs text-rose-400" role="status">{error}</p>}
        </div>
    )
}

export default FriendReqList
