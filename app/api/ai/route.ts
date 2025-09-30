import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { generateNoteBody } from "@/lib/gemini";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId, title } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ message: "title is required" }, { status: 400 });
    }

    // التحقق إذا كان لدى المستخدم أي اشتراك
    let hasSubs = false;
    if (userId) {
      const subs = await prisma.subscription.findMany({
        where: { userId },
      });
      hasSubs = subs.length > 0;
    }

    if (!hasSubs) {
      return NextResponse.json(
        { message: "You need an active subscription to use this feature" },
        { status: 403 }
      );
    }

    // توليد النص باستخدام AI
    const body = await generateNoteBody(title);

    return NextResponse.json({ body });

  } catch (error) {
    console.error("Error in AI route:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
