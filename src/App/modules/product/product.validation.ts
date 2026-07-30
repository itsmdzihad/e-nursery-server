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

const updateSizes = z.array(
  z.object({
    id: z.uuid(),
    name: z.string().min(1),
    images: z.array(z.string()).min(1),
    quantity: z.coerce.number().int().nonnegative(),
    price: z.coerce.number().positive(),
  }),
);

export const productValidation = {
  createProduct,
  updateSizes,
};
