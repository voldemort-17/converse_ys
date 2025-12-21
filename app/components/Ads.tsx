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
                                <Link href='/' className="cursor-pointer text-blue-500">Cristino Ronaldo</Link>
                            </div>
                        </div>
                        <div className={size=== 'sm'? `text-xs` : `text-sm`}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, quibusdam itaque, repellendus non praesentium a autem doloribus, hic eius voluptas iusto odio pariatur veritatis quas sit ducimus temporibus. Maiores voluptate dolore corporis quas unde veritatis vitae illo magnam, beatae, sint, facere soluta eaque magni culpa ut dicta eos. Odit doloremque eos voluptatem ipsam impedit, modi provident. Culpa amet, commodi eveniet quis nihil adipisci hic fuga.</div>
                        <button className="p-2 w-full rounded-lg bg-[#222] cursor-pointer text-sm font-bold">Learn More</button>
                    </div>
                </div>
            </>
        </>
    )
}

export default Ads
