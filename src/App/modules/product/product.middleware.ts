import { NextFunction, Request, Response } from "express";

const createProduct = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body.data);
  console.log(req.files);
  next();
};

const updateProduct = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body.data);

  next();
};

export const productMiddleware = {
  createProduct,
  updateProduct,
};
