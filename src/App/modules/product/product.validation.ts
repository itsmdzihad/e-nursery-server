import z from "zod";

const createProduct = z.object({
  name: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  price: z.number(),
  quantity: z.number(),
  sizes: z.array(
    z.object({
      name: z.string(),
      images: z.array(z.string()),
      quantity: z.number(),
    }),
  ),
});

export const productValidation = {
  createProduct,
};
