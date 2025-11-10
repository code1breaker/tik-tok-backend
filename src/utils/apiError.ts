class ApiError extends Error {
  public status: number;
  constructor(message: string, status: number) {
    super(message);
    this.message = message;
    this.status = status;
  }
}

class BadRequest extends ApiError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}
class NotFound extends ApiError {
  constructor(message: string = "Not Found") {
    super(message, 404);
  }
}
class UnAuthorized extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}
class Forbidden extends ApiError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export { ApiError, BadRequest, NotFound, UnAuthorized, Forbidden };
