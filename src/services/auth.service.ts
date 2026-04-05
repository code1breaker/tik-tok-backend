import ejs from "ejs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

// model
import Otp from "../models/otp.model.ts";
import User from "../models/user.model.ts";

// service
import { sendEmail } from "./email.service.ts";
import { sendOtp } from "./otp.service.ts";

// utils
import { BadRequest } from "../utils/apiError.ts";

// types
import type {
  EmailignupIf,
  PhonneSignupIf,
} from "../types/services/auth.types.ts";

// config
import { env } from "../config/env.ts";

class AuthService {
  async emailSignup({
    email,
    username,
    firstname,
    lastname,
    hashPassword,
  }: EmailignupIf) {
    const userExist = await User.findOne({
      $or: [{ email }],
    });

    if (userExist) {
      if (userExist.isEmailVerified) {
        throw new BadRequest("User already exists!!!");
      }

      await User.deleteOne({ _id: userExist._id });
    }

    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password: hashPassword,
    });

    const token = jwt.sign({ _id: newUser?._id }, env.VERIFY_EMAIL_SECRET);
    const verifyLink = `${env.URL}/api/auth/verify-email/${token}`;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, "../../src/views/verify-email.ejs");
    const html = await ejs.renderFile(filePath, { verifyLink });

    await sendEmail({
      email,
      subject: "Verify Email",
      html,
    });

    await newUser.save();
    return { success: true, message: "Email Sent!! Please verify it." };
  }

  async phoneSignup({
    phone,
    username,
    firstname,
    lastname,
    hashPassword,
  }: PhonneSignupIf) {
    const userExist = await User.findOne({
      $or: [{ phone }],
    });

    if (userExist) {
      if (userExist.isPhoneVerified) {
        throw new BadRequest("User already exists!!!");
      }

      await User.deleteOne({ _id: userExist._id });
      await Otp.deleteOne({ phone });
    }

    const { otp } = await sendOtp({ phone });
    const newOtp = new Otp({
      phone,
      otp,
    });

    const newUser = new User({
      firstname,
      lastname,
      username,
      phone,
      password: hashPassword,
    });

    if (otp) {
      await newOtp.save();
      await newUser.save();
    }

    return { success: true, message: "OTP sent", data: newUser };
  }
}

export default new AuthService();
