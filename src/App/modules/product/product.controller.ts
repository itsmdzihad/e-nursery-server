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

const getAllProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await productService.getAllProduct();
    sendRes({
      res,
      success: true,
      message: "Fetch All Product",
      statusCode: 200,
      data: result,
    });
  },
);

const getProductById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await productService.getProductById(id);

    sendRes({
      res,
      success: true,
      message: "Fetch Product Successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const deleteProductById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await productService.deleteProductById(
      req.params.id as string,
    );

    sendRes({
      res,
      success: true,
      message: "Product Delete Successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const updateSizeBySizeId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await productService.updateSizeBySizeId(req.body);
    sendRes({
      res,
      success: true,
      message: "Product Update Successfully",
      statusCode: 200,
      data: result,
    });
  },
);

export const productController = {
  createProduct,
  getAllProduct,
  getProductById,
  deleteProductById,
  updateSizeBySizeId,
};
