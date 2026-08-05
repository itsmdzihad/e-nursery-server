import { NextFunction, Request, Response } from "express";
import { tokenHelper } from "../utils/tokenHelper.js";
import config from "../config/index.js";
import AppError from "../errors/AppError.js";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        throw new AppError(403, "You are now allows!", {
          name: "Token not found",
        });
      }

      const verifyUser = tokenHelper.verifyToken(
        token,
        config.secret as string,
      );

      if (roles.length && !roles.includes(verifyUser?.role)) {
        throw new AppError(403, "You are now allows!");
      }

      req.user = verifyUser;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
