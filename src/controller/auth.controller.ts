import type { Request, Response } from "express";

export const signup = (req: Request, res: Response) => {
  res.send("Signup");
};
