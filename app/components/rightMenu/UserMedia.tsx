import { prisma } from "@/lib/client"
import { User } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

const UserMedia = async ({ user }: { user: User }) => {
    const postWithMedia = await prisma.post.findMany({
        where: {
            userId: user.id,
            image: {
                not: null
            }
        },
        take: 8,
        orderBy: {
            createdAt: "desc"
        }
    })
    return (
        <>
            <div className="flex flex-col gap-4 p-4 bg-[#121212] rounded-lg">
                <div className="text-sm flex justify-between w-full">
                    <div className="font-medium text-[#aaa] ">User Media</div>
                    <Link href='/' className="font-medium text-blue-500 cursor-pointer">See all</Link>
                </div>
                <div className="flex flex-wrap gap-4">
                    {postWithMedia.length ? postWithMedia.map((post: any) => (
                        <Image key={post.id} src={post.image!} width={80} height={80} alt="Image" className="rounded-lg w-1/5 h-24 object-cover" />
                    )) : "No Media Found !"}
                </div>
            </div>
        </>
    )
}

export default UserMedia
