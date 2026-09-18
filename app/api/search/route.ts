import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim().slice(0, 60);

  if (!query || query.trim().length < 2) {
    return NextResponse.json([]);
  }

  const blocks = await prisma.block.findMany({
    where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
    select: { blockerId: true, blockedId: true },
  });
  const hiddenIds = blocks.map((block) => block.blockerId === userId ? block.blockedId : block.blockerId);

  const users = await prisma.user.findMany({
    where: {
      id: { notIn: [userId, ...hiddenIds] },
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
        { surname: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      username: true,
      name: true,
      surname: true,
      avatar: true,
    },
    orderBy: { username: "asc" },
    take: 10,
  });

  return NextResponse.json(users);
}
