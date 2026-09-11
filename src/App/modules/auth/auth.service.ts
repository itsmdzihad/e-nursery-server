import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/db.config.js";
import AppError from "../../errors/AppError.js";
import { emailService } from "../email/email.service.js";
import hashOtp from "../../utils/hashOtp.js";
import { OtpPurpose } from "../../../generated/prisma/enums.js";

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

  const sendEmail = await emailService.sendVerificationOtpEmail(
    data.email,
    data.name as string,
    "SIGN_UP",
    "otp.email",
  );
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

  if (!findUser.isVerified) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your account is not verified yet. Please verify your email to continue.",
    );
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

const otpVerification = async (
  email: string,
  otp: string,
  purpose: OtpPurpose,
) => {
  const otpRecord = await prisma.otp.findFirst({
    where: {
      email,
      purpose,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpRecord) {
    throw new Error("OTP not found. Please request a new OTP.");
  }

  // Check OTP expiry
  if (otpRecord.expiresAt < new Date()) {
    await prisma.otp.delete({
      where: {
        id: otpRecord.id,
      },
    });

    throw new Error("OTP has expired. Please request a new OTP.");
  }

  // Hash user provided OTP
  const codeHash = hashOtp(otp);

  // Check OTP
  if (otpRecord.codeHash !== codeHash) {
    await prisma.otp.update({
      where: {
        id: otpRecord.id,
      },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });

    throw new Error("Invalid OTP.");
  }

  // Update user verification status
  await prisma.user.update({
    where: {
      email,
    },
    data: {
      isVerified: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      isVerified: true,
      createdAt: true,
    },
  });

  // Delete OTP after successful verification
  await prisma.otp.delete({
    where: {
      id: otpRecord.id,
    },
  });
};

const reSendOtp = async (payload: { email: string; purpose: OtpPurpose }) => {
  console.log(payload);

  if (!payload.email) {
    throw new Error("Email is required.");
  }

  if (!payload.purpose) {
    throw new Error("OTP purpose is required.");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  await emailService.sendVerificationOtpEmail(
    user.email,
    user.name || "User",
    payload.purpose,
    "otp.email",
  );
};
export const authService = {
  registerUser,
  loginUser,
  otpVerification,
  reSendOtp,
};
