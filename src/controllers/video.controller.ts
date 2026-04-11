import type { NextFunction, Request, Response } from "express";

import * as VideoService from "../services/video.service.ts";

export const upload = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;
    const userId = (req as any).userId;
    const video = await VideoService.upload({ ...body, userId });

    return res.status(201).json({
      success: true,
      message: "video uploaded successfully",
      data: video,
    });
  } catch (error) {
    next(error);
  }
};
