import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendRes from "../../utils/sendRes.js";
import { addressService } from "./address.services.js";
import AppError from "../../errors/AppError.js";

const createAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await addressService.createAddress(req?.user?.id, req.body);

    sendRes({
      res,
      success: true,
      message: "Address Create Successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const getAllAddresses = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await addressService.getAllAddresses();

    sendRes({
      res,
      success: true,
      message: "Address fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const getMyAddresses = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await addressService.getMyAddresses(req?.user?.id);

    sendRes({
      res,
      success: true,
      message: "Address fetch successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const getSingleAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    const { id, role } = req?.user;
    const result = await addressService.getSingleAddress(
      req.params.addressId as string,
      id,
      role,
    );

    sendRes({
      res,
      success: true,
      message: "Address Fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const updateAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    const { id, role } = req?.user;

    const result = await addressService.updateAddress(
      req.params.addressId as string,
      id,
      role,
      req.body,
    );

    sendRes({
      res,
      success: true,
      message: "Address Updated Successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const deleteAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    const { id, role } = req.user;

    const result = await addressService.deleteAddress(
      req.params.addressId as string,
      id,
      role,
    );

    sendRes({
      res,
      success: true,
      message: "Address Delete Successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const setDefaultAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    const { id, role } = req.user;
    const result = await addressService.setDefaultAddress(
      req.params.addressId as string,
      id,
      role,
    );

    sendRes({
      res,
      success: true,
      message: "Default Address Set Successfully",
      statusCode: 200,
      data: result,
    });
  },
);

const getDefaultAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    const { id, role } = req.user;

    const result = await addressService.getDefaultAddress(id, role);

    sendRes({
      res,
      success: true,
      message: "Address Fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);

export const addressController = {
  createAddress,
  getAllAddresses,
  getMyAddresses,
  getSingleAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress,
};
