import { Router } from "express";
import { cartController } from "./cart.controller.js";

const cartRoute = Router();

cartRoute.get("/", cartController.getAllCart);
cartRoute.post("/", cartController.addItemToCart);
cartRoute.get("/:id", cartController.getCartById);
cartRoute.get("/userId/:userId", cartController.getMyCart);
cartRoute.patch("/", cartController.updateCartItemQuantity);

export default cartRoute;
