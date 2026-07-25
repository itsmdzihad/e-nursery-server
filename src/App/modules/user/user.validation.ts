import z from "zod";

const createUserSchema = z.object({
  name: z.string().optional(),
  email: z.email(),
  password: z.string(),
});

export const userValidation = {
  createUserSchema,
};
