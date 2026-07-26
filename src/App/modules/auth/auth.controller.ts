import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { authService } from "./auth.services.js";
import sendRes from "../../utils/sendRes.js";

const userRegistration = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.registerUser(req.body);

    sendRes({
      res,
      success: true,
      statusCode: 200,
      message: "user registration successfully",
      data: result,
    });
  },
);

const userLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.loginUser(req.body);

    sendRes({
      res,
      success: true,
      statusCode: 200,
      message: "user login successfully",
      data: result,
    });
  },
);
export const authController = {
  userRegistration,
  userLogin,
};
