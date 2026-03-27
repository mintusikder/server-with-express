import express, { NextFunction, Request, Response } from "express";
import { logger } from "../../middleware/logger";
import { query } from "../../config/db";
import { sendResponse } from "../../server";

const router = express.Router()

router.post("/", logger, async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await query(
      `INSERT INTO users(name,email) VALUES($1,$2) RETURNING *`,
      [name, email],
    );

    sendResponse(res, 201, true, "User created", result.rows[0]);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
})

router.get("/", logger, async (req, res) => {
  try {
    const result = await query(`SELECT * FROM users`);
    sendResponse(res, 200, true, "Users fetched", result.rows);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
})

export const userRoutes = router