import { authValidation } from "./auth.validation.js";
import { Router } from "express";
import { authController } from "./auth.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import { authService } from "./auth.services.js";

const authRoute = Router();

authRoute.post(
  "/register",
  validateRequest(authValidation.registerUserSchema),
  authController.userRegistration,
);

authRoute.post("/login", authController.userLogin);

export default authRoute;
