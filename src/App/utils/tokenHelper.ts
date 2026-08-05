import {
  JsonWebTokenError,
  JwtPayload,
  Secret,
  SignOptions,
  TokenExpiredError,
} from "jsonwebtoken";
import jwt from "jsonwebtoken";
import AppError from "../errors/AppError.js";

const createAccessToken = (payload: any, secret: Secret, expiresIn: string) => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  } as SignOptions);

  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (err) {
    throw new AppError(400, "You are not allows!", err);
  }
};

export const tokenHelper = {
  createAccessToken,
  verifyToken,
};
