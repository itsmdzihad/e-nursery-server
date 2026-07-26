import { prisma } from "../../config/db.js";

const registerUser = (payload: {
  name: string;
  email: string;
  password: string;
}) => {
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

const loginUser = async (payload: { email: string; password: string }) => {
  const result = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  return result;
};

export const authService = {
  registerUser,
  loginUser,
};
