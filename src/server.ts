import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { query } from "./config/db";
import { logger } from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";

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
app.use("/users", userRoutes)

// Get all users
app.get("/users",);

// Get single user
// app.get("/users/:id", logger, async (req, res) => {
//   try {
//     const result = await query(`SELECT * FROM users WHERE id=$1`, [
//       req.params.id,
//     ]);

//     if (!result.rows.length) {
//       return sendResponse(res, 404, false, "User not found");
//     }

//     sendResponse(res, 200, true, "User fetched", result.rows[0]);
//   } catch (err: any) {
//     sendResponse(res, 500, false, err.message);
//   }
// });

// Update user
app.put("/users/:id", logger, async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await query(
      `UPDATE users SET name=$1,email=$2 WHERE id=$3 RETURNING *`,
      [name, email, req.params.id],
    );

    if (!result.rows.length) {
      return sendResponse(res, 404, false, "User not found");
    }

    sendResponse(res, 200, true, "User updated", result.rows[0]);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
});

// Delete user
app.delete("/users/:id", logger, async (req, res) => {
  try {
    const result = await query(`DELETE FROM users WHERE id=$1`, [
      req.params.id,
    ]);

    if (!result.rowCount) {
      return sendResponse(res, 404, false, "User not found");
    }

    sendResponse(res, 200, true, "User deleted");
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
});

/* ================= TODOS ================= */

// Create todo
app.post("/todos", logger, async (req, res) => {
  try {
    const { user_id, title } = req.body;

    const result = await query(
      `INSERT INTO todos(user_id,title) VALUES($1,$2) RETURNING *`,
      [user_id, title],
    );

    sendResponse(res, 201, true, "Todo created", result.rows[0]);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
});

// Get all todos
app.get("/todos", logger, async (req, res) => {
  try {
    const result = await query(`SELECT * FROM todos`);
    sendResponse(res, 200, true, "Todos fetched", result.rows);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
});

// Get single todo
app.get("/todos/:id", logger, async (req, res) => {
  try {
    const result = await query(`SELECT * FROM todos WHERE id=$1`, [
      req.params.id,
    ]);

    if (!result.rows.length) {
      return sendResponse(res, 404, false, "Todo not found");
    }

    sendResponse(res, 200, true, "Todo fetched", result.rows[0]);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
});

// Update todo ✅ FIXED
app.put("/todos/:id", logger, async (req, res) => {
  try {
    const { title, completed } = req.body;

    const result = await query(
      `UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING *`,
      [title, completed, req.params.id],
    );

    if (!result.rows.length) {
      return sendResponse(res, 404, false, "Todo not found");
    }

    sendResponse(res, 200, true, "Todo updated", result.rows[0]);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
});

// Delete todo
app.delete("/todos/:id", logger, async (req, res) => {
  try {
    const result = await query(`DELETE FROM todos WHERE id=$1`, [
      req.params.id,
    ]);

    if (!result.rowCount) {
      return sendResponse(res, 404, false, "Todo not found");
    }

    sendResponse(res, 200, true, "Todo deleted");
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
});

/* ================= 404 ================= */

app.use((req, res) => {
  sendResponse(res, 404, false, "Route not found");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
