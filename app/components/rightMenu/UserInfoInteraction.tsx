"use client"

import { switchFollow, switchBlock } from "@/lib/actions"
import { Ban } from "lucide-react"
import { useOptimistic, useState } from "react"

const UserInfoInteraction = ({ userId, currentUserId, isUserBlocked, isFollowing, isFollowReqSent }: { userId: string, currentUserId: string, isUserBlocked: boolean, isFollowing: boolean, isFollowReqSent: boolean }) => {

    const [userState, setUserState] = useState({
        blocked: isUserBlocked,
        following: isFollowing,
        followReqSent: isFollowReqSent
    })

    const follow = async () => {
        switchOptimisticState("follow");
        try {
            await switchFollow(userId);
            setUserState((prev) => ({ ...prev, following: prev.following && false, followReqSent: !prev.following && !prev.followReqSent ? true : false }))
        } catch (error) {
            console.log('error', error)
        }
    };

    const [optimisticState, switchOptimisticState] = useOptimistic(userState, (state, value: "follow" | "block") => value === 'follow' ? ({
        ...state,
        following: state.following && false, followReqSent: !state.following && !state.followReqSent ? true : false
    }) : ({
        ...state,
        blocked: !state.blocked
    }));

    const blockUser = async () => {
        switchOptimisticState("block");
        try {
            await switchBlock(userId);
            setUserState((prev) => ({ ...prev, blocked: !prev.blocked }))
        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <form action={follow}>
                <button className="p-2 w-full rounded-lg bg-blue-500 cursor-pointer text-sm font-bold">{optimisticState.following ? "Following" : optimisticState.followReqSent ? "Follow Request Sent" : "Follow"}</button>
            </form>
            <form action={blockUser} className="self-end">
                <button>
                    <div className="text-sm flex w-full items-center gap-2 cursor-pointer text-red-500">{optimisticState.blocked ? "Unblock User" : "Block User"}</div>
                </button>
            </form>
        </div>
    )
}

export default UserInfoInteraction