import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.js";
import AppError from "../errors/AppError.js";

const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string,
): Promise<UploadApiResponse> => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: folder },
        (
          error: UploadApiErrorResponse | undefined,
          uploadResult: UploadApiResponse | undefined,
        ) => {
          if (error) {
            return reject(error);
          }
          if (!uploadResult) {
            return reject(
              new AppError(403, "Upload failed without an error or result."),
            );
          }
          return resolve(uploadResult);
        },
      )
      .end(buffer);
  });
};

export default uploadToCloudinary;
