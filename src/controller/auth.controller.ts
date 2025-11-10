import type { NextFunction, Request, Response } from "express";
import User from "../model/user.model.ts";
import { BadRequest } from "../utils/apiError.ts";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, phone, firstname, lastname, password } = req.body;
    if (!username || !(email || phone) || !firstname || !lastname || !password)
      throw new BadRequest("All Fields are mandatory!!!");

    if (email && phone)
      throw new BadRequest(
        "Please provide either your email address or phone number to continue"
      );

    const usernameExist = await User.findOne({ username });
    if (usernameExist) throw new BadRequest("Username already exist!!!");

    const query: { email?: string; phone?: number } = {};
    if (email) query.email = email;
    if (phone) query.phone = phone;

    const userExist = await User.findOne(query);
    if (userExist) throw new BadRequest("User already exist!!!");

    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      phone,
      password,
    });

    await newUser.save();

    res.send("Signup");
  } catch (error) {
    next(error);
  }
};
