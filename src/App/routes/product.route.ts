import { Router } from "express";
import {
  createProduct,
  getAllProduct,
} from "../controllers/product.controllers";
import requestValidator from "../utils/requestValidator";
import { createProductValidation } from "../validations/productValidation";

const productRoutes = Router();

productRoutes.get("/", getAllProduct);
productRoutes.post(
  "/",
  requestValidator(createProductValidation),
  createProduct
);

export default productRoutes;
