import { Gift, PartyPopper } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const Birthdays = () => {
    return (
        <>
            <div className="flex flex-col gap-4 p-4 bg-[#121212] rounded-lg">
                <div className="text-sm flex justify-between w-full">
                    <div className="font-medium text-[#aaa] ">Birthdays</div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex flex-1 items-center gap-3 text-sm font-bold text-white">
                        <Image src='https://images.pexels.com/photos/32763750/pexels-photo-32763750.jpeg' alt='Avatar' height={32} width={32} className="cursor-pointer rounded-[50%] w-8 h-8 object-cover" />
                        <span className="cursor-pointer">Cristino Ronaldo</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <PartyPopper className="cursor-pointer text-blue-500"/>
                    </div>
                </div>
                <div className="w-full flex items-center justify-center h-22 bg-[#222] rounded-lg text-[#aaa] gap-3 p-2">
                    <Gift className="font-bold"/>
                    <Link href='/' className="flex flex-col text-sm">
                        <div className="font-bold">Upcoming Birthdays</div>
                        <div>See other have 16 upcoming Birthdays</div>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Birthdays
