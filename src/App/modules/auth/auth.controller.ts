import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { userValidation } from "../user/user.validation.js";

const userRegistration = catchAsync(
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
  },
);
export const authController = {
  userRegistration,
};
