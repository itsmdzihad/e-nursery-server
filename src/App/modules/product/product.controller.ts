import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { productService } from "./product.services.js";
import sendRes from "../../utils/sendRes.js";

const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await productService.createProduct(req.body);

    sendRes({
      res,
      success: true,
      message: "Product created successfully",
      statusCode: 200,
      data: result,
    });
  },
);

export const productController = {
  createProduct,
};
