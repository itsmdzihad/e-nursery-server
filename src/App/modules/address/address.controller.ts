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
    sendRes({
      res,
      success: false,
      message: "init all controller",
      statusCode: 400,
      data: {},
    });
  },
);

const deleteAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendRes({
      res,
      success: false,
      message: "init all controller",
      statusCode: 400,
      data: {},
    });
  },
);

const setDefaultAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendRes({
      res,
      success: false,
      message: "init all controller",
      statusCode: 400,
      data: {},
    });
  },
);

const getDefaultAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendRes({
      res,
      success: false,
      message: "init all controller",
      statusCode: 400,
      data: {},
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
