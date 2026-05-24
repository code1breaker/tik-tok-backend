import type { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary.ts";
import { env } from "../config/env.ts";
import apiResponse from "../utils/api-response.ts";

export const uploadSignature = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { filetype = "auto", foldername = "video" } = req.query;
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `tiktok/${foldername}`;
    const signature = cloudinary.utils.api_sign_request(
      {
        folder,
        timestamp,
      },
      env.CLOUDINARY_API_SECRET,
    );

    const url = `${env.CLOUDINARY_BASE_URL}/v1_1/${env.CLOUDINARY_CLOUD_NAME}/${filetype}/upload`;
    const data = {
      url,
      signature,
      timestamp,
      folder,
      apiKey: env.CLOUDINARY_API_KEY,
    };

    apiResponse(res, {
      status: 200,
      message: "Signed signature",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { publicId, resourceType = "image" } = req.body;
    const resp = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    apiResponse(res, {
      status: 200,
      message: "Video deleted successfully ",
    });
  } catch (error) {
    next(error);
  }
};
