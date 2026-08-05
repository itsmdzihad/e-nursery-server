import { tokenHelper } from "./../../utils/tokenHelper.js";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { authService } from "./auth.services.js";
import sendRes from "../../utils/sendRes.js";
import config from "../../config/index.js";

const userRegistration = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.registerUser(req.body);

    const token = tokenHelper.createAccessToken(
      {
        id: result.id,
        email: result.email,
        role: result.role,
      },
      config.secret,
      "1d",
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    sendRes({
      res,
      success: true,
      statusCode: 200,
      message: "user registration successfully",
      data: { token, ...result },
    });
  },
);

const userLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.loginUser(req.body);

    const token = tokenHelper.createAccessToken(
      {
        id: result.id,
        email: result.email,
        role: result.role,
      },
      config.secret,
      "1d",
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    sendRes({
      res,
      success: true,
      statusCode: 200,
      message: "user login successfully",
      data: { token, ...result },
    });
  },
);
export const authController = {
  userRegistration,
  userLogin,
};
