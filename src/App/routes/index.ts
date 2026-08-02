import { Router } from "express";
import authRoute from "../modules/auth/auth.route.js";
import productRoute from "../modules/product/product.route.js";
import cartRoute from "../modules/cart/cart.route.js";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/product",
    route: productRoute,
  },
  {
    path: "/cart",
    route: cartRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
