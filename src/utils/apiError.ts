class ApiError extends Error {
  public status: number;
  public error: unknown;
  constructor(message: string, status: number, error: unknown = {}) {
    super(message);
    this.message = message;
    this.status = status;
    this.error = error;
  }
}

class BadRequest extends ApiError {
  constructor(message: string = "Bad Request", error?: unknown) {
    super(message, 400, error);
  }
}
class NotFound extends ApiError {
  constructor(message: string = "Not Found", error?: unknown) {
    super(message, 404, error);
  }
}
class UnAuthorized extends ApiError {
  constructor(message: string = "Unauthorized", error?: unknown) {
    super(message, 401, error);
  }
}
class Forbidden extends ApiError {
  constructor(message: string = "Forbidden", error?: unknown) {
    super(message, 403, error);
  }
}

export { ApiError, BadRequest, NotFound, UnAuthorized, Forbidden };
