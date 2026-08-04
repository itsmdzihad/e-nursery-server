import { Router } from "express";
import { cartController } from "./cart.conroller.js";

const cartRoute = Router();

cartRoute.get("/", cartController.getAllCart);
cartRoute.post("/", cartController.addItemToCart);

export default cartRoute;
