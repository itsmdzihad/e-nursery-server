import path from "path";
import { OtpPurpose } from "../../../generated/prisma/enums.js";
import { prisma } from "../../config/db.config.js";
import ejs from "ejs";
import emailTransporter from "../../config/email.config.js";
import generateOtp from "../../utils/generateOtp.js";
import hashOtp from "../../utils/hashOtp.js";

const sendVerificationOtpEmail = async (
  email: string,
  name: string,
  type: OtpPurpose,
  template: string,
) => {
  const otp = generateOtp();
  const codeHash = hashOtp(otp);

  await prisma.otp.deleteMany({
    where: {
      email,
      purpose: OtpPurpose.SIGN_UP,
    },
  });

  // Store OTP
  await prisma.otp.create({
    data: {
      email,
      codeHash,
      purpose: type,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  // EJS template path
  const templatePath = path.join(
    process.cwd(),
    `src/App/modules/email/template/${template}.ejs`,
  );

  // Render template
  const html = await ejs.renderFile(templatePath, {
    name,
    otp,
    expiryMinutes: 10,
    type,
  });

  // Send email
  return await emailTransporter.sendMail({
    to: email,
    subject: "Verify Your Email - e-nursery 🌱",
    html,
  });
};

const sendWelcomeEmail = async () => {};

const sendOrderConfirmationEmail = async () => {};

const sendPaymentConfirmationEmail = async () => {};

const sendChangePassOtpEmail = async () => {};

export const emailService = {
  sendVerificationOtpEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendChangePassOtpEmail,
};
