"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import { HomeIcon, LogIn, PanelsTopLeft, PersonStanding, PlusCircleIcon, Search, Bell, MessageCircle } from "lucide-react";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { markNotificationsAsRead } from "@/lib/actions";

const Navbar = ({ hasUnread }: { hasUnread: boolean }) => {
  const pathData = usePathname();
  console.log("pathData", pathData);

  const handleClick = async () => {
    if (hasUnread) {
      await markNotificationsAsRead();
    }
  };

  return (
    <nav className="w-full flex bg-[#121212] text-[#EAEAEA] font-bold p-4 justify-between items-center">
      <Link href="/" className="text-lg hover:text-[#00A8E8]">Converse</Link>

      <ul className="hidden md:flex gap-8 text-sm items-center">
        <li>
          <Link href="/profile/1" className="hover:text-[#00A8E8] flex items-center gap-2">
            <HomeIcon size={18} className="hidden lg:block" />HomePage
          </Link>
        </li>
        <li>
          <Link href="/" className="hover:text-[#00A8E8] flex items-center gap-2">
            <PersonStanding className="hidden lg:block" />Friends
          </Link>
        </li>
        <li>
          <Link href="/" className="hover:text-[#00A8E8] flex items-center gap-2">
            <PlusCircleIcon size={20} className="hidden lg:block" />Stories
          </Link>
        </li>
      </ul>

      <div className="hidden lg:flex items-center bg-[#222] text-[#aaa] rounded-xl p-2">
        <input type="text" placeholder="Search..." className="bg-transparent outline-none" />
        <Search className="cursor-pointer" />
      </div>

      <ClerkLoading><div>Loading...</div></ClerkLoading>

      <ClerkLoaded>
        <SignedIn>
          <div className="flex items-center gap-4 cursor-pointer">
            <MobileMenu />
            <Link href="/" className="hidden md:flex hover:text-blue-500"><PanelsTopLeft /></Link>
            <MessageCircle className="hidden md:flex hover:text-blue-500" />
            <Link
              href="/notifications"
              onClick={handleClick}
              className="relative"
            >
              <Bell
                className={`cursor-pointer transition ${hasUnread ? "text-red-500" : "text-white"
                  }`}
              />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </Link>
            <UserButton />
          </div>
        </SignedIn>

        <SignedOut>
          <Link href="/sign-in" className="flex items-center gap-2">
            <LogIn size={18} />Login
          </Link>
        </SignedOut>
      </ClerkLoaded>
    </nav>
  );
};

export default Navbar;
