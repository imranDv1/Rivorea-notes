import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { generateNoteBody } from "@/lib/openAi";

const prisma = new PrismaClient();

function normalizeAiBody(raw: string, title?: string): string {
  if (!raw) return "";
  let text = raw.trim();
  // remove a leading title line if it exactly matches
  if (title) {
    const firstLine = text.split("\n")[0]?.trim();
    if (firstLine && firstLine.toLowerCase() === title.trim().toLowerCase()) {
      text = text.slice(firstLine.length).trimStart();
    }
  }
  const codeBlockRegex = /```([\w-]*)\n([\s\S]*?)```/;
  if (codeBlockRegex.test(text)) {
    // keep as-is, just trim and normalize excessive blank lines around
    return text.replace(/\n{3,}/g, "\n\n").trim();
  }
  // no code: collapse whitespace and tidy paragraphs
  return text
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function POST(request: Request) {
  try {
    const { userId, title } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { message: "title is required" },
        { status: 400 }
      );
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
    // normalize and keep fenced code blocks intact
    const styledBody = normalizeAiBody(body, title);
    return NextResponse.json({ body: styledBody }, { status: 200 });
  } catch (error) {
    console.error("Error in AI route:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
