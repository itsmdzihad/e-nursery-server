import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

const validateRequest =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (e) {
      next(e);
    }
  };

export default validateRequest;
