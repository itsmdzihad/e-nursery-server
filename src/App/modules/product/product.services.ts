import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/db.js";
import AppError from "../../errors/AppError.js";

const createProduct = async (payload: any) => {
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
      sizes: {
        create: payload.sizes.map((size: any) => ({
          name: size.name,
          images: size.images,
          quantity: Number(size.quantity),
          price: new Prisma.Decimal(size.price),
        })),
      },
    },
  });
  return data;
};

const getAllProduct = async () => {
  const data = await prisma.product.findMany({
    include: {
      sizes: true,
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
    },
  });

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
  const { sizes, ...productData } = payload;

  const data = await prisma.$transaction(async (tx) => {
    const existingProduct = await tx.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new AppError(404, "Product Now Found");
    }

    const product = await tx.product.update({
      where: {
        id,
      },
      data: {
        ...(productData.name !== undefined && { name: productData.name }),
        ...(productData.description !== undefined && {
          description: productData.description,
        }),
        ...(productData.images !== undefined && {
          images: productData.images,
        }),
        ...(productData.price !== undefined && {
          price: new Prisma.Decimal(productData.price),
        }),
        ...(productData.quantity !== undefined && {
          quantity: Number(productData.quantity),
        }),
      },
    });

    if (sizes?.length) {
      await Promise.all(
        sizes.map(async (size: any) => {
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
              ...(size.name !== undefined && { name: size.name }),
              ...(size.images !== undefined && { images: size.images }),
              ...(size.quantity !== undefined && {
                quantity: Number(size.quantity),
              }),
              ...(size.price !== undefined && {
                price: new Prisma.Decimal(size.price),
              }),
            },
          });
        }),
      );
    }

    return tx.product.findUnique({
      where: {
        id,
      },
      include: {
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
