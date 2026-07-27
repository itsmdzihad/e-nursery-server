class AppError extends Error {
  statusCode: number;
  stack: any;
  message: string;
  constructor(statusCode: number, message: string, stack: any = "") {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
