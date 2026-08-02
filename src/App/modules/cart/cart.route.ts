import { Router } from "express";
import { cartController } from "./cart.conroller.js";

const cartRoute = Router();

cartRoute.get("/", cartController.getAllCart);

export default cartRoute;
