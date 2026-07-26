import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { authService } from "./auth.services.js";

const userRegistration = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.registerUser(req.body);
    console.log(result);
  },
);

const userLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
  },
);
export const authController = {
  userRegistration,
  userLogin,
};
