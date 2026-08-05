import jwt from "jsonwebtoken";
import { secret } from "../config/index.js";
const createToken = (data: any) => jwt.sign(data, secret, { expiresIn: "1D" });

export default createToken;
