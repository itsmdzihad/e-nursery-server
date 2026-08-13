import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendRes from "../../utils/sendRes.js";
import { orderService } from "./order.services.js";
import { OrderStatus, PaymentStatus } from "../../../generated/prisma/enums.js";

const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await orderService.createOrder(req.user?.id, req.body);

    sendRes({
      res,
      success: true,
      message: "Order Created Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const getAllOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, status, paymentStatus } = req.query;

    const result = await orderService.getAllOrders({
      limit: limit as string,
      page: page as string,
      status: status as OrderStatus,
      paymentStatus: paymentStatus as PaymentStatus,
    });

    sendRes({
      res,
      success: true,
      message: "Order Fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const getMyOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, status } = req.query;

    const result = await orderService.getMyOrders(req.user?.Id, {
      limit: limit as string,
      page: page as string,
      status: status as OrderStatus,
    });

    sendRes({
      res,
      success: true,
      message: "Order Fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const getSingleOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = {};

    sendRes({
      res,
      success: true,
      message: "Order Fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const updateOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = {};

    sendRes({
      res,
      success: true,
      message: "Order Fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const cancelOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = {};

    sendRes({
      res,
      success: true,
      message: "Order Fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const updatePaymentStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = {};

    sendRes({
      res,
      success: true,
      message: "Order Fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const getOrdersByStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = {};

    sendRes({
      res,
      success: true,
      message: "Order Fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);
const getOrderSummary = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = {};

    sendRes({
      res,
      success: true,
      message: "Order Fetch Successfully",
      statusCode: 200,
      data: result,
    });
  },
);

export const orderController = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  updateOrderStatus,
  cancelOrder,
  updatePaymentStatus,
  getOrdersByStatus,
  getOrderSummary,
};
