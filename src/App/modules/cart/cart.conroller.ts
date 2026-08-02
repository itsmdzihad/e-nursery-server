import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { cartService } from "./cart.services.js";
import sendRes from "../../utils/sendRes.js";

const getAllCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await cartService.getAllCart();

    sendRes({
      res,
      success: true,
      message: "Fetch All Cart Successfully",
      statusCode: 200,
      data: result,
    });
  },
);

export const cartController = {
  getAllCart,
};
