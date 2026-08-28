import { NextFunction, Request, Response } from "express";
import sendRes from "../../utils/sendRes.js";
import { userService } from "./user.services.js";
import catchAsync from "../../utils/catchAsync.js";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.createUser(req.body);

    sendRes({
      res,
      success: true,
      message: "User created successfully",
      statusCode: 201,
      data: result,
    });
  },
);

const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.getUserById(req.params.userId as string);

    sendRes({
      res,
      success: true,
      message: "User fetched successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const getUserByEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.getUserByEmail(req.query.email as string);

    sendRes({
      res,
      success: true,
      message: "User fetched successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.getMyProfile(req.user?.id);

    sendRes({
      res,
      success: true,
      message: "Profile fetched successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.updateMyProfile(
      req.user?.id as string,
      req.body,
      req.file as Express.Multer.File,
    );

    sendRes({
      res,
      success: true,
      message: "Profile updated successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.updateUser(
      req.params.userId as string,
      req.body,
    );

    sendRes({
      res,
      success: true,
      message: "User updated successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.changePassword(
      req.user?.id,
      req.body.oldPassword,
      req.body.newPassword,
    );

    sendRes({
      res,
      success: true,
      message: "Password changed successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const updateUserRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.updateUserRole(
      req.params.userId as string,
      req.body.role,
    );

    sendRes({
      res,
      success: true,
      message: "User role updated successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const updateUserVerification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.updateUserVerification(
      req.params.userId as string,
      req.body.isVerified,
    );

    sendRes({
      res,
      success: true,
      message: "User verification status updated successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.deleteUser(req.params.userId as string);

    sendRes({
      res,
      success: true,
      message: "User deleted successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.getAllUsers(req.query);

    sendRes({
      res,
      success: true,
      message: "Users fetched successfully",
      statusCode: 200,
      data: result,
    });
  },
);

export const userController = {
  createUser,
  getUserById,
  getUserByEmail,
  getMyProfile,
  updateMyProfile,
  updateUser,
  changePassword,
  updateUserRole,
  updateUserVerification,
  deleteUser,
  getAllUsers,
};
