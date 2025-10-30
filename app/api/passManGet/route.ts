import { description } from "@/components/chart-area-interactive";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { title } from "process";
import { ca } from "zod/v4/locales";

export async function POST(request: Request) {
  const { userId } = await request.json();

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!userId) {
    return NextResponse.json(
      { message: "userId is required" },
      { status: 400 }
    );
  }

  try {
    const PassMan = await prisma.passwordManeger.findMany({
      where: {
        userId,
      },
    });

    // lets return the PassMan as array of objects
    const response = PassMan.map((item) => ({
      id: item.id,
      title: item.title,
      username: item.emailOruser,
      password: item.password,
      description: item.description,
      category: item.category,
    }));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
