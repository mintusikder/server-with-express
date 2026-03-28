import express, { Response } from "express";
import config from "./config";
import initDB from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoutes } from "./modules/todo/todo.routes";
import { authRouter } from "./modules/auth/auth.routes";

const app = express();
const port = config.port;

// Middleware
app.use(express.json()); // ✅ correct
//DB
initDB();

// Response helper
export const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data?: any,
) => {
  res.status(status).json({ success, message, data });
};

/* ================= USERS ================= */

// Create user
app.use("/users", userRoutes);

/* ================= TODOS ================= */

// Create todo
app.use("/todos", todoRoutes);

/* ================= AUTH ================= */
//  Create Auth
app.use("/auth", authRouter);

/* ================= 404 ================= */

app.use((req, res) => {
  sendResponse(res, 404, false, "Route not found");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
