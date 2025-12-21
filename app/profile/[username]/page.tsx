import Feed from "@/app/components/feed/Feed";
import LeftMenu from "@/app/components/leftMenu/LeftMenu";
import RightMenu from "@/app/components/rightMenu/RightMenu";
import { prisma } from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";

const ProfilePage = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;

  const user = await prisma.user.findFirst({
    where: {
      username: username
    },
    include: {
            _count: {
                select: {
                    followers:true,
                    posts: true,
                    following: true
                }
            }
        }
  });
  console.log('user', user);
  if (!user) return notFound();

  const {userId: currentUserId} = await auth();

  let isBlocked;

  if(currentUserId){
    const res = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: user.id
      }
    })

    if(res) isBlocked= true; 
  } else {
    isBlocked = false;
  }

  if(isBlocked) return notFound();

  return (
    <>
      <div className="flex gap-6 pt-6">
        <div className="hidden xl:block w-[20%]"><LeftMenu user={user} type="profile" /></div>
        <div className="w-full lg:w-[70%] xl:w-[50%]">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-center flex-col gap-4">
              <div className="w-full h-64 relative">
                <Image src={user?.cover || '/CoverImage.jpg'} fill alt="Image" className="rounded-lg object-cover" />
                <Image src={user?.avatar || '/AvatarImage.jpg'} width={128} height={128} alt="Image" className="rounded-full w-32 h-32 m-auto absolute left-0 right-0 -bottom-16 ring-4 ring-white object-cover" />
              </div>
              <h1 className="mt-18 text-2xl font-bold text-white">{(user.name && user.surname) ? user.name + " "  + user.surname :user?.username}</h1>
              <div className="flex items-center gap-10 font-bold text-[#aaa] text-lg">
                <div className="flex flex-col gap-1 items-center"><span>{user._count.posts}</span> Posts</div>
                <div className="flex flex-col gap-1 items-center"><span>{user._count.followers}</span> Followers</div>
                <div className="flex flex-col gap-1 items-center"><span>{user._count.following}</span> Following</div>
              </div>
            </div>
            <Feed username={user.username}/>
          </div>
        </div>
        <div className="hidden lg:block w-[30%]"><RightMenu user={user} /></div>
      </div></>
  )
}

export default ProfilePage;
