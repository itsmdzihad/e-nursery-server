import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { userValidation } from "../user/user.validation.js";
import { userService } from "../user/user.services.js";

const userRegistration = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const result = await userService.createUser(req.body);
    console.log(result);
  },
);
export const authController = {
  userRegistration,
};
