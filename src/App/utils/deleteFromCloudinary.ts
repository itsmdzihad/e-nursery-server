import cloudinary from "../config/cloudinary.js";

const deleteFromCloudinary = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId);
};

export default deleteFromCloudinary;
