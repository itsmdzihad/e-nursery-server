import { Router } from "express";
import auth from "../../middleware/auth.js";
import { Role } from "../../../type/index.js";
import { orderController } from "./order.controller.js";

const orderRoute = Router();

orderRoute.post("/", auth(Role.CUSTOMER), orderController.createOrder);

orderRoute.get("/my-orders", auth(Role.CUSTOMER), orderController.getMyOrders);

orderRoute.get(
  "/:orderId",
  auth(Role.CUSTOMER, Role.ADMIN),
  orderController.getSingleOrder,
);

orderRoute.patch(
  "/:orderId/cancel",
  auth(Role.CUSTOMER, Role.ADMIN),
  orderController.cancelOrder,
);

orderRoute.get("/", auth(Role.ADMIN), orderController.getAllOrders);

orderRoute.get(
  "/status/:status",
  auth(Role.ADMIN),
  orderController.getOrdersByStatus,
);

orderRoute.patch(
  "/:orderId/status",
  auth(Role.ADMIN),
  orderController.updateOrderStatus,
);

orderRoute.patch(
  "/:orderId/payment-status",
  auth(Role.ADMIN, Role.CUSTOMER),
  orderController.updatePaymentStatus,
);

orderRoute.get(
  "/admin/summary",
  auth(Role.ADMIN),
  orderController.getOrderSummary,
);

export default orderRoute;
