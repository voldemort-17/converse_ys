import type { User } from "@prisma/client";
import Image from "next/image";
import { prisma } from "@/lib/client";

export default async function UserMedia({ user }: { user: User }) {
  const posts = await prisma.post.findMany({ where: { userId: user.id, image: { not: null } }, select: { id: true, image: true, desc: true }, take: 6, orderBy: { createdAt: "desc" } });
  return (
    <section className="surface p-5"><h2 className="text-sm font-semibold text-[var(--muted)]">Recent media</h2>
      {posts.length ? <div className="mt-4 grid grid-cols-3 gap-2">{posts.map((post) => <a key={post.id} href={`#post-${post.id}`} className="relative aspect-square overflow-hidden rounded-lg"><Image src={post.image!} fill sizes="90px" alt={post.desc} className="object-cover transition hover:scale-105" /></a>)}</div> : <p className="mt-3 text-sm text-[var(--muted)]">No media shared yet.</p>}
    </section>
  );
}
