"use client"

import { acceptReq, rejectReq } from "@/lib/actions"
import { FollowRequest, User } from "@prisma/client"
import { CircleCheck, CircleX } from "lucide-react"
import Image from "next/image"
import { useOptimistic, useState } from "react"

type RequestWithUser = FollowRequest & {
    sender: User
}

const FriendReqList = ({ friendReqs }: { friendReqs: RequestWithUser[] }) => {
    
    const [reqState, setReqState] = useState(friendReqs); 
    const [optimisticReqState, setOptimisticReqState] = useOptimistic(reqState, (state, value: string) => state.filter((req) => req.id !== value));

    const accept = async (requestId: string, userId: string) => {
        await setOptimisticReqState(requestId);
        try {
            await acceptReq(userId);
            setReqState(prev => prev.filter((req) => req.id !== requestId))
        } catch (error) {
            console.log('error', error)
        }
    }

    const reject = async (requestId: string, userId: string) => {
        await setOptimisticReqState(requestId);
        try {
            await rejectReq(userId);
            setReqState(prev => prev.filter((req) => req.id !== requestId))
        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <div>
            {optimisticReqState.map((req) => (
                <div className="flex justify-between items-center" key={req.id}>
                    <div className="flex flex-1 items-center gap-3 text-sm font-bold text-white">
                        <Image src={req.sender.avatar || "/AvatarImage.jpg"} alt='Avatar' height={32} width={32} className="cursor-pointer rounded-[50%] w-8 h-8 object-cover" />
                        <span className="cursor-pointer">{(req.sender.name && req.sender.surname) ? req.sender.name + " " + req.sender.surname : req.sender?.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <form action={() => accept(req.id, req.sender.id)}>
                            <button>
                                <CircleCheck className="cursor-pointer text-blue-500" />
                            </button>
                        </form>
                        <form action={() => reject(req.id, req.sender.id)}>
                            <button>
                                <CircleX className="cursor-pointer text-red-500" />
                            </button>
                        </form>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default FriendReqList