import { User } from "@prisma/client"
import Ads from "../Ads"
import Birthdays from "./Birthdays"
import Friends from "./Friends"
import UserInfo from "./UserInfo"
import UserMedia from "./UserMedia"
import { Suspense } from "react"

const RightMenu = ({ user }: { user?: User }) => {
  return (
    <>
      <div className="flex flex-col gap-6 text-white">
        {user ? (
          <>
            <Suspense fallback= "loading...">
              <UserInfo user={user} />
            </Suspense>
            <Suspense fallback= "loading...">
              <UserMedia user={user} />
            </Suspense>
          </>
        ) : ''}
        <Friends />
        <Birthdays />
        <Ads size="md" />
      </div>
    </>
  )
}

export default RightMenu
