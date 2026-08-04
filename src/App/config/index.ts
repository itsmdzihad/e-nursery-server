import dotEnv from "dotenv";

dotEnv.config();

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL_DEV as string;
const nodeEnv = process.env.NODE_ENV as string;
const secret = process.env.SECRET as string;

export { PORT, DB_URL, nodeEnv, secret };
