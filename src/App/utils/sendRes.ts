import { Response } from "express";

type TSendRes<T> = {
  res: Response;
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export function capitalizeFirstLetter(text: string): string {
  const normalized = text.trim().replace(/\s+/g, " ").toLowerCase();

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

const sendRes = <T>(payload: TSendRes<T>) => {
  const { res, success, statusCode, data } = payload;
  let message = capitalizeFirstLetter(payload.message);
  return res.status(statusCode).json({
    success,
    statusCode,
    message,
    data,
  });
};

export default sendRes;
