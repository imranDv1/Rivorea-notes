// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * رفع صورة إلى Cloudinary من File أو Buffer
 */
export async function uploadImage(file: File | Buffer): Promise<string> {
  try {
    // إذا كان file من نوع File (متصفح)
    let buffer: Buffer;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      // إذا كان Buffer
      buffer = file;
    }

    const url = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "notes" }, // مسار الصور
        (err, result) => {
          if (err) reject(err);
          else resolve(result!.secure_url);
        }
      );
      stream.end(buffer);
    });

    return url;
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    throw err;
  }
}
  