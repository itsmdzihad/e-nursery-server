import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendRes from "../../utils/sendRes.js";

const createAddress = catchAsync(
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

const getAllAddresses = catchAsync(
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

const getMyAddresses = catchAsync(
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

const getSingleAddress = catchAsync(
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
