import dotEnv from "dotenv";

dotEnv.config();

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL_DEV as string;
const nodeEnv = process.env.NODE_ENV as string;
const secret = process.env.SECRET as string;
const base_url = process.env.BASE_URL as string;
const store_name = process.env.STORE_NAME as string;
const store_id = process.env.STORE_ID as string;
const store_pass = process.env.STORE_PASS as string;
const cloudinary_cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinary_api_key = process.env.CLOUDINARY_API_KEY;
const cloudinary_api_secret = process.env.CLOUDINARY_API_SECRET;

export default {
  PORT,
  DB_URL,
  nodeEnv,
  secret,
  base_url,
  store_name,
  store_id,
  store_pass,
  cloudinary_api_key,
  cloudinary_api_secret,
  cloudinary_cloud_name,
};
