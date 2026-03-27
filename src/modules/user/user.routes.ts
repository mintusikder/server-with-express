import express, { NextFunction, Request, Response } from "express";
import { logger } from "../../middleware/logger";
import { query } from "../../config/db";
import { sendResponse } from "../../server";
import { userController } from "./user.controller";

const router = express.Router();

router.post("/",logger,  userController.createUser);

router.get("/", logger, );

export const userRoutes = router;
