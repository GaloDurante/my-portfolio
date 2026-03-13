import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadImage(
  file: File,
  folder: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    maxBytes?: number;
    publicId?: string;
  }
): Promise<UploadResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (options?.maxBytes && buffer.length > options.maxBytes) {
    throw new Error(`File size exceeds ${options.maxBytes / 1024 / 1024}MB limit`);
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPG, PNG and WebP images are allowed");
  }

  const publicId = options?.publicId || `${folder}/${crypto.randomUUID()}`;

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      public_id: publicId,
      folder,
      resource_type: "image" as const,
      overwrite: true,
      transformation: options?.width || options?.height
        ? [
            {
              width: options.width,
              height: options.height,
              crop: options.crop || "fill",
            },
          ]
        : undefined,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result as UploadResult);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

export function getOptimizedUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
  }
): string {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
    secure: true,
    ...options,
  });
}

export function deleteImage(publicId: string): Promise<{ result: string }> {
  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
