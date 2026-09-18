import { prisma } from "@/lib/client";
import { auth } from "@clerk/nextjs/server"
import { UserCheck } from "lucide-react"
import Image from "next/image"
import Link from "next/link";

const LeftProfileCard = async () => {
    const { userId} = await auth();
    if(!userId) return null;
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
            _count: {
                select: {
                    followerRelations:true
                }
            }
        }
    });
    if(!user) return null;

    return (
        <>
            <div className="surface flex flex-col gap-6 p-4">
                <div className="h-20 relative">
                    <Image src={user.cover || '/CoverImage.jpg'} width={208} height={80} sizes="208px" alt="" className="h-20 w-full rounded-xl object-cover" />
                    <Image src={user.avatar || '/AvatarImage.jpg'} width={48} height={48} alt="" className="absolute -bottom-6 left-0 right-0 m-auto h-12 w-12 rounded-full object-cover ring-2 ring-[var(--surface)]" />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="w-full m-auto font-bold text-center">{(user.name && user.surname) ? user.name + " "  + user.surname :user?.username}</div>
                    <div className="flex items-center justify-center gap-2 text-sm font-semibold text-[var(--muted)]"><UserCheck size={16}/>{user._count.followerRelations} Followers</div>
                    <Link href={`/profile/${user.username}`} className="primary-button w-full text-sm">View profile</Link>
                </div>
            </div>
        </>
    )
}

export default LeftProfileCard
