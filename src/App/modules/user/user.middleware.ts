import { NextFunction, Request, Response } from "express";

const updateMyProfile = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.data) {
    req.body = JSON.parse(req.body.data);
  }

  req.body.avatar = req.file?.path;
  req.body.avatarPublicId = req.file?.filename;

  next();
};

export const userMiddleware = {
  updateMyProfile,
};
