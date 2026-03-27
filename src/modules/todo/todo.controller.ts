import express, { Request, Response } from "express";
import { sendResponse } from "../../server";
import { todoService } from "./todo.service";

const createTodo = async (req: Request, res: Response) => {
  try {
    const { user_id, title } = req.body;

    const result = await todoService.createTodo({user_id, title});

    sendResponse(res, 201, true, "Todo created", result.rows[0]);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
};
const getTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoService.getTodo();
    sendResponse(res, 200, true, "Todos fetched", result.rows);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
};
const getSingleTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoService.getSingleTodo(req.params.id as string);

    if (!result.rows.length) {
      return sendResponse(res, 404, false, "Todo not found");
    }

    sendResponse(res, 200, true, "Todo fetched", result.rows[0]);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
};
const updateTodo = async (req: Request, res: Response) => {
  try {
    const { title, completed } = req.body;

    const result = await todoService.updateTodo(
      title,
      completed,
      req.params.id as string,
    );

    if (!result.rows.length) {
      return sendResponse(res, 404, false, "Todo not found");
    }

    sendResponse(res, 200, true, "Todo updated", result.rows[0]);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
};

const deleteTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoService.deleteTodo(req.params.id as string);
    if (!result.rowCount) {
      return sendResponse(res, 404, false, "Todo not found");
    }

    sendResponse(res, 200, true, "Todo deleted");
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
};

export const todoController = {
  createTodo,
  getTodo,
  getSingleTodo,
  updateTodo,
  deleteTodo,
};
