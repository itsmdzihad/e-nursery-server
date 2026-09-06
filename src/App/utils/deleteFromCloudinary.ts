import cloudinary from "../config/cloudinary.config.js";

const deleteFromCloudinary = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId);
};

export default deleteFromCloudinary;
