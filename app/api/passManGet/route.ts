import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { decryptPassword } from "@/lib/password-encryption";

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

    // lets return the PassMan as array of objects with decrypted passwords
    const response = PassMan.map((item) => {
      let decryptedPassword = "";
      try {
        decryptedPassword = decryptPassword(item.password);
      } catch (error) {
        console.error("Failed to decrypt password for item:", item.id, error);
        // If decryption fails (e.g., old bcrypt hash), return empty string
        decryptedPassword = "";
      }

      return {
        id: item.id,
        title: item.title,
        username: item.emailOruser,
        password: decryptedPassword,
        description: item.description,
        category: item.category,
      };
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
