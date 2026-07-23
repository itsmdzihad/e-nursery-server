import { Router } from "express";

import requestValidator from "../utils/requestValidator.js";
import { createProductValidation } from "../validations/productValidation.js";

const productRoutes = Router();

export default productRoutes;
