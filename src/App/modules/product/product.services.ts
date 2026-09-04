import httpStatus from "http-status";
import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/db.js";
import AppError from "../../errors/AppError.js";

const createProduct = async (payload: any) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  const data = await prisma.product.create({
    data: {
      name: payload.name,
      description: payload.description,
      images: payload.images,
      price: new Prisma.Decimal(payload.price),
      quantity: payload.sizes.reduce(
        (total: number, size: any) => total + Number(size.quantity),
        0,
      ),
      category: {
        connect: {
          id: payload.categoryId,
        },
      },
      sizes: {
        create: payload.sizes.map((size: any) => ({
          name: size.name,
          images: size.images,
          quantity: Number(size.quantity),
          price: new Prisma.Decimal(size.price),
        })),
      },
    },
    include: {
      sizes: true,
      category: true,
    },
  });
  return data;
};

const getAllProduct = async () => {
  const data = await prisma.product.findMany({
    include: {
      sizes: true,
      category: true,
    },
  });

  return data;
};

const getProductById = async (id: string) => {
  const data = await prisma.product.findFirst({
    where: {
      id: id,
    },
    include: {
      sizes: true,
      category: true,
    },
  });

  if (!data) {
    throw new AppError(404, "product Not Found");
  }

  return data;
};

const deleteProductById = async (id: string) => {
  const data = await prisma.product.delete({
    where: {
      id,
    },
  });

  return data;
};

const updateProductById = async (id: string, payload: any) => {
  const { sizes, categoryId, images, ...productData } = payload;

  const data = await prisma.$transaction(async (tx) => {
    // Check product
    const existingProduct = await tx.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new AppError(404, "Product Not Found");
    }

    // Check category
    if (categoryId !== undefined) {
      const category = await tx.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        throw new AppError(404, "Category Not Found");
      }
    }

    /*
     * Product images
     */
    let updatedImages = existingProduct.images;

    if (images !== undefined) {
      updatedImages = [...existingProduct.images];

      for (const image of images) {
        const index = updatedImages.indexOf(image.previous);

        if (index === -1) {
          throw new AppError(404, "Previous product image not found");
        }

        if (image.new) {
          updatedImages[index] = image.new;
        }
      }
    }

    // Update product
    await tx.product.update({
      where: {
        id,
      },
      data: {
        ...(productData.name !== undefined && {
          name: productData.name,
        }),

        ...(productData.description !== undefined && {
          description: productData.description,
        }),

        ...(images !== undefined && {
          images: updatedImages,
        }),

        ...(productData.price !== undefined && {
          price: new Prisma.Decimal(productData.price),
        }),

        ...(productData.quantity !== undefined && {
          quantity: Number(productData.quantity),
        }),

        ...(categoryId !== undefined && {
          category: {
            connect: {
              id: categoryId,
            },
          },
        }),
      },
    });

    /*
     * Sizes
     */
    if (sizes?.length) {
      await Promise.all(
        sizes.map(async (size: any) => {
          // Update size
          if (size.action === "update") {
            const existingSize = await tx.size.findUnique({
              where: {
                id: size.id,
              },
            });

            if (!existingSize) {
              throw new AppError(404, `Size with id ${size.id} not found`);
            }

            return tx.size.update({
              where: {
                id: size.id,
              },
              data: {
                ...(size.name !== undefined && {
                  name: size.name,
                }),

                ...(size.images !== undefined && {
                  images: size.images,
                }),

                ...(size.quantity !== undefined && {
                  quantity: Number(size.quantity),
                }),

                ...(size.price !== undefined && {
                  price: new Prisma.Decimal(size.price),
                }),
              },
            });
          }

          // Delete size
          if (size.action === "delete") {
            const existingSize = await tx.size.findUnique({
              where: {
                id: size.id,
              },
            });

            if (!existingSize) {
              throw new AppError(404, `Size with id ${size.id} not found`);
            }

            return tx.size.delete({
              where: {
                id: size.id,
              },
            });
          }

          // Add size
          if (size.action === "add") {
            return tx.size.create({
              data: {
                name: size.name,
                images: size.images || [],
                quantity: Number(size.quantity),
                price: new Prisma.Decimal(size.price),
                productId: id,
              },
            });
          }
        }),
      );
    }

    // Return updated product
    return tx.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        sizes: true,
      },
    });
  });

  return data;
};

const deleteProductSizeById = async (id: string) => {
  const isSizeExist = await prisma.size.findUnique({
    where: {
      id,
    },
  });

  if (!isSizeExist) {
    throw new AppError(404, "size now Found");
  }

  const data = await prisma.size.delete({
    where: {
      id,
    },
  });

  return data;
};

export const productService = {
  createProduct,
  getAllProduct,
  getProductById,
  deleteProductById,
  updateProductById,
  deleteProductSizeById,
};
