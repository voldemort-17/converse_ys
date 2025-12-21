"use client"

import { addStory } from "@/lib/actions"
import { useUser } from "@clerk/nextjs"
import { Story, User } from "@prisma/client"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useOptimistic, useState } from "react"

type StoryType = Story & { user: User }

const StoryList = ({ stories, userId }: { stories: StoryType[], userId: string }) => {

    const [storyList, setStoryList] = useState(stories);
    const [img, setImg] = useState<any>();
    const [activeStory, setActiveStory] = useState<StoryType | null>(null);

    const { user, isLoaded } = useUser();

    const router = useRouter();

    useEffect(() => {
        if (!activeStory) return;

        const timer = setTimeout(() => {
            setActiveStory(null);
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
    }, [activeStory]);


    const add = async () => {
        if (!img.secure_url) return;

        setOptimisticStories({
            id: Math.random().toString(),
            img: img.secure_url,
            createdAt: new Date(Date.now()),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            userId: userId,
            user: {
                id: userId,
                avatar: user?.imageUrl || '/AvatarImage.jpg',
                username: "Uploading...",
                name: '' as string,
                surname: '' as string,
                work: '' as string,
                city: '' as string,
                website: '' as string,
                school: '' as string,
                createdAt: new Date(Date.now()),
                cover: "",
                description: ''
            }
        });
        try {
            const storyCreated = await addStory(img?.secure_url);
            setStoryList(prev => [storyCreated, ...prev.filter(s => s.userId !== userId)]);
            setImg(null);

            router.refresh();
        } catch (error) { }
    }

    const [optimisticStories, setOptimisticStories] = useOptimistic(
        storyList,
        (state, newStory: StoryType) => {
            const filtered = state.filter(s => s.userId !== newStory.userId);
            return [newStory, ...filtered];
        }
    );


    return (
        <>
            <CldUploadWidget uploadPreset="converse" onSuccess={(res) => setImg(res.info)}>
                {({ open }) => {
                    return (
                        <div className="flex flex-col items-center gap-2 cursor-pointer text-white relative">
                            <Image src={img?.secure_url || user?.imageUrl || '/AvatarImage.jpg'} width={80} height={80} alt="Image" className="rounded-[50%] w-20 h-20 object-cover opacity-60" onClick={() => open()} />
                            {img ? <form action={add}>
                                <button className="text-xs bg-blue-500 rounded-md p-1">Send</button>
                            </form> : <span className="font-medium">Add Story</span>}
                            <div className="absolute text-6xl top-1" onClick={() => open()}>+</div>
                        </div>
                    );
                }}
            </CldUploadWidget>
            {optimisticStories.map((story) => (
                <div
                    key={story.id}
                    className="flex flex-col items-center gap-2 cursor-pointer text-white"
                    onClick={() => setActiveStory(story)}
                >
                    <div className="p-[3px] rounded-full bg-blue-500">
                        <div className="p-[2px] rounded-full bg-black">
                            <Image
                                src={story.user.avatar || "/AvatarImage.jpg"}
                                width={80}
                                height={80}
                                alt="Image"
                                className="rounded-full w-20 h-20 object-cover"
                            />
                        </div>
                    </div>

                    <span className="font-medium">
                        {story.user.name || story.user.username}
                    </span>
                </div>
            ))}
            {activeStory && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                    onClick={() => setActiveStory(null)}
                >
                    <div className="relative w-full max-w-sm">
                        <Image
                            src={activeStory.img}
                            alt="Story"
                            width={400}
                            height={700}
                            className="w-full h-auto rounded-xl object-cover"
                        />

                        {/* progress bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
                            <div className="h-full bg-blue-400 animate-progress" />
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default StoryList