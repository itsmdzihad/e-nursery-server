import { RequestHandler } from "express";

const catchAsync = (fun: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fun(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;
