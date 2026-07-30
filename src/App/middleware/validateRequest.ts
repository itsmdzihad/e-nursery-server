import { NextFunction, Request, Response } from "express";
import z from "zod";

const validateRequest =
  (schema: z.ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      await schema.parseAsync(req.body);
      next();
    } catch (e) {
      next(e);
    }
  };

export default validateRequest;
