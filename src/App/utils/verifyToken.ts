import jwt from "jsonwebtoken";
import { secret } from "../config/index.js";

export const verifyToken = (token: any) => jwt.verify(token, secret);
