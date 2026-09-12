import { authValidation } from "./auth.validation.js";
import { Router } from "express";
import { authController } from "./auth.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import auth from "../../middleware/auth.js";
import { Role } from "../../../type/index.js";

const authRoute = Router();

authRoute.post(
  "/register",
  validateRequest(authValidation.registerUserSchema),
  authController.userRegistration,
);

authRoute.post("/verify-otp", authController.otpVerification);

authRoute.post("/resend-otp", authController.reSendOtp);

authRoute.post(
  "/login",
  validateRequest(authValidation.loginUserSchema),
  authController.userLogin,
);

authRoute.patch(
  "/me/password",
  auth(Role.CUSTOMER, Role.ADMIN),
  authController.resetPassword,
);

export default authRoute;
