import httpStatus from "http-status";
import { prisma } from "../../config/db.js";
import AppError from "../../errors/AppError.js";
import { Role } from "../../../type/index.js";

const createAddress = async (
  userId: string,
  payload: {
    fullName: string;
    phone: string;
    country: string;
    division: string;
    district: string;
    upazila: string;
    area: string;
    addressLine: string;
    postalCode?: string;
    isDefault?: boolean;
  },
) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (payload.isDefault) {
      await tx.address.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const address = await tx.address.create({
      data: {
        ...payload,
        userId,
      },
    });

    return address;
  });
};

const getAllAddresses = async () => {
  const addresses = await prisma.address.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return addresses;
};
const getMyAddresses = async (userId: string) => {
  const addresses = await prisma.address.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        isDefault: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return addresses;
};
const getSingleAddress = async (
  addressId: string,
  userId: string,
  role: Role,
) => {
  const address = await prisma.address.findUnique({
    where: {
      id: addressId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!address) {
    throw new AppError(httpStatus.NOT_FOUND, "Address not found");
  }

  if (role !== Role.ADMIN && address.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this address",
    );
  }

  return address;
};
const updateAddress = async (
  addressId: string,
  userId: string,
  role: Role,
  payload: Partial<{
    fullName: string;
    phone: string;
    country: string;
    division: string;
    district: string;
    upazila: string;
    area: string;
    addressLine: string;
    postalCode: string;
    isDefault: boolean;
  }>,
) => {
  return await prisma.$transaction(async (tx) => {
    const address = await tx.address.findUnique({
      where: {
        id: addressId,
      },
    });

    if (!address) {
      throw new AppError(httpStatus.NOT_FOUND, "Address not found");
    }

    if (role !== Role.ADMIN && address.userId !== userId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to update this address",
      );
    }

    if (payload.isDefault) {
      await tx.address.updateMany({
        where: {
          userId: address.userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const updatedAddress = await tx.address.update({
      where: {
        id: addressId,
      },
      data: payload,
    });

    return updatedAddress;
  });
};
const deleteAddress = async (addressId: string, userId: string, role: Role) => {
  return await prisma.$transaction(async (tx) => {
    const address = await tx.address.findUnique({
      where: {
        id: addressId,
      },
    });

    if (!address) {
      throw new AppError(httpStatus.NOT_FOUND, "Address not found");
    }

    if (role !== Role.ADMIN && address.userId !== userId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to delete this address",
      );
    }

    await tx.address.delete({
      where: {
        id: addressId,
      },
    });

    return null;
  });
};
const setDefaultAddress = async (
  addressId: string,
  userId: string,
  role: Role,
) => {
  return await prisma.$transaction(async (tx) => {
    const address = await tx.address.findUnique({
      where: {
        id: addressId,
      },
    });

    if (!address) {
      throw new AppError(httpStatus.NOT_FOUND, "Address not found");
    }

    if (role !== Role.ADMIN && address.userId !== userId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to update this address",
      );
    }

    await tx.address.updateMany({
      where: {
        userId: address.userId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    const updatedAddress = await tx.address.update({
      where: {
        id: addressId,
      },
      data: {
        isDefault: true,
      },
    });

    return updatedAddress;
  });
};
const getDefaultAddress = async (userId: string, role: Role) => {
  const address = await prisma.address.findFirst({
    where: {
      ...(role === Role.ADMIN ? {} : { userId }),
      isDefault: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!address) {
    throw new AppError(httpStatus.NOT_FOUND, "Default address not found");
  }

  return address;
};
export const addressService = {
  createAddress,
  getAllAddresses,
  getMyAddresses,
  getSingleAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress,
};
