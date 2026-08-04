import z from "zod";

const addItemToCart = z.object({
  userId: z.string(),
  sizeId: z.string(),
  quantity: z.number(),
});

const updateCartItemQuantity = z.object({
  userId: z.string(),
  cartItemId: z.string(),
  quantity: z.number(),
});

export const cartValidation = {
  addItemToCart,
  updateCartItemQuantity,
};
