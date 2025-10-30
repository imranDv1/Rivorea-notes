import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export async function PUT(request: Request) {
  try {
    const { id, title, description, emailOruser, password, category } =
      await request.json();

    if (!id) {
      return NextResponse.json({ message: "id is required" }, { status: 400 });
    }

    const data: Record<string, string> = {};
    if (typeof title === "string" && title.length > 0) data.title = title;
    if (typeof description === "string" && description.length > 0)
      data.description = description;
    if (typeof emailOruser === "string" && emailOruser.length > 0)
      data.emailOruser = emailOruser;
    if (typeof category === "string" && category.length > 0)
      data.category = category;
    if (typeof password === "string" && password.length > 0)
      data.password = bcrypt.hashSync(password, 10);

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 }
      );
    }

    const updated = await prisma.passwordManeger.update({
      where: { id },
      data,
    });

    return NextResponse.json(
      { message: "Pass updated successfully", pass: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating pass:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
