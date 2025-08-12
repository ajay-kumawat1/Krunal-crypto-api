import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

interface UploadImageCloudinaryFile {
  mimetype: string;
  buffer: Buffer;
}

interface UploadImageCloudinaryOptions {
  file: UploadImageCloudinaryFile;
  folder: string;
}

export const uploadImageCloudinary = async (
  file: UploadImageCloudinaryFile,
  folder: string
): Promise<string> => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise<string>((resolve, reject) => {
    let resourceType: "auto" | "image" | "video" | "raw" = "auto";
    if (file.mimetype.startsWith("image/")) {
      resourceType = "image";
    } else if (file.mimetype.startsWith("video/")) {
      resourceType = "video";
    } else if (
      file.mimetype === "text/plain" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      resourceType = "raw";
    }

    const uploadOptions = {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    };

    const upload = cloudinary.uploader.upload_stream(
      uploadOptions,
      (
        error: Error | undefined,
        result: { secure_url?: string } | undefined
      ) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error.message);
          return reject(new Error(`File upload failed: ${error.message}`));
        }
        if (result?.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error("File upload failed: No result from Cloudinary."));
        }
      }
    );
    upload.end(file.buffer);
  });
};

interface DeleteImageCloudinaryOptions {
  url: string;
}

export const deleteImageCloudinary = async (
  url: DeleteImageCloudinaryOptions["url"]
): Promise<void> => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    let publicId: string | undefined = await getPublicIdFromUrl(url);
    let partsOfUrl: string[] = url.split("/");
    if (
      !publicId ||
      partsOfUrl.includes("default") ||
      publicId.startsWith("language-")
    ) {
      // Skip deletion if publicId is invalid or matches excluded patterns
      return;
    }
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Cloudinary Deletion Error:", error.message);
    } else {
      console.error("Cloudinary Deletion Error:", error);
    }
    throw new Error("Image delete failed.");
  }
};

type GetPublicIdFromUrl = (url: string) => string | undefined;

export const getPublicIdFromUrl: GetPublicIdFromUrl = (url) => {
  const parts = url?.split("/image/upload/");

  const publicIdWithVersion = parts[1];
  return publicIdWithVersion?.split("/")?.slice(1)?.join("/")?.split(".")[0];
};
