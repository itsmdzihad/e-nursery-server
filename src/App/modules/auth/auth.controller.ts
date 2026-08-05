import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { authService } from "./auth.services.js";
import sendRes from "../../utils/sendRes.js";
import createToken from "../../utils/createToken.js";

const userRegistration = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.registerUser(req.body);

    const token = createToken({
      id: result.id,
      email: result.email,
      role: result.role,
    });

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

    const token = createToken({
      id: result.id,
      email: result.email,
      role: result.role,
    });

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
