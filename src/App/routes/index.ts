import { Router } from "express";
import authRoute from "../modules/auth/auth.route.js";
import productRoute from "../modules/product/product.route.js";
import cartRoute from "../modules/cart/cart.route.js";
import categoryRoute from "../modules/category/category.route.js";
import addressRoute from "../modules/address/address.route.js";
import orderRoute from "../modules/order/order.route.js";
import paymentRoute from "../modules/payment/payment.route.js";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/products",
    route: productRoute,
  },
  {
    path: "/carts",
    route: cartRoute,
  },
  {
    path: "/categories",
    route: categoryRoute,
  },
  {
    path: "/addresses",
    route: addressRoute,
  },
  {
    path: "/orders",
    route: orderRoute,
  },
  {
    path: "/payments",
    route: paymentRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
