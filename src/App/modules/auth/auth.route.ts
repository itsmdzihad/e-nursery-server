import { Router } from "express";
import { authController } from "./auth.controller.js";

const authRoute = Router();

authRoute.post("/", authController.userRegistration);

export default authRoute;
