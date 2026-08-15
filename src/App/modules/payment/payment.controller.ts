import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { paymentService } from "./payment.services.js";
import sendRes from "../../utils/sendRes.js";

const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.createPayment({
      orderId: req.params.orderId,
      userId: req.user?.id,
    });

    sendRes({
      res,
      statusCode: 201,
      success: true,
      message: "Payment created successfully",
      data: result,
    });
  },
);

const processPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { paymentId } = req.params;

    const result = await paymentService.processPayment(
      paymentId as string,
      req.user?.id,
    );

    sendRes({
      res,
      statusCode: 200,
      success: true,
      message: "Payment processing initiated successfully",
      data: result,
    });
  },
);

const ipnPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.ipnPayment(req.body);

    sendRes({
      res,
      statusCode: 200,
      success: true,
      message: "Payment verified successfully",
      data: result,
    });
  },
);

const verifyPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.verifyPayment(req.body as string);

    sendRes({
      res,
      statusCode: 200,
      success: true,
      message: "Payment verified successfully",
      data: result,
    });
  },
);

const handlePaymentSuccess = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendRes({
      res,
      statusCode: 200,
      success: true,
      message: "Payment success handled successfully",
      data: {},
    });
  },
);

const handlePaymentFailure = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { paymentId } = req.params;

    const result = await paymentService.handlePaymentFailure(
      paymentId as string,
      req.body,
    );

    sendRes({
      res,
      statusCode: 200,
      success: true,
      message: "Payment failure handled successfully",
      data: result,
    });
  },
);

const handlePaymentWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.handlePaymentWebhook(
      req.body as string,
    );

    sendRes({
      res,
      statusCode: 200,
      success: true,
      message: "Payment webhook handled successfully",
      data: result,
    });
  },
);

const updatePaymentStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { paymentId } = req.params;
    const { status } = req.body;

    const result = await paymentService.updatePaymentStatus(
      paymentId as string,
      status,
    );

    sendRes({
      res,
      statusCode: 200,
      success: true,
      message: "Payment status updated successfully",
      data: result,
    });
  },
);

const getPaymentById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { paymentId } = req.params;

    const result = await paymentService.getPaymentById(paymentId as string);

    sendRes({
      res,
      statusCode: 200,
      success: true,
      message: "Payment fetched successfully",
      data: result,
    });
  },
);

const getPaymentByOrderId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;

    const result = await paymentService.getPaymentByOrderId(orderId as string);

    sendRes({
      res,
      statusCode: 200,
      success: true,
      message: "Payment fetched successfully",
      data: result,
    });
  },
);

const getUserPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const result = await paymentService.getUserPayments(userId as string);

    sendRes({
      res,
      statusCode: 200,
      success: true,
      message: "User payments fetched successfully",
      data: result,
    });
  },
);

const getAllPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.getAllPayments(req.query);

    sendRes({
      res,
      statusCode: 200,
      success: true,
      message: "Payments fetched successfully",
      data: result,
    });
  },
);

const refundPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { paymentId } = req.params;

    const result = await paymentService.refundPayment(
      paymentId as string,
      req.body,
    );

    sendRes({
      res,
      statusCode: 200,
      success: true,
      message: "Payment refund initiated successfully",
      data: result,
    });
  },
);

const getRefundByPaymentId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { paymentId } = req.params;

    const result = await paymentService.getRefundByPaymentId(
      paymentId as string,
    );

    sendRes({
      res,
      statusCode: 200,
      success: true,
      message: "Refund information fetched successfully",
      data: result,
    });
  },
);

const cancelPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { paymentId } = req.params;

    const result = await paymentService.cancelPayment(paymentId as string);

    sendRes({
      res,
      statusCode: 200,
      success: true,
      message: "Payment cancelled successfully",
      data: result,
    });
  },
);

const getPaymentHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { paymentId } = req.params;

    const result = await paymentService.getPaymentHistory(paymentId as string);

    sendRes({
      res,
      statusCode: 200,
      success: true,
      message: "Payment history fetched successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createPayment,
  processPayment,
  verifyPayment,
  handlePaymentSuccess,
  handlePaymentFailure,
  handlePaymentWebhook,
  updatePaymentStatus,
  getPaymentById,
  getPaymentByOrderId,
  getUserPayments,
  getAllPayments,
  refundPayment,
  getRefundByPaymentId,
  cancelPayment,
  getPaymentHistory,
  ipnPayment,
};
