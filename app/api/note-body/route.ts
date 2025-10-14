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

// Helper: extract all image srcs from Tiptap JSON
function extractImageSrcsFromContent(content: any): string[] {
  const srcs: string[] = [];
  function traverse(node: any) {
    if (!node) return;
    if (node.type === "image" && node.attrs?.src) {
      srcs.push(node.attrs.src);
    }
    if (Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  }
  traverse(content);
  return srcs;
}

// Helper: replace image src in Tiptap content with Cloudinary URLs (in order)
function replaceImageSrcs(node: any, newImageUrls: string[]): any {
  let imageIndex = 0;
  function traverse(n: any): any {
    if (!n) return n;
    if (n.type === "image") {
      // Only replace if src starts with "blob:" (i.e. new upload)
      if (n.attrs?.src && n.attrs.src.startsWith("blob:") && newImageUrls[imageIndex]) {
        n.attrs.src = newImageUrls[imageIndex];
        imageIndex += 1;
      }
    }
    if (Array.isArray(n.content)) {
      n.content = n.content.map(traverse);
    }
    return n;
  }
  return traverse(node);
}

// Helper: remove nodes of type "imageUpload" from content
function removeImageUploadNodes(node: any): any {
  if (!node) return node;
  if (Array.isArray(node.content)) {
    node.content = node.content
      .map(removeImageUploadNodes)
      .filter((child: any) => child.type !== "imageUpload");
  }
  return node;
}

// Helper: extract Cloudinary public_id from secure_url
function getPublicIdFromUrl(url: string) {
  // works for images uploaded to a folder (e.g., notes/...)
  const matches = url.match(/\/(?:v\d+\/)?([^/.]+(?:\/[^/.]+)*)\.[^/.]+$/); // matches "notes/abc123"
  if (matches && matches[1]) {
    return matches[1];
  }
  return null;
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
    } catch {
      return NextResponse.json({ success: false, error: "Invalid content JSON" }, { status: 400 });
    }

    // Remove any "imageUpload" nodes
    content = removeImageUploadNodes(content);

    // Check if content is effectively empty
    const isEmptyContent =
      content.type === "doc" &&
      Array.isArray(content.content) &&
      content.content.length === 1 &&
      content.content[0].type === "paragraph" &&
      (
        !content.content[0].content || 
        content.content[0].content.every((c: any) =>
          c.type === "text" && (!c.text || c.text.trim() === "")
        )
      );

    if (isEmptyContent) {
      content = null;
    }

    // Extract external links
    const links = content ? extractLinksFromContent(content) : [];

    // Extract all image srcs from new content (before replacement)
    const allImageSrcs = content ? extractImageSrcsFromContent(content) : [];

    // Find which images are new (blob:), and need to be uploaded
    const blobIndexes = allImageSrcs
      .map((src, idx) => src.startsWith("blob:") ? idx : -1)
      .filter(idx => idx !== -1);

    // Upload new images to Cloudinary and get their URLs
    const newImageUrls: string[] = [];
    for (let i = 0; i < blobIndexes.length; ++i) {
      const file = files[i]; // Order of files must match order of blob: in content!
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
      newImageUrls.push(uploaded.secure_url);
    }

    // Replace only "blob:" image srcs in content with Cloudinary URLs
    if (content && newImageUrls.length > 0) {
      content = replaceImageSrcs(content, newImageUrls);
    }

    // After replacement, get all final image URLs in content (should all be proper URLs)
    const finalImageUrlsInContent = content ? extractImageSrcsFromContent(content) : [];

    // Fetch existing noteBody
    const existingBody = await prisma.noteBody.findUnique({ where: { noteId } });

    // Determine which old images were removed from content
    const oldImages = existingBody?.images || [];
    const removedImages = oldImages.filter(
      url => !finalImageUrlsInContent.includes(url)
    );

    // Delete removed images from Cloudinary
    for (const url of removedImages) {
      try {
        const publicId = getPublicIdFromUrl(url);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", url, err);
      }
    }

    // Save only images that remain referenced in content
    const finalImages = finalImageUrlsInContent;

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