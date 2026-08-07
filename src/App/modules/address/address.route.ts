import { Router } from "express";
import auth from "../../middleware/auth.js";
import { Role } from "../../../type/index.js";
import { addressController } from "./address.controller.js";

const addressRoute = Router();

// Create
addressRoute.post(
  "/",
  auth(Role.CUSTOMER, Role.ADMIN),
  addressController.createAddress,
);

// Read
addressRoute.get(
  "/",
  auth(Role.ADMIN, Role.CUSTOMER),
  addressController.getAllAddresses,
);

addressRoute.get(
  "/me",
  auth(Role.CUSTOMER, Role.ADMIN),
  addressController.getMyAddresses,
);

addressRoute.get(
  "/default",
  auth(Role.CUSTOMER, Role.ADMIN),
  addressController.getDefaultAddress,
);

addressRoute.get(
  "/:addressId",
  auth(Role.CUSTOMER, Role.ADMIN),
  addressController.getSingleAddress,
);

// Update
addressRoute.patch(
  "/:addressId",
  auth(Role.CUSTOMER, Role.ADMIN),
  addressController.updateAddress,
);

addressRoute.patch(
  "/:addressId/default",
  auth(Role.CUSTOMER, Role.ADMIN),
  addressController.setDefaultAddress,
);

// Delete
addressRoute.delete(
  "/:addressId",
  auth(Role.CUSTOMER, Role.ADMIN),
  addressController.deleteAddress,
);

export default addressRoute;
