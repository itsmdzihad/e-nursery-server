import httpStatus from "http-status";
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

const getMyCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await cartService.getMyCart(req.params.userId as string);

    sendRes({
      res,
      success: true,
      message: "Fetch My cart details",
      statusCode: httpStatus.OK,
      data: result,
    });
  },
);

const updateCartItemQuantity = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await cartService.updateCartItemQuantity(req.body);

    sendRes({
      res,
      success: true,
      message: "Quantity updated Successfully",
      statusCode: httpStatus.OK,
      data: result,
    });
  },
);

export const cartController = {
  getAllCart,
  addItemToCart,
  getCartById,
  getMyCart,
  updateCartItemQuantity,
};
