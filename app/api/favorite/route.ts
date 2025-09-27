/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// ✅ إضافة/إزالة ملاحظة من المفضلة (toggle)
export async function POST(req: Request) {
  try {
    const { userId, noteId } = await req.json();
    if (!userId || !noteId) {
      return NextResponse.json({ error: "Missing userId or noteId" }, { status: 400 });
    }

    // تحقق إذا كانت الملاحظة مفضلة بالفعل
    const existing = await prisma.favoriteNote.findUnique({
      where: { userId_noteId: { userId, noteId } },
    });

    if (existing) {
      // إذا موجودة نحذفها (toggle)
      await prisma.favoriteNote.delete({
        where: { userId_noteId: { userId, noteId } },
      });
      return NextResponse.json({ message: "Removed from favorites", removed: true }, { status: 200 });
    }

    // إذا مش موجودة نضيفها
    const favorite = await prisma.favoriteNote.create({
      data: { userId, noteId },
    });

    return NextResponse.json({ message: "Added to favorites", favorite, removed: false }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

// ✅ إزالة ملاحظة من المفضلة (explicit DELETE)
export async function DELETE(req: Request) {
  try {
    const { userId, noteId } = await req.json();
    if (!userId || !noteId) {
      return NextResponse.json({ error: "Missing userId or noteId" }, { status: 400 });
    }

    const existing = await prisma.favoriteNote.findUnique({
      where: { userId_noteId: { userId, noteId } },
    });

    if (!existing) {
      return NextResponse.json({ message: "Note not in favorites" }, { status: 404 });
    }

    await prisma.favoriteNote.delete({
      where: { userId_noteId: { userId, noteId } },
    });

    return NextResponse.json({ message: "Removed from favorites" }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

// ✅ جلب الملاحظات المفضلة لمستخدم محدد
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const favorites = await prisma.favoriteNote.findMany({
      where: { userId },
      include: {
        note: true, // لازم يكون عندك relation اسمه "note" في Prisma schema
      },
    });

    return NextResponse.json(favorites, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
