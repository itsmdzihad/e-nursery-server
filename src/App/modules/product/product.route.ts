import validateRequest from "../../middleware/validateRequest.js";
import { productController } from "./product.controller.js";
import { Router } from "express";
import { productValidation } from "./product.validation.js";

const productRoute = Router();

productRoute.post(
  "/",
  validateRequest(productValidation.createProduct),
  productController.createProduct,
);

productRoute.get("/", productController.getAllProduct);
productRoute.get("/:id", productController.getProductById);

export default productRoute;
