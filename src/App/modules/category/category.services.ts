import slugify from "slugify";

import httpStatus from "http-status";
import { prisma } from "../../config/db.js";
import AppError from "../../errors/AppError.js";

const createCategory = async (payload: {
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
}) => {
  return await prisma.$transaction(async (tx) => {
    if (payload.parentId) {
      const parent = await tx.category.findUnique({
        where: {
          id: payload.parentId,
        },
      });

      if (!parent) {
        throw new AppError(httpStatus.NOT_FOUND, "Parent category not found");
      }
    }

    const slug = slugify(payload.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const isSlugExist = await tx.category.findUnique({
      where: {
        slug,
      },
    });

    if (isSlugExist) {
      throw new AppError(httpStatus.CONFLICT, "Category already exists");
    }

    return await tx.category.create({
      data: {
        ...payload,
        slug,
      },
    });
  });
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      parent: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      children: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
};

const getSingleCategory = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    include: {
      parent: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      children: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      products: true,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return category;
};

const updateCategory = () => {};
const deleteCategory = () => {};

const getCategoryTree = () => {};
const getRootCategories = () => {};
const getChildCategories = () => {};
const moveCategory = () => {};
const getCategoryBySlug = () => {};
const checkSlugAvailability = () => {};

const getProductsByCategory = () => {};
const getProductsWithSubCategories = () => {};

const countProducts = () => {};
const countChildren = () => {};

export const categoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree,
  getRootCategories,
  getChildCategories,
  moveCategory,
  getCategoryBySlug,
  checkSlugAvailability,
  getProductsByCategory,
  getProductsWithSubCategories,
  countProducts,
  countChildren,
};
