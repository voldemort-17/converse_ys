import { Album, Rss, Scroll, Settings2Icon, SquareActivity, StickyNote, Video } from "lucide-react"
import Link from "next/link"

const LeftMenuBar = () => {
  return (
    <>
      <div className="flex flex-col font-bold gap-4 p-4 bg-[#121212] text-[#aaa] rounded-lg text-sm">
        <Link href='/' className="flex items-center gap-4 cursor-pointer hover:bg-[#1e1e1e] rounded-lg p-2"><SquareActivity size={16}/>Activity</Link>
        <Link href='/' className="flex items-center gap-4 cursor-pointer hover:bg-[#1e1e1e] rounded-lg p-2"><StickyNote size={16}/>My Posts</Link>
        <Link href='/' className="flex items-center gap-4 cursor-pointer hover:bg-[#1e1e1e] rounded-lg p-2"><Album size={16}/>Album</Link>
        <Link href='/' className="flex items-center gap-4 cursor-pointer hover:bg-[#1e1e1e] rounded-lg p-2"><Video size={16}/>Video</Link>
        <Link href='/' className="flex items-center gap-4 cursor-pointer hover:bg-[#1e1e1e] rounded-lg p-2"><Rss size={16}/>News</Link>
        <Link href='/' className="flex items-center gap-4 cursor-pointer hover:bg-[#1e1e1e] rounded-lg p-2"><Scroll size={16}/>Lists</Link>
        <Link href='/' className="flex items-center gap-4 cursor-pointer hover:bg-[#1e1e1e] rounded-lg p-2"><Settings2Icon size={16}/>Settings</Link>
      </div>
    </>
  )
}

export default LeftMenuBar
