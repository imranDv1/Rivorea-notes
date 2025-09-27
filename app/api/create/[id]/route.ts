import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: extract Cloudinary public_id from secure_url
function getPublicIdFromUrl(url: string) {
  const parts = url.split("/"); 
  const folderAndFile = parts.slice(-2).join("/"); // e.g., notes/myimage.jpg
  const publicId = folderAndFile.replace(/\.[^/.]+$/, ""); // remove extension
  return publicId;
}

type tParams = { id: string };

export async function DELETE(
  request: Request,
props: { params: tParams }
) {
    const { id } = props.params;
  if (!id) {
    return NextResponse.json({ message: "Note ID is required" }, { status: 400 });
  }

  const prisma = new PrismaClient();

  try {
    // 1. جلب noteBody المرتبط
    const noteBody = await prisma.noteBody.findUnique({ where: { noteId: id } });

    if (noteBody?.images && noteBody.images.length > 0) {
      // 2. حذف كل الصور من Cloudinary
      for (const url of noteBody.images) {
        try {
          const publicId = getPublicIdFromUrl(url);
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Failed to delete image from Cloudinary:", url, err);
        }
      }
    }

    // 3. حذف الملاحظة نفسها (مع noteBody)
    await prisma.noteBody.deleteMany({ where: { noteId: id } });
    await prisma.note.delete({ where: { id } });

    return NextResponse.json({ message: "Note and all images deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete note: " + error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
