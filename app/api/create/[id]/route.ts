import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse, NextRequest } from "next/server";
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

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  if (!id) {
    return NextResponse.json({ message: "Note ID is required" }, { status: 400 });
  }

  const prisma = new PrismaClient();

  try {
    const noteBody = await prisma.noteBody.findUnique({ where: { noteId: id } });

    if (noteBody?.images && noteBody.images.length > 0) {
      for (const url of noteBody.images) {
        try {
          const publicId = getPublicIdFromUrl(url);
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Failed to delete image from Cloudinary:", url, err);
        }
      }
    }

    await prisma.noteBody.deleteMany({ where: { noteId: id } });
    await prisma.note.delete({ where: { id } });

    return NextResponse.json({ message: "Note and all images deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete note: " + error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
