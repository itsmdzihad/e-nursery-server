import z from "zod";

const createUser = z.object({
  name: z.string().optional(),
  email: z.email(),
  password: z.string(),
});

export const userValidation = {
  createUser,
};
