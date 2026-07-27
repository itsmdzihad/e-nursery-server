import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { nodeEnv } from "../config/index.js";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(err.name);
  let statusCode = err.statusCode
    ? err.statusCode
    : httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  res.status(statusCode).json({
    success,
    message,
    error: nodeEnv == "dev" ? error : null,
    stack: nodeEnv === "dev" ? err?.stack : null,
  });
};

export default globalErrorHandler;
