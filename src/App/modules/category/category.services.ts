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

const updateCategory = async (
  categoryId: string,
  payload: Partial<{
    name: string;
    description: string;
    image: string;
    parentId: string | null;
  }>,
) => {
  return await prisma.$transaction(async (tx) => {
    const category = await tx.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }

    if (payload.parentId) {
      if (payload.parentId === categoryId) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Category cannot be its own parent",
        );
      }

      const parent = await tx.category.findUnique({
        where: {
          id: payload.parentId,
        },
      });

      if (!parent) {
        throw new AppError(httpStatus.NOT_FOUND, "Parent category not found");
      }
    }

    let slug = category.slug;

    if (payload.name && payload.name !== category.name) {
      slug = slugify(payload.name, {
        lower: true,
        strict: true,
        trim: true,
      });

      const existingCategory = await tx.category.findFirst({
        where: {
          slug,
          NOT: {
            id: categoryId,
          },
        },
      });

      if (existingCategory) {
        throw new AppError(httpStatus.CONFLICT, "Category already exists");
      }
    }

    return await tx.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...payload,
        slug,
      },
    });
  });
};

const deleteCategory = async (categoryId: string) => {
  return await prisma.$transaction(async (tx) => {
    const category = await tx.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        children: true,
        products: true,
      },
    });

    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }

    if (category.children.length > 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Cannot delete category with subcategories",
      );
    }

    if (category.products.length > 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Cannot delete category with products",
      );
    }

    return await tx.category.delete({
      where: {
        id: categoryId,
      },
    });
  });
};

const getCategoryTree = async () => {
  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
    },
    include: {
      children: {
        include: {
          children: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories;
};

const getRootCategories = async () => {
  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
    },
    include: {
      _count: {
        select: {
          children: true,
          products: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories;
};
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
