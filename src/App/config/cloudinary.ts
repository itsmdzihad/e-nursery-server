import { v2 as cloudinary } from "cloudinary";
import config from "./index.js";

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});
console.log(config.cloudinary_cloud_name);
console.log(config.cloudinary_api_key);
console.log(config.cloudinary_api_secret);
export default cloudinary;
