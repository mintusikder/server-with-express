import { Response } from "express";

const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data?: any
) => {
  return res.status(status).json({
    success,
    message,
    data,
  });
};

export default sendResponse;