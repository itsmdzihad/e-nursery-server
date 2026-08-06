import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { tokenHelper } from "../utils/tokenHelper.js";
import config from "../config/index.js";
import AppError from "../errors/AppError.js";
import { Role } from "../../type/index.js";

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        throw new AppError(401, "You are now allows!", {
          name: "Token not found",
        });
      }

      const verifyUser = tokenHelper.verifyToken(
        token,
        config.secret as string,
      );

      if (roles.length && !roles.includes(verifyUser?.role)) {
        throw new AppError(401, "You are now authorized!");
      }

      req.user = verifyUser;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new AppError(401, "Access token has expired"));
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return next(new AppError(401, "Invalid access token"));
      }

      next(error);
    }
  };
};

export default auth;
