// config
import { env } from "../config/env.ts";

export const sendOtp = async ({ phone }: { phone: number }) => {
  const otp = Math.floor(Math.random() * 10000);

  const BASE_URL = env.FAST_2_SMS_API_URL as string;
  const url = new URL(BASE_URL);
  url.searchParams.set("route", "otp");
  url.searchParams.set("variables_values ", String(otp));
  url.searchParams.set("numbers ", String(phone));
  url.searchParams.set("authorization", env.FAST_2_SMS_API_KEY || "");

  const res = await fetch(url);
  await res.json();

  return { otp };
};
