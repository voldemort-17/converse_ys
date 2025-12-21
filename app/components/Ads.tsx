import { Ellipsis } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const Ads = ({size}: {size: "sm" | "md" | "lg"}) => {
    return (
        <>
            <>
                <div className="flex flex-col gap-4 p-4 bg-[#121212] rounded-lg">
                    <div className="text-sm flex justify-between w-full">
                        <div className="font-medium text-[#aaa] ">Sponsored Ads</div>
                        <Ellipsis className="cursor-pointer text-[#aaa]" />
                    </div>
                    <div className={`flex flex-col justify-between items-center ${size=== 'sm' ? "gap-2": "gap-4"}`}>
                        <Image src='https://images.pexels.com/photos/32763750/pexels-photo-32763750.jpeg' alt='Avatar' height={32} width={32} className={`cursor-pointer rounded-lg w-full ${size === 'sm' ? "h-24" : size === 'md' ? "h-36" :"h-48"} object-cover`} />
                        <div className="flex flex-1 items-start w-full gap-3 text-sm font-bold text-white">
                            <div className="flex items-center gap-4">
                                <Image src='https://images.pexels.com/photos/32763750/pexels-photo-32763750.jpeg' alt='Avatar' height={32} width={32} className="cursor-pointer rounded-[50%] w-8 h-8 object-cover" />
                                <Link href='/' className="cursor-pointer text-blue-500">Converse In Co.</Link>
                            </div>
                        </div>
                        <div className={size=== 'sm'? `text-xs` : `text-sm`}>Converse is a modern social platform built for real connections. Discover new people, explore profiles, share stories, and stay updated with smart notifications — all in one simple, fast experience. Whether you’re connecting with friends or meeting new people, Converse makes it effortless to stay in touch. Enjoy a clean design, secure authentication, and a smooth mobile-friendly experience built for today’s social world. Join a growing community, follow what matters to you, and never miss a moment. Start connecting smarter with Converse — where conversations turn into meaningful connections.</div>
                        <button className="p-2 w-full rounded-lg bg-[#222] cursor-pointer text-sm font-bold">Learn More</button>
                    </div>
                </div>
            </>
        </>
    )
}

export default Ads
