import { Router } from "express";
import { cartController } from "./cart.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import { cartValidation } from "./cart.validation.js";

const cartRoute = Router();

cartRoute.get("/", cartController.getAllCart);
cartRoute.post(
  "/",
  validateRequest(cartValidation.addItemToCart),
  cartController.addItemToCart,
);
cartRoute.get("/:id", cartController.getCartById);
cartRoute.delete("/:cartId", cartController.deleteCart);
cartRoute.get("/userId/:userId", cartController.getMyCart);
cartRoute.patch(
  "/item",
  validateRequest(cartValidation.updateCartItemQuantity),
  cartController.updateCartItemQuantity,
);
cartRoute.delete("/item/:cartItemId", cartController.removeCartItem);
cartRoute.delete("/items/:userId", cartController.clearCart);
cartRoute.get("/summary/:userId", cartController.calculateCartSummary);
export default cartRoute;
