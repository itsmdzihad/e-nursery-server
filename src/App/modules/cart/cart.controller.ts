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

const addItemToCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, sizeId, quantity } = req.body;
    const result = await cartService.addItemToCart({
      userId,
      sizeId,
      quantity,
    });

    sendRes({
      res,
      success: true,
      message: "Item added to cart",
      statusCode: 200,
      data: result,
    });
  },
);

const getCartById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await cartService.getCartById(req.params.id as string);

    sendRes({
      res,
      success: true,
      message: "Fetch Cart Successfully",
      statusCode: 200,
      data: result,
    });
  },
);

export const cartController = {
  getAllCart,
  addItemToCart,
  getCartById,
};
