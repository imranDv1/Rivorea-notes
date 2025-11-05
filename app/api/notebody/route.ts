import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { noteId, userId } = await request.json();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "userId isrequired" },
      { status: 400 }
    );
  }
  if (!noteId) {
    return NextResponse.json(
      { success: false, message: "noteId is required" },
      { status: 400 }
    );
  }

  const notes = await prisma.note.findUnique({
    where: {
      id: noteId,
    },
  });

  if (!notes) {
    return NextResponse.json(
      { success: false, message: "Note not found" },
      { status: 404 }
    );
  }

  if (notes.userId !== userId) {
    return NextResponse.json(
      { success: false, message: "You do not own this note" },
      { status: 403 }
    );
  }

  const notebody = await prisma.noteBody.findUnique({
    where: {
      noteId: noteId,
    },
  });

  return NextResponse.json({ success: true, notebody, noteTitle: notes.title });
}
