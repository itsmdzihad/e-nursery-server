import { NextFunction, Request, Response } from "express";
import AppError from "../../errors/AppError.js";

const createProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.files);
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
  try {
    if (!req.body.data) {
      throw new AppError(400, "Product data is required");
    }

    let data;

    try {
      data = JSON.parse(req.body.data);
    } catch {
      throw new AppError(400, "Invalid product data");
    }

    const files = (req.files || []) as Express.Multer.File[];

    // Validate images
    if (data.images !== undefined && !Array.isArray(data.images)) {
      throw new AppError(400, "Product images must be an array");
    }

    const images = data.images || [];

    for (const image of images) {
      if (!image.id) {
        throw new AppError(400, "Image id is required");
      }

      if (!image.previous) {
        throw new AppError(400, "Previous image is required");
      }
    }

    // Common images
    const commonImageFiles = files.filter(
      (file) => file.fieldname === "images",
    );

    if (commonImageFiles.length > 3) {
      throw new AppError(400, "Maximum 3 common images are allowed");
    }

    // Attach image files
    data.images = images.map((img: any) => {
      const file = files.find((file) => file.fieldname === img.id);

      if (file) {
        return {
          ...img,
          new: file.path,
        };
      }

      return img;
    });

    // Validate sizes
    if (data.sizes !== undefined && !Array.isArray(data.sizes)) {
      throw new AppError(400, "Sizes must be an array");
    }

    const sizes = data.sizes || [];
    const validActions = ["add", "update", "delete"];

    for (const size of sizes) {
      if (!size.action) {
        throw new AppError(400, "Size action is required");
      }

      if (!validActions.includes(size.action)) {
        throw new AppError(400, `Invalid size action: ${size.action}`);
      }

      if ((size.action === "update" || size.action === "delete") && !size.id) {
        throw new AppError(400, `Size id is required for ${size.action}`);
      }

      if (size.action === "add" && !size.id) {
        throw new AppError(400, "id is required for new size");
      }
    }

    // Create size map
    const sizeMap = new Map<string, any>();

    for (const size of sizes) {
      const key = size.action === "add" ? size.id : size.id;

      if (sizeMap.has(key)) {
        throw new AppError(400, `Duplicate size identifier: ${key}`);
      }

      sizeMap.set(key, size);
    }

    // Validate file fields
    for (const file of files) {
      if (file.fieldname.includes("images")) {
        continue;
      }

      if (!sizeMap.has(file.fieldname)) {
        throw new AppError(400, `Invalid image field: ${file.fieldname}`);
      }
    }

    // Attach size images
    data.sizes = sizes.map((size: any) => {
      const key = size.action === "add" ? size.id : size.id;

      const sizeFiles = files.filter((file) => file.fieldname === key);

      if (sizeFiles.length > 3) {
        throw new AppError(400, `Maximum 3 images allowed for "${size.name}"`);
      }

      if (size.action === "add" || size.action === "update") {
        return {
          ...size,
          images: sizeFiles.map((file) => file.path),
        };
      }

      return size;
    });

    req.body = data;

    next();
  } catch (error) {
    next(error);
  }
};
export const productMiddleware = {
  createProduct,
  updateProduct,
};
