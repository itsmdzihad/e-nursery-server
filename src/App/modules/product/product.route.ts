import validateRequest from "../../middleware/validateRequest.js";
import { productController } from "./product.controller.js";
import { Router } from "express";
import { productValidation } from "./product.validation.js";
import { multerUpload } from "../../config/multer.config.js";
import { productMiddleware } from "./product.middleware.js";

const productRoute = Router();

productRoute.post(
  "/",
  multerUpload.fields([{ name: "images", maxCount: 3 }]),
  productMiddleware.createProduct,
  // validateRequest(productValidation.createProduct),
  productController.createProduct,
);

productRoute.get("/", productController.getAllProduct);
productRoute.get("/:id", productController.getProductById);
productRoute.delete("/:id", productController.deleteProductById);
productRoute.patch(
  "/:id",
  multerUpload.fields([{ name: "images", maxCount: 3 }]),
  productMiddleware.updateProduct,
  validateRequest(productValidation.updateProduct),
  productController.updateProductById,
);
productRoute.delete("/size/:id", productController.deleteProductSizeById);

export default productRoute;
