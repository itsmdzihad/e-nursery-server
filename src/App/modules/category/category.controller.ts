import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getSingleCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getCategoryTree = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getRootCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getChildCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const moveCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getCategoryBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const checkSlugAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getProductsByCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getProductsWithSubCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const countProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const countChildren = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
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
