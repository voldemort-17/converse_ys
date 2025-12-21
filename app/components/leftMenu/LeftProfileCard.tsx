import { prisma } from "@/lib/client";
import { auth } from "@clerk/nextjs/server"
import { UserCheck } from "lucide-react"
import Image from "next/image"
import Link from "next/link";

const LeftProfileCard = async () => {
    const { userId} = await auth();
    if(!userId) return null;
    console.log('userId', userId)
    const user = await prisma.user.findFirst({
        where: {
            id: userId
        },
        include: {
            _count: {
                select: {
                    followers:true
                }
            }
        }
    });
    console.log('user', user);
    if(!user) return null;

    return (
        <>
            <div className="flex flex-col gap-6 p-4 bg-[#121212] rounded-lg">
                <div className="h-20 relative">
                    <Image src={user?.cover || '/CoverImage.jpg'} width={80} height={80} alt="Image" className="rounded-lg w-full h-20" />
                    <Image src={user?.avatar || '/AvatarImage.jpg'} width={80} height={80} alt="Image" className="object-cover rounded-full m-auto w-12 h-12 absolute left-0 right-0 -bottom-6 ring-1 ring-white" />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="w-full m-auto font-bold text-center">{(user.name && user.surname) ? user.name + " "  + user.surname :user?.username}</div>
                    <div className="flex gap-2 text-sm font-bold items-center justify-center text-[#aaa]"><UserCheck size={16}/>{user?._count?.followers} Followers</div>
                    <Link href={`/profile/${user.username}`} className="p-2 w-full rounded-lg bg-blue-500 cursor-pointer text-sm font-bold text-center">My Profile</Link>
                </div>
            </div>
        </>
    )
}

export default LeftProfileCard
