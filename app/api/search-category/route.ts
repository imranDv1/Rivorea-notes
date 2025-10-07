import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { category, userId } = await request.json();

  const notes = await prisma.note.findMany({
    where: {
      userId,
      category :{
        has : category
      }
    },
  });

  if (notes.length === 0) {
    return NextResponse.json({ message: "No notes found" });
  }

  return NextResponse.json({ notes });
}
