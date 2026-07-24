import { prisma } from "../../config/db.js";

const createUser = (payload: any) => {
  const data = prisma.user.create(payload);

  return data;
};

export const userService = {
  createUser,
};
