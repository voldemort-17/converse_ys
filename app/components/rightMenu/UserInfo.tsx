import { prisma } from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import { User } from "@prisma/client"
import { BaggageClaim, Ban, Briefcase, Calendar, GraduationCap, Locate, MapPinned, PaperclipIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation";
import { use } from "react";
import UserInfoInteraction from "./UserInfoInteraction";
import UpdateUser from "./UpdateUser";

const UserInfo = async ({ user }: { user: User }) => {
    const createdDate = new Date(user.createdAt);
    const formattedDate = createdDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    let isUserBlocked = false;
    let isFollowing = false;
    let isFollowReqSent = false;

    const {userId: currentUserId} = await auth();

    if (currentUserId) {
        const blockRes = await prisma.block.findFirst({
            where: {
                blockerId: currentUserId,
                blockedId: user.id
            }
        })

        blockRes ? (isUserBlocked = true) : (isUserBlocked = false);

        const followingRes = await prisma.follower.findFirst({
            where: {
                followerId: currentUserId,
                followingId: user.id
            }
        })

        followingRes ? (isFollowing = true) : (isFollowing = false);

        const followReqRes = await prisma.followRequest.findFirst({
            where: {
                senderId: currentUserId,
                recieverId: user.id
            }
        })

        followReqRes ? (isFollowReqSent = true) : (isFollowReqSent = false);
    } 

    return (
        <>
            <div className="flex flex-col gap-4 p-4 bg-[#121212] rounded-lg">
                <div className="text-sm flex justify-between w-full">
                    <div className="font-medium text-[#aaa] ">User Information</div>
                    {currentUserId === user.id ? <UpdateUser user={user}/> : (<Link href='/' className="font-medium text-blue-500 cursor-pointer">See all</Link>)}
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex flex-1 items-center gap-2 text-lg text-white">
                        <span className="cursor-pointer font-bold">{(user.name && user.surname) ? user.name + " " + user.surname : user?.username}</span>
                        <span className="text-sm text-[#aaa]">@{user.username}</span>
                    </div>
                </div>
                {user.description && <div className="text-sm"><p>{user.description}</p></div>}
                {(user.city || user.school || user.work) && (
                    <div className="text-xs text-[#aaa] flex flex-col gap-3">
                        {user.city && <div className="flex items-center"><MapPinned size={14} className="mr-2" />Living in <span className="font-bold">&nbsp;{user.city}</span></div>}
                        {user.school && <div className="flex items-center"><GraduationCap size={14} className="mr-2" />Studied in <span className="font-bold">&nbsp;{user.school}</span></div>}
                        {user.work && <div className="flex items-center"><Briefcase size={14} className="mr-2" />Works in <span className="font-bold">&nbsp;{user.work}</span></div>}
                    </div>
                )}
                <div className="flex w-full justify-between">
                    {user.website && <Link href={user.website} className="flex gap-2 text-sm items-center"><PaperclipIcon size={14} className="text-[#aaa] cursor-pointer" /><span className="font-bold text-blue-500">{user.website}</span></Link>}
                    <div className="flex gap-2 text-sm items-center text-[#aaa]"><Calendar size={14} />Joined {formattedDate}</div>
                </div>
                {currentUserId && currentUserId !== user.id && <UserInfoInteraction userId={user.id} currentUserId={currentUserId}  isUserBlocked={isUserBlocked} isFollowReqSent={isFollowReqSent} isFollowing={isFollowing}/>}
            </div>
        </>
    )
}

export default UserInfo
