// app/api/users/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/mongdb";

export async function GET() {
  const { db } = await connectToDatabase();
  const users = await db.collection("users").find({}).toArray();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { db } = await connectToDatabase();
  const result = await db.collection("users").insertOne(body);
  return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
}
