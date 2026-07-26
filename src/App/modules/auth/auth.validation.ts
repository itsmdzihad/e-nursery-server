import z from "zod";

const registerUserSchema = z.object({
  name: z.string().optional(),
  email: z.email(),
  password: z.string(),
});

export const authValidation = {
  registerUserSchema,
};
