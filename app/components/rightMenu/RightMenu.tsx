import type { User } from "@prisma/client";
import { Suspense } from "react";
import Friends from "./Friends";
import UserInfo from "./UserInfo";
import UserMedia from "./UserMedia";

function PanelSkeleton() { return <div className="surface h-36 animate-pulse" aria-label="Loading panel" />; }

export default function RightMenu({ user }: { user?: User }) {
  return (
    <div className="flex flex-col gap-5 text-white">
      {user && <><Suspense fallback={<PanelSkeleton />}><UserInfo user={user} /></Suspense><Suspense fallback={<PanelSkeleton />}><UserMedia user={user} /></Suspense></>}
      <Suspense fallback={<PanelSkeleton />}><Friends /></Suspense>
      {!user && <section className="surface p-5"><h2 className="font-semibold">Welcome to Converse</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Share updates, discover people, and keep your closest conversations in one calm space.</p></section>}
    </div>
  );
}
