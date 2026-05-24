import type { ApiErrorOptionsIf } from "../types/utils/api-error.types.ts";

class ApiError extends Error {
  public status: number;
  public error: unknown;
  public code: string;

  constructor(
    message: string,
    status: number,
    code: string,
    error: unknown = {},
  ) {
    super(message);
    this.message = message;
    this.status = status;
    this.code = code;
    this.error = error;
  }
}

class BadRequest extends ApiError {
  constructor({
    message = "Bad Request",
    code,
    error,
    status = 400,
  }: ApiErrorOptionsIf) {
    super(message, status, code, error);
  }
}

class NotFound extends ApiError {
  constructor({ message = "Not Found", code, error }: ApiErrorOptionsIf) {
    super(message, 404, code, error);
  }
}

class UnAuthorized extends ApiError {
  constructor({ message = "Unauthorized", code, error }: ApiErrorOptionsIf) {
    super(message, 401, code, error);
  }
}

class Forbidden extends ApiError {
  constructor({ message = "Forbidden", code, error }: ApiErrorOptionsIf) {
    super(message, 403, code, error);
  }
}
export { ApiError, BadRequest, NotFound, UnAuthorized, Forbidden };
