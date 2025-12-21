"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import { HomeIcon, LogIn, PanelsTopLeft, PersonStanding, PlusCircleIcon, Search, Bell, MessageCircle } from "lucide-react";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { markNotificationsAsRead } from "@/lib/actions";
import { useEffect, useState } from "react";

const Navbar = ({ hasUnread }: { hasUnread: boolean }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    if (search.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/search?q=${search}`);
      const data = await res.json();
      setResults(data);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);


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

      <ul className="hidden lg:flex gap-8 text-sm items-center">
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

      <div className="relative hidden md:flex items-center bg-[#222] text-[#aaa] rounded-xl p-2">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none px-2"
        />
        <Search />

        {/* Dropdown */}
        {search && (
          <div className="absolute top-12 left-0 w-full bg-[#1e1e1e] rounded-lg shadow-lg z-50">
            {loading && (
              <div className="p-2 text-sm text-gray-400">Searching...</div>
            )}

            {!loading && results.length === 0 && (
              <div className="p-2 text-sm text-gray-400">No users found</div>
            )}

            {results.map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.username}`}
                onClick={() => setSearch("")}
                className="flex items-center gap-3 p-2 hover:bg-[#333]"
              >
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt=""
                  className="h-8 w-8 rounded-full"
                />
                <div className="text-sm">
                  <div className="font-semibold">
                    {user.name} {user.surname}
                  </div>
                  <div className="text-gray-400">@{user.username}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>


      <ClerkLoading><div>Loading...</div></ClerkLoading>

      <ClerkLoaded>
        <SignedIn>
          <div className="flex items-center gap-4 cursor-pointer">
            <MobileMenu />
            <Link href="/" className="hidden md:flex hover:text-blue-500"><PanelsTopLeft /></Link>
            <MessageCircle className="hidden md:flex hover:text-blue-500" />
            <Search
              className="md:hidden cursor-pointer hover:text-blue-500"
              onClick={() => setMobileSearchOpen(true)}
            />
            {mobileSearchOpen && (
              <div className="fixed inset-0 bg-black/80 z-50 flex flex-col p-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-[#222] text-white p-3 rounded-xl outline-none"
                  />
                  <button
                    onClick={() => {
                      setMobileSearchOpen(false);
                      setSearch("");
                      setResults([]);
                    }}
                    className="text-sm text-gray-300"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {loading && <div className="text-gray-400 p-2">Searching...</div>}

                  {!loading && results.length === 0 && search && (
                    <div className="text-gray-400 p-2">No users found</div>
                  )}

                  {results.map((user) => (
                    <Link
                      key={user.id}
                      href={`/profile/${user.username}`}
                      onClick={() => setMobileSearchOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-[#222] rounded-lg"
                    >
                      <img
                        src={user.avatar || "/default-avatar.png"}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <div className="font-semibold">
                          {user.name} {user.surname}
                        </div>
                        <div className="text-gray-400 text-sm">
                          @{user.username}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

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
