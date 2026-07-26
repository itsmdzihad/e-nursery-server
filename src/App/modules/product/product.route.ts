import { productController } from "./product.controller.js";
import { Router } from "express";

const productRoute = Router();

productRoute.post("/", productController.createProduct);

export default productRoute;
