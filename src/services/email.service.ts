import nodemailer from "nodemailer";
import { env } from "../config/env.ts";

const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.GOOGLE_APP_EMAIL,
      pass: env.GOOGLE_APP_PASSWORD,
    },
  });
};

export const sendEmail = async ({
  email,
  subject,
  text,
  html,
}: {
  email: string;
  subject: string;
  text?: string;
  html?: string;
}) => {
  const transporter = getTransporter();
  const info = await transporter.sendMail({
    from: `Tik Tok <${env.GOOGLE_APP_EMAIL}>`,
    to: email,
    subject,
    text,
    html,
  });

  return info;
};
