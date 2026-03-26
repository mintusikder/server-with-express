import express, { Request, Response } from "express";
import { Pool } from "pg";
const app = express();
import dotenv from "dotenv";
import path from "path";
import { error } from "console";
dotenv.config({ path: path.join(process.cwd(), ".env") });
const port = 5000;

const pool = new Pool({
  connectionString: `${process.env.DB_URL}`,
});
// pool.on('connect', () => {
//   console.log('Database connected successfully! ✅');
// });
// pool.on("error", (error, client) => {
//   console.log(error);
// });
//create table
const initDB = async () => {
  try {
    // console.log("start")
    // await pool.connect()
    // const res = await pool.query('SELECT NOW()');
    // console.log('Database Connected Successfully at:', res.rows[0].now);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
    // console.log(await pool.query ("select * from users"))
    await pool.query(`
                  CREATE TABLE IF NOT EXISTS todos(
                  id SERIAL PRIMARY KEY,
                  user_id INT REFERENCES users(id) ON DELETE CASCADE, 
                  title VARCHAR(200) NOT NULL,
                  description TEXT,
                  completed BOOLEAN DEFAULT false,
                  due_data DATE,
                  created_at TIMESTAMP DEFAULT NOW(),
                  updated_at TIMESTAMP DEFAULT NOW()
                  )
              `);
  } catch (error) {
    console.log(error);
  }
};
initDB();
//parser
app.use(express.json());
// app.use(express.urlencoded())

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World ff!");
});
//users CRUD
app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  console.log(req.body);
  try {
    const result = await pool.query(
      `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
      [name, email],
    );
    // console.log(result.rows[0]);
    res.status(201).json({
      success: false,
      message: "data insert success",
      data: result.rows[0],
    });
    // res.send({
    //   message: "data insert",
    // });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
//data niye asa get CRUD
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    res.status(200).json({
      success: true,
      message: "Users reseved success",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
});
//get single users
app.get("/users/:id", async (req: Request, res: Response) => {
  // console.log(req.params.id);
  // res.send({
  //   message: "Api is cool---",
  // });
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    req.params.id,
  ]);
  try {
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User success",
        data : result.rows[0]
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
