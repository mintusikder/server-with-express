import express, { Request, Response } from "express";
import { query } from "../../config/db";
import { sendResponse } from "../../server";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const result = await userServices.createUser(name,email)

    sendResponse(res, 201, true, "User created", result.rows[0]);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await query(`SELECT * FROM users`);
    sendResponse(res, 200, true, "Users fetched", result.rows);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
};

export const userController = {
  createUser,
  getUsers,
};
