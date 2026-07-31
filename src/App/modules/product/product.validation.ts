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

const updateProduct = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  price: z.coerce.number().positive().optional(),
  quantity: z.coerce.number().int().nonnegative().optional(),
  sizes: z
    .array(
      z.object({
        id: z.uuid(),
        name: z.string().optional(),
        images: z.array(z.string()).optional(),
        quantity: z.coerce.number().int().nonnegative().optional(),
        price: z.coerce.number().positive().optional(),
      }),
    )
    .optional(),
});

export const productValidation = {
  createProduct,
  updateProduct,
};
