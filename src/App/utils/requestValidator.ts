import { MiddlewareOptions } from "mongoose";
import catchAsync from "./catchAsync";
import { AnyZodObject } from "zod";

const requestValidator = (schema: AnyZodObject) => {
  return catchAsync(async (req, res, next) => {
    await schema.parseAsync({
      body: req.body,
    });

    return next();
  });
};

export default requestValidator;
