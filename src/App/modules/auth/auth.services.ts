import { prisma } from "../../config/db.js";

const registerUser = (payload: any) => {
  console.log();
  const data = prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    },
  });

  return data;
};

const loginUser = (payload: any) => {};

export const authService = {
  registerUser,
  loginUser,
};
