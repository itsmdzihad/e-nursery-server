import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { categoryService } from "./category.services.js";
import sendRes from "../../utils/sendRes.js";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.createCategory(req.body);

    sendRes({
      res,
      success: true,
      message: "Category Create Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getAllCategories();

    sendRes({
      res,
      success: true,
      message: "Category fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const getSingleCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getSingleCategory(
      req.params.categoryId as string,
    );

    sendRes({
      res,
      success: true,
      message: "Category fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.updateCategory(
      req.params.categoryId as string,
      req.body,
    );

    sendRes({
      res,
      success: true,
      message: "Category Updated Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.deleteCategory(
      req.params.categoryId as string,
    );

    sendRes({
      res,
      success: true,
      message: "Category Deleted Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const getCategoryTree = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getCategoryTree();
    sendRes({
      res,
      success: true,
      message: "Category fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const getRootCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getRootCategories();

    sendRes({
      res,
      success: true,
      message: "Category fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const getChildCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getChildCategories(
      req.params.categoryId as string,
    );

    sendRes({
      res,
      success: true,
      message: "Category fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const moveCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.moveCategory(
      req.params.categoryId as string,
      req.body.parentId,
    );

    sendRes({
      res,
      success: true,
      message: "Category fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const getCategoryBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getCategoryBySlug(
      req.params.slug as string,
    );

    sendRes({
      res,
      success: true,
      message: "Category fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const checkSlugAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.checkSlugAvailability(
      req.params.slug as string,
    );

    sendRes({
      res,
      success: true,
      message: "Category fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const getProductsByCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getProductsByCategory(
      req.params.categoryId as string,
    );

    sendRes({
      res,
      success: true,
      message: "Category fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const getProductsWithSubCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getProductsWithSubCategories(
      req.params.categoryId as string,
    );

    sendRes({
      res,
      success: true,
      message: "Category fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const countProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.countProducts(
      req.params.categoryId as string,
    );

    sendRes({
      res,
      success: true,
      message: "Category fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const countChildren = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.countChildren(
      req.params.categoryId as string,
    );

    sendRes({
      res,
      success: true,
      message: "Category fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);

export const categoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree,
  getRootCategories,
  getChildCategories,
  moveCategory,
  getCategoryBySlug,
  checkSlugAvailability,
  getProductsByCategory,
  getProductsWithSubCategories,
  countProducts,
  countChildren,
};
