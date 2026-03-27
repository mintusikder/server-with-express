import express from "express";
import { logger } from "../../middleware/logger";
import { userController } from "./user.controller";

const router = express.Router();

router.post("/", logger, userController.createUser);
router.get("/", logger, userController.getUsers);
router.get("/:id", logger, userController.getSingleUser);
router.put("/:id", logger, userController.updateUser);
router.delete("/:id", logger, userController.deleteUser);

export const userRoutes = router;
