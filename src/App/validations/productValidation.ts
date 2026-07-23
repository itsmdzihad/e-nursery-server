import { z } from "zod";

const createProductValidation = z.object({
  body: z.object({
    image: z.string().optional(),
    title: z.string({ required_error: "title is require" }),
    price: z.number({ required_error: "price is require" }),
    rating: z.number({ required_error: "rating is require" }),
  }),
});

export { createProductValidation };
