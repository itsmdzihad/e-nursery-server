import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/db.js";
import AppError from "../../errors/AppError.js";

const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const hashPass = await bcrypt.hash(payload.password, 10);
  const data = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashPass,
    },
  });

  const { password, ...withOurPass } = data;

  return withOurPass;
};

const loginUser = async (payload: { email: string; password: string }) => {
  const findUser = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (!findUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please Register to login");
  }

  const matchPass = await bcrypt.compare(
    payload.password,
    findUser?.password as string,
  );

  if (!matchPass) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wrong Email or Password");
  }
  const { password, ...withOurPass } = findUser;

  return withOurPass;
};

export const authService = {
  registerUser,
  loginUser,
};
