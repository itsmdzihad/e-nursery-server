import dotEnv from "dotenv";

dotEnv.config();

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL_DEV as string;

export { PORT, DB_URL };
