/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

// GET user profile
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { UserPlusInfo: true },
    });

    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST update user profile
// POST update user profile
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const gender = formData.get("gender") as string;
    const country = formData.get("country") as string;
    const file = formData.get("imageFile") as File;

    if (!userId || !name) return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });

    // Fetch current user to check existing image
    const currentUser = await prisma.user.findUnique({ where: { id: userId } });

    let imageUrl: string | undefined = undefined;

    if (file && file.size > 0) {
      // Delete old image from Cloudinary if exists
      if (currentUser?.image) {
        // Extract public_id from URL
        const matches = currentUser.image.match(/\/profile_images\/([^\.]+)\./);
        if (matches && matches[1]) {
          const publicId = `profile_images/${matches[1]}`;
          await cloudinary.uploader.destroy(publicId);
        }
      }

      // Upload new image
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploaded: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_images" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
      });
      imageUrl = uploaded.secure_url;
    }

    // Update User basic info
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, ...(imageUrl && { image: imageUrl }) },
    });

    // Update or create UserPlusInfo
    const existingPlusInfo = await prisma.userPlusInfo.findUnique({ where: { userId } });
    if (existingPlusInfo) {
      await prisma.userPlusInfo.update({
        where: { userId },
        data: { gender, country },
      });
    } else {
      await prisma.userPlusInfo.create({
        data: { userId, gender, country },
      });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}



