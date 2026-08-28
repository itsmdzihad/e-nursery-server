import { Router } from "express";
import auth from "../../middleware/auth.js";
import { Role } from "../../../type/index.js";
import { userController } from "./user.controller.js";
import upload from "../../middleware/upload.js";

const userRoute = Router();

// Customer

userRoute.get(
  "/me",
  auth(Role.CUSTOMER, Role.ADMIN),
  userController.getMyProfile,
);

userRoute.patch(
  "/me",
  auth(Role.CUSTOMER, Role.ADMIN),
  upload.single("profileImage"),
  userController.updateMyProfile,
);

userRoute.patch(
  "/me/password",
  auth(Role.CUSTOMER, Role.ADMIN),
  userController.changePassword,
);

// Admin

userRoute.get("/", auth(Role.ADMIN), userController.getAllUsers);

userRoute.get("/email", auth(Role.ADMIN), userController.getUserByEmail);

userRoute.get("/:userId", auth(Role.ADMIN), userController.getUserById);

userRoute.patch("/:userId", auth(Role.ADMIN), userController.updateUser);

userRoute.patch(
  "/:userId/role",
  auth(Role.ADMIN),
  userController.updateUserRole,
);

userRoute.patch(
  "/:userId/verification",
  auth(Role.ADMIN),
  userController.updateUserVerification,
);

userRoute.delete("/:userId", auth(Role.ADMIN), userController.deleteUser);

export default userRoute;
