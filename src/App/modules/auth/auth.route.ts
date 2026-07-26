import { authValidation } from "./auth.validation.js";
import { Router } from "express";
import { authController } from "./auth.controller.js";
import validateRequest from "../../middleware/validateRequest.js";

const authRoute = Router();

authRoute.post(
  "/register",
  validateRequest(authValidation.registerUserSchema),
  authController.userRegistration,
);

authRoute.post(
  "/login",
  validateRequest(authValidation.loginUserSchema),
  authController.userLogin,
);

export default authRoute;
