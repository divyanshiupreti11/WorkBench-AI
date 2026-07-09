import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (
  buffer,
  folder = "WorkBenchAI",
  publicId = null,
  resourceType = "auto"
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: publicId,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // 👇 Ye line use kar
    uploadStream.end(buffer);
  });
};