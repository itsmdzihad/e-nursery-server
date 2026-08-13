import { Router } from "express";
import auth from "../../middleware/auth.js";
import { Role } from "../../../type/index.js";
import { paymentController } from "./payment.controller.js";

const paymentRoute = Router();

// Customer
paymentRoute.post("/", auth(Role.CUSTOMER), paymentController.createPayment);

paymentRoute.post(
  "/:paymentId/process",
  auth(Role.CUSTOMER),
  paymentController.processPayment,
);

paymentRoute.post(
  "/verify",
  auth(Role.CUSTOMER),
  paymentController.verifyPayment,
);

paymentRoute.get(
  "/my-payments",
  auth(Role.CUSTOMER),
  paymentController.getUserPayments,
);

paymentRoute.get(
  "/:paymentId",
  auth(Role.CUSTOMER, Role.ADMIN),
  paymentController.getPaymentById,
);

paymentRoute.get(
  "/order/:orderId",
  auth(Role.CUSTOMER, Role.ADMIN),
  paymentController.getPaymentByOrderId,
);

paymentRoute.get(
  "/:paymentId/history",
  auth(Role.CUSTOMER, Role.ADMIN),
  paymentController.getPaymentHistory,
);

paymentRoute.patch(
  "/:paymentId/cancel",
  auth(Role.CUSTOMER),
  paymentController.cancelPayment,
);

// Payment Gateway
paymentRoute.post("/webhook", paymentController.handlePaymentWebhook);

paymentRoute.post(
  "/:paymentId/success",
  paymentController.handlePaymentSuccess,
);

paymentRoute.post(
  "/:paymentId/failure",
  paymentController.handlePaymentFailure,
);

// Admin
paymentRoute.get("/", auth(Role.ADMIN), paymentController.getAllPayments);

paymentRoute.patch(
  "/:paymentId/status",
  auth(Role.ADMIN),
  paymentController.updatePaymentStatus,
);

paymentRoute.post(
  "/:paymentId/refund",
  auth(Role.ADMIN),
  paymentController.refundPayment,
);

paymentRoute.get(
  "/:paymentId/refund",
  auth(Role.ADMIN),
  paymentController.getRefundByPaymentId,
);

export default paymentRoute;
