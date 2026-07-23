import { Response } from "express";

type TSendRes<T> = {
  res: Response;
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

function capitalizeFirstLetter(payload: string) {
  return payload.charAt(0).toUpperCase() + payload.slice(1);
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
