import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { authService } from "./auth.services.js";

const userRegistration = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.registerUser(req.body);

    return result;
  },
);

const userLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.loginUser(req.body);

    return result;
  },
);
export const authController = {
  userRegistration,
  userLogin,
};
