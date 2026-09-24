import { NextFunction, Request, Response } from "express";

const createCategory = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.data) {
    req.body = JSON.parse(req.body.data);
  }

  req.body.image = req.file?.path;
  next();
};

export const categoryMiddleware = {
  createCategory,
};
