import { Router } from "express";
import { categoryController } from "./category.controller.js";

const categoryRoute = Router();

// Create
categoryRoute.post("/", categoryController.createCategory);

// Read
categoryRoute.get("/", categoryController.getAllCategories);
categoryRoute.get("/tree", categoryController.getCategoryTree);
categoryRoute.get("/roots", categoryController.getRootCategories);
categoryRoute.get("/slug/:slug", categoryController.getCategoryBySlug);
categoryRoute.get("/slug/check", categoryController.checkSlugAvailability);

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
categoryRoute.patch("/:categoryId", categoryController.updateCategory);
categoryRoute.patch("/:categoryId/move", categoryController.moveCategory);

// Delete
categoryRoute.delete("/:categoryId", categoryController.deleteCategory);

export default categoryRoute;
