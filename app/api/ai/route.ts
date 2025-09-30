import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { gemini, model, generateNoteBody } from "@/lib/gemini";

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

    // جلب الاشتراك الخاص بالمستخدم
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || subscription.type !== "PRO") {
      return NextResponse.json(
        { message: "Only Pro users can use this AI feature" },
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
