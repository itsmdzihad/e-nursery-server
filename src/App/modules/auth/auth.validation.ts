import z from "zod";

const registerUserSchema = z.object({
  name: z.string().optional(),
  email: z.email(),
  password: z.string(),
});

const loginUserSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const authValidation = {
  registerUserSchema,
  loginUserSchema,
};
