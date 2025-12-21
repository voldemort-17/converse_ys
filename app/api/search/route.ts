import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json([]);
  }

  const users = await prisma.user.findMany({
    where: {
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
    take: 10,
  });

  return NextResponse.json(users);
}
