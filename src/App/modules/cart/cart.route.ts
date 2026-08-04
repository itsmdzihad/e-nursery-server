import { Router } from "express";
import { cartController } from "./cart.controller.js";

const cartRoute = Router();

cartRoute.get("/", cartController.getAllCart);
cartRoute.post("/", cartController.addItemToCart);
cartRoute.get("/:id", cartController.getCartById);
cartRoute.get("/userId/:userId", cartController.getMyCart);
cartRoute.patch("/item", cartController.updateCartItemQuantity);
cartRoute.delete("/item/:cartItemId", cartController.removeCartItem);
cartRoute.delete("/items/:userId", cartController.clearCart);

export default cartRoute;
