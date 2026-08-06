import z from "zod";

const addItemToCart = z.object({
  sizeId: z.string(),
  quantity: z.number(),
});

const updateCartItemQuantity = z.object({
  quantity: z.number(),
});

export const cartValidation = {
  addItemToCart,
  updateCartItemQuantity,
};
