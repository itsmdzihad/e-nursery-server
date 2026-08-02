import { prisma } from "../../config/db.js";

const getAllCart = async () => {
  const data = await prisma.cart.findMany();

  return data;
};

export const cartService = {
  getAllCart,
};
