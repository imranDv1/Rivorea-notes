import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ message: "userId is required" }, { status: 400 });
  }

  const subs = await prisma.subscription.findMany({
    where: { userId },
  });

  const hasSubs = subs.length > 0;
  const MAX_CHARS = hasSubs ? 5000 : 1000;
  const limit = hasSubs ? 10 : 3;

  return NextResponse.json({ MAX_CHARS ,limit });
}
