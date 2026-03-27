import express, { Request, Response } from "express";
import { sendResponse } from "../../server";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const result = await userServices.createUser(name, email);

    sendResponse(res, 201, true, "User created", result.rows[0]);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();
    sendResponse(res, 200, true, "Users fetched", result.rows);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getSingleUser(req.params.id as string);

    if (!result.rows.length) {
      return sendResponse(res, 404, false, "users not found");
    }

    sendResponse(res, 200, true, "users fetched", result.rows[0]);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    const result = await userServices.updateUser(
      name,
      email,
      req.params.id as string,
    );
    if (!result.rows.length) {
      return sendResponse(res, 404, false, "User not found");
    }

    sendResponse(res, 200, true, "User updated", result.rows[0]);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.id as string);

    if (!result.rowCount) {
      return sendResponse(res, 404, false, "User not found");
    }

    sendResponse(res, 200, true, "User deleted");
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
};

export const userController = {
  createUser,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
