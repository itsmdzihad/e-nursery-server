import { Router } from "express";
import { cartController } from "./cart.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import { cartValidation } from "./cart.validation.js";
import auth from "../../middleware/auth.js";
import { Role } from "../../../type/index.js";

const cartRoute = Router();

// Customer
cartRoute.get("/me", auth(Role.CUSTOMER), cartController.getMyCart);

cartRoute.post(
  "/me/items",
  auth(Role.CUSTOMER),
  validateRequest(cartValidation.addItemToCart),
  cartController.addItemToCart,
);

cartRoute.patch(
  "/me/items/:itemId",
  auth(Role.CUSTOMER),
  validateRequest(cartValidation.updateCartItemQuantity),
  cartController.updateCartItemQuantity,
);

cartRoute.delete(
  "/me/items/:itemId",
  auth(Role.CUSTOMER),
  cartController.removeCartItem,
);

cartRoute.delete("/me/items", auth(Role.CUSTOMER), cartController.clearCart);

cartRoute.get(
  "/me/summary",
  auth(Role.CUSTOMER),
  cartController.calculateCartSummary,
);

// Admin
cartRoute.get("/", cartController.getAllCart);
cartRoute.get("/:cartId", cartController.getCartById);
cartRoute.delete("/:cartId", cartController.deleteCart);

export default cartRoute;
