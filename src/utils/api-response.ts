import type { Response } from "express";

interface ApiResponseIf {
  status: number;
  data?: Record<string, any> | Record<string, any>[];
  message: string;
  code?: string;
  error?: Record<string, any>;
  pagination?: {
    count: number;
    limit: number;
    page: number;
  };
}

const apiResponse = (res: Response, body: ApiResponseIf) => {
  const { status, data = null, message, code, error = null, ...rest } = body;
  const success = status <= 400;

  return res
    .status(status)
    .json({ success, data, message, code, error, ...rest });
};
export default apiResponse;
