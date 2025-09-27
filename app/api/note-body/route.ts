/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: extract all link URLs from Tiptap JSON
function extractLinksFromContent(content: any): string[] {
  const urls: string[] = [];
  function traverse(node: any) {
    if (!node) return;
    if (node.type === "link" && node.attrs?.href) {
      urls.push(node.attrs.href);
    }
    if (Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  }
  traverse(content);
  return Array.from(new Set(urls));
}

// Helper: replace image src in Tiptap content with Cloudinary URLs
function replaceImageSrc(node: any, imagesUrls: string[], indexObj: { i: number }): any {
  if (!node) return node;

  if (node.type === "image") {
    if (imagesUrls[indexObj.i]) {
      node.attrs.src = imagesUrls[indexObj.i];
      indexObj.i += 1;
    }
  }

  if (Array.isArray(node.content)) {
    node.content = node.content.map((child: any) => replaceImageSrc(child, imagesUrls, indexObj));
  }

  return node;
}

// Helper: extract Cloudinary public_id from secure_url
function getPublicIdFromUrl(url: string) {
  const parts = url.split("/"); 
  const folderAndFile = parts.slice(-2).join("/"); // e.g., notes/myimage.jpg
  const publicId = folderAndFile.replace(/\.[^/.]+$/, ""); // remove extension
  return publicId;
}

export async function POST(request: Request) {
  const prisma = new PrismaClient();

  try {
    const formData = await request.formData();
    const noteId = formData.get("noteId") as string;
    const contentStr = formData.get("content") as string;
    const files = formData.getAll("images") as File[];

    if (!noteId || !contentStr) {
      return NextResponse.json(
        { success: false, message: "noteId and content are required" },
        { status: 400 }
      );
    }

    // Parse content JSON
    let content: any;
    try {
      content = JSON.parse(contentStr);
    } catch (e) {
      return NextResponse.json({ success: false, error: "Invalid content JSON" }, { status: 400 });
    }

    // Check if content is effectively empty
    const isEmptyContent =
      content.type === "doc" &&
      Array.isArray(content.content) &&
      content.content.length === 1 &&
      content.content[0].type === "paragraph" &&
      (!content.content[0].attrs || content.content[0].attrs.textAlign === null);

    if (isEmptyContent) {
      content = null;
    }

    // Extract external links
    const links = content ? extractLinksFromContent(content) : [];

    // Upload new images to Cloudinary
    const imagesUrls: string[] = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploaded = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "notes" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });
      imagesUrls.push(uploaded.secure_url);
    }

    // Replace blob src in content with Cloudinary URLs
    const indexObj = { i: 0 };
    if (content) {
      content = replaceImageSrc(content, imagesUrls, indexObj);
    }

    // Fetch existing noteBody
    const existingBody = await prisma.noteBody.findUnique({ where: { noteId } });

    // Determine which old images were removed
    const oldImages = existingBody?.images || [];
    const removedImages = oldImages.filter(url => !imagesUrls.includes(url));

    // Delete removed images from Cloudinary
    for (const url of removedImages) {
      try {
        const publicId = getPublicIdFromUrl(url);
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", url, err);
      }
    }

    // Merge remaining old images with new ones
    const finalImages = [
      ...oldImages.filter(url => !removedImages.includes(url)), // keep old images not removed
      ...imagesUrls, // add newly uploaded images
    ];

    // Save or update NoteBody
    const noteBody = existingBody
      ? await prisma.noteBody.update({
          where: { noteId },
          data: { content, images: finalImages, links },
        })
      : await prisma.noteBody.create({
          data: { noteId, content, images: finalImages, links },
        });

    return NextResponse.json({ success: true, noteBody });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message });
  } finally {
    await prisma.$disconnect();
  }
}
