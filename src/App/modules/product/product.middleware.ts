import { NextFunction, Request, Response } from "express";
import AppError from "../../errors/AppError.js";

const createProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = JSON.parse(req.body.data);

    const files = req.files as Express.Multer.File[];

    if (!files) {
      throw new AppError(400, "Product images are required");
    }

    // Common product images
    const commonImages = files.filter((file) => file.fieldname === "images");

    if (commonImages.length > 3) {
      throw new AppError(400, "Maximum 3 common images are allowed");
    }

    // Create size map
    const sizeMap = new Map(
      data.sizes.map((size: any) => [size.clientId, size]),
    );

    // Validate file fields
    for (const file of files) {
      if (file.fieldname === "images") {
        continue;
      }

      if (!sizeMap.has(file.fieldname)) {
        throw new AppError(400, `Invalid image field: ${file.fieldname}`);
      }
    }

    // Attach common images
    data.images = commonImages.map((file) => file.path);

    // Attach images to sizes
    data.sizes = data.sizes.map((size: any) => {
      const sizeFiles = files.filter(
        (file) => file.fieldname === size.clientId,
      );

      if (sizeFiles.length > 3) {
        throw new AppError(
          400,
          `Maximum 3 images are allowed for size "${size.name}"`,
        );
      }

      return {
        name: size.name,
        quantity: size.quantity,
        price: size.price,
        images: sizeFiles.map((file) => file.path),
      };
    });

    // Remove clientId before validation/database
    req.body = data;

    next();
  } catch (error) {
    next(error);
  }
};

const updateProduct = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body.data);

  next();
};

export const productMiddleware = {
  createProduct,
  updateProduct,
};
