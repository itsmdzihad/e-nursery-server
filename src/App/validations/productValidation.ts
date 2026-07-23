import { z } from "zod";

const createProductValidation = z.object({
  body: z.object({
    image: z.string().optional(),
    title: z.string(),
    price: z.number(),
    rating: z.number(),
  }),
});

export { createProductValidation };
