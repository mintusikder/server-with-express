import { Request, Response } from "express";
import { authServices } from "./auth.service";
import { sendResponse } from "../../server";
const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authServices.loginUser(email, password);
    sendResponse(res, 200, true, "User Login Successful", result);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
};

export const authController ={
  userLogin
}