import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userIdFromSession = session?.user?.id;
  try {
    const { searchParams } = new URL(request.url);
    const  userId  = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 });
    }

    if(userId !== userIdFromSession) {
      return NextResponse.json({ message: "This not is not belong to you" }, { status: 401 });
    }

    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
