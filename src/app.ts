import express from "express";
import initDB from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoutes } from "./modules/todo/todo.routes";
import { authRouter } from "./modules/auth/auth.routes";
import sendResponse from "./utils/sendResponse";

const app = express();

// Middleware
app.use(express.json());

// DB Init
initDB();

// Routes
app.use("/users", userRoutes);
app.use("/todos", todoRoutes);
app.use("/auth", authRouter);

// 404 Handler
app.use((req, res) => {
  sendResponse(res, 404, false, "Route not found");
});

export default app;