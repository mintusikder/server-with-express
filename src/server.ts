import express, { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
const port = 5000;

// Middleware
app.use(express.json());

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
};

// Database
const pool = new Pool({
  connectionString: process.env.DB_URL,
});

// Helper for queries
const query = (text: string, params?: any[]) => pool.query(text, params);

// Init DB
const initDB = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log("✅ Database initialized");
  } catch (err) {
    console.error("❌ DB Init Error:", err);
  }
};

initDB();

// Response helper
const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data?: any
) => {
  res.status(status).json({ success, message, data });
};

/* ================= USERS ================= */

// Create user
app.post("/users", logger, async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await query(
      `INSERT INTO users(name,email) VALUES($1,$2) RETURNING *`,
      [name, email]
    );

    sendResponse(res, 201, true, "User created", result.rows[0]);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
});

// Get all users
app.get("/users", logger, async (req, res) => {
  try {
    const result = await query(`SELECT * FROM users`);
    sendResponse(res, 200, true, "Users fetched", result.rows);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
});

// Get single user
app.get("/users/:id", logger, async (req, res) => {
  try {
    const result = await query(`SELECT * FROM users WHERE id=$1`, [
      req.params.id,
    ]);

    if (!result.rows.length) {
      return sendResponse(res, 404, false, "User not found");
    }

    sendResponse(res, 200, true, "User fetched", result.rows[0]);
  } catch (err: any) {
    sendResponse(res, 500, false, err.message);
  }
});

// Update user
app.put("/users/:id", logger, async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await query(
      `UPDATE users SET name=$1,email=$2 WHERE id=$3 RETURNING *`,
      [name, email, req.params.id]
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
      [user_id, title]
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
      [title, completed, req.params.id]
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