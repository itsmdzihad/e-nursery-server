import { Router } from "express";
import { categoryController } from "./category.controller.js";
import auth from "../../middleware/auth.js";
import { Role } from "../../../type/index.js";

const categoryRoute = Router();

// Create
categoryRoute.post("/", auth(Role.ADMIN), categoryController.createCategory);

// Read
categoryRoute.get("/", categoryController.getAllCategories);
categoryRoute.get("/tree", categoryController.getCategoryTree);
categoryRoute.get("/roots", categoryController.getRootCategories);
categoryRoute.get("/slug/:slug", categoryController.getCategoryBySlug);
categoryRoute.get(
  "/slug/check/:slug",
  categoryController.checkSlugAvailability,
);

categoryRoute.get("/:categoryId", categoryController.getSingleCategory);
categoryRoute.get(
  "/:categoryId/children",
  categoryController.getChildCategories,
);
categoryRoute.get(
  "/:categoryId/products",
  categoryController.getProductsByCategory,
);
categoryRoute.get(
  "/:categoryId/products/all",
  categoryController.getProductsWithSubCategories,
);
categoryRoute.get(
  "/:categoryId/product-count",
  categoryController.countProducts,
);
categoryRoute.get(
  "/:categoryId/children-count",
  categoryController.countChildren,
);

// Update
categoryRoute.patch(
  "/:categoryId",
  auth(Role.ADMIN),
  categoryController.updateCategory,
);

categoryRoute.patch(
  "/:categoryId/move",
  auth(Role.ADMIN),
  categoryController.moveCategory,
);

// Delete
categoryRoute.delete(
  "/:categoryId",
  auth(Role.ADMIN),
  categoryController.deleteCategory,
);

export default categoryRoute;
