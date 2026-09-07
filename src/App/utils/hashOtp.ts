import crypto from "crypto";

const hashOtp = (otp: string) => {
  return crypto
    .createHmac("sha256", process.env.OTP_SECRET!)
    .update(otp)
    .digest("hex");
};

export default hashOtp;
