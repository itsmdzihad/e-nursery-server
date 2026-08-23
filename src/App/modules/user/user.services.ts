import { prisma } from "../../config/db.js";
import AppError from "../../errors/AppError.js";

const createUser = async (payload: any) => {};

const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};

const getUserByEmail = async (email: string) => {};

const getMyProfile = async (userId: string) => {};

const updateMyProfile = async (userId: string, payload: any) => {};

const updateUser = async (userId: string, payload: any) => {};

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) => {};

const updateUserRole = async (userId: string, role: string) => {};

const updateUserVerification = async (
  userId: string,
  isVerified: boolean,
) => {};

const deleteUser = async (userId: string) => {};

const getAllUsers = async (query: any) => {};

export const userService = {
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
