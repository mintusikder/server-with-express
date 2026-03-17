import express, { Request, Response } from "express";
import { Pool } from "pg";
const app = express();
const port = 5000;

const pool = new Pool({
  connectionString: `postgresql://neondb_owner:npg_p4V6NGOYsILi@ep-icy-glitter-an2qt46p-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require`,
});
//create table
const initDB = async () => {
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
//   await pool.query(`
//                 CREATE TABLE IF NOT EXISTS todos(
//                 id SERIAL PRIMARY KEY,
//                 user_id INT
//                 )
//             `);
};
initDB();
//parser
app.use(express.json());
// app.use(express.urlencoded())

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World ff!");
});

app.post("/", (req: Request, res: Response) => {
  console.log(req.body);
  res.status(201).json({
    success: true,
    message: "Api is work",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
