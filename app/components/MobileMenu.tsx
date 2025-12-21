"use client"
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react"

const MobileMenu = () => {
  const { user, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="md:hidden">
        <div className="flex flex-col gap-[4.5] cursor-pointer" onClick={() => setIsOpen((prev) => !prev)}>
          <div className={`w-6 h-1 bg-[#EAEAEA] rounded-sm ${isOpen ? "rotate-45" : ''} origin-left ease-in-out duration-500`} />
          <div className={`w-6 h-1 bg-[#EAEAEA] rounded-sm ${isOpen ? "opacity-0" : ''} ease-in-out duration-500`} />
          <div className={`w-6 h-1 bg-[#EAEAEA] rounded-sm ${isOpen ? "-rotate-45" : ''} origin-left ease-in-out duration-500`} />
        </div>

        {isOpen && (
          <div className="absolute w-full h-[calc(100vh-56px)] top-14 left-0 bg-[#121212] text-[#EAEAEA] font-bold flex flex-col items-center justify-center gap-12 z-100 duration-500 ease-in-out">
            <Link href="/" className="hover:text-[#00A8E8] cursor-pointer" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href={`/profile/${user?.username}`} className="hover:text-[#00A8E8] cursor-pointer" onClick={() => setIsOpen(false)}>Profile</Link>
            <Link href="/" className="hover:text-[#00A8E8] cursor-pointer" onClick={() => setIsOpen(false)}>Friends</Link>
            <Link href="/" className="hover:text-[#00A8E8] cursor-pointer" onClick={() => setIsOpen(false)}>Groups</Link>
            <Link href="/" className="hover:text-[#00A8E8] cursor-pointer" onClick={() => setIsOpen(false)}>Stories</Link>
          </div>
        )}
      </div>
    </>
  )
}

export default MobileMenu
