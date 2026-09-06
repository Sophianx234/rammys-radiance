// lib/cloudinary.ts
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { v4 as uuidv4 } from "uuid";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

function bufferToStream(buffer: Buffer) {
  return Readable.from(buffer);
}

export function uploadBufferToCloudinary(
  buffer: Buffer,
  publicId: string | undefined,
  imagePath: string
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const finalPublicId = publicId || uuidv4();
    const shouldOverwrite = Boolean(publicId);

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `rammysradiance/${imagePath}`,
        public_id: finalPublicId,
        overwrite: shouldOverwrite,
        invalidate: shouldOverwrite,
        format: "webp",
        transformation: [
          { width: 1200, height: 1200, crop: "limit" },
          { quality: "auto", fetch_format: "auto" }
        ]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result as UploadApiResponse);
      }
    );

    bufferToStream(buffer).pipe(stream);
  });
}

export function deleteFromCloudinary(publicId: string) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { invalidate: true }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

export function deleteFolderFromCloudinary(folderPath: string) {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources_by_prefix(folderPath, (error, result) => {
      if (error) reject(error);
      else {
        cloudinary.api.delete_folder(folderPath, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      }
    });
  });
}

export default cloudinary;
