"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";

export default function NotificationsList({ notifications }: any) {
  const router = useRouter();

  return (
    <div className="max-w-xl mx-auto p-4">
      {/* Header */}
      <h1 className="text-xl font-semibold mb-6">Notifications</h1>

      <div className="flex flex-col gap-4">
        {notifications.map((n: any) => (
          <div
            key={n.id}
            onClick={() => router.push(`/post/${n.postId}`)}
            className="flex gap-3 p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 cursor-pointer"
          >
            {/* Avatar */}
            <Image
              src="/AvatarImage.jpg"
              width={44}
              height={44}
              alt="avatar"
              className="rounded-full"
            />
            {/* Content */}
            <div className="flex-1">
              <p className="text-sm">{n.desc}</p>
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(n.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No notifications yet
          </p>
        )}
      </div>
    </div>
  );
}
