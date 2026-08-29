import bcrypt from "bcryptjs";
import { prisma } from "../../config/db.js";
import AppError from "../../errors/AppError.js";
import { Role } from "../../../generated/prisma/enums.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../../utils/deleteFromCloudinary.js";

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

const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
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

const getMyProfile = async (userId: string) => {
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
const updateMyProfile = async (userId: string, payload: any) => {
  // 1. Find user first
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const oldPublicId = user.avatarPublicId;

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      ...(payload.name !== undefined && {
        name: payload.name,
      }),

      ...(payload.avatar &&
        payload.avatarPublicId && {
          avatar: payload.avatar,
          avatarPublicId: payload.avatarPublicId,
        }),
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

  if (payload.avatarPublicId && oldPublicId) {
    await deleteFromCloudinary(oldPublicId);
  }

  return updatedUser;
};
const updateUser = async (userId: string, payload: any) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: payload.name,
      email: payload.email,
      avatar: payload.avatar,
      role: payload.role,
      isVerified: payload.isVerified,
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

  return updatedUser;
};
const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordMatched) {
    throw new AppError(401, "Old password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  return null;
};

const updateUserRole = async (userId: string, role: Role) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
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

  return updatedUser;
};
const updateUserVerification = async (userId: string, isVerified: boolean) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isVerified,
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

  return updatedUser;
};

const deleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return null;
};
const getAllUsers = async (query: any) => {
  const {
    search,
    role,
    isVerified,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const where: any = {};

  // Search by name or email
  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  // Filter by role
  if (role) {
    where.role = role;
  }

  // Filter by verification status
  if (isVerified !== undefined) {
    where.isVerified = isVerified === "true";
  }

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: {
        [sortBy]: sortOrder,
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
    }),

    prisma.user.count({
      where,
    }),
  ]);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
    },
    data: users,
  };
};
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
