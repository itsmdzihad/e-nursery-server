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

export default {
  PORT,
  DB_URL,
  nodeEnv,
  secret,
  base_url,
  store_name,
  store_id,
  store_pass,
};
