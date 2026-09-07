import nodemailer from "nodemailer";
import config from "./index.js";

const emailTransporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: config.email_sender_smtp_user,
    pass: config.email_sender_smtp_pass,
  },
});

export default emailTransporter;
