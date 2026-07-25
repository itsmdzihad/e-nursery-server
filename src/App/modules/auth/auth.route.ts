import { Router } from "express";
import { authController } from "./auth.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import { userValidation } from "../user/user.validation.js";

const authRoute = Router();

authRoute.post(
  "/",
  validateRequest(userValidation.createUserSchema),
  authController.userRegistration,
);

export default authRoute;
