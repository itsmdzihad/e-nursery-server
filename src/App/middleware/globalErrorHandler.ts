import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { capitalizeFirstLetter } from "../utils/sendRes.js";
import config from "../config/index.js";
import deleteUploadedFilesFromGlobalErrorHandler from "../utils/deleteUploadedFilesFromGlobalErrorHandler.js";

const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(err);

  await deleteUploadedFilesFromGlobalErrorHandler(req);

  let statusCode = err.statusCode
    ? err.statusCode
    : httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  if (err.name === "ZodError") {
    message = capitalizeFirstLetter(
      message.match(/expected\s+\w+,\s+received\s+\w+/i)[0],
    );
  }

  res.status(statusCode).json({
    success,
    message,
    error: config.nodeEnv == "dev" ? error : null,
    stack: config.nodeEnv === "dev" ? err?.stack : null,
  });
};

export default globalErrorHandler;
