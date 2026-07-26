import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../config/db.js";

const createProduct = async (payload: any) => {
  const data = await prisma.product.create({
    data: {
      name: payload.name,
      description: payload.description,
      images: payload.images,
      price: new Prisma.Decimal(payload.price),
      quantity: Number(payload.quantity),
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

export const productService = {
  createProduct,
};
