import { Pool } from "pg";
import config from ".";
// Database
export const pool = new Pool({
  connectionString: config.connection_str,
});

// Helper for queries
export const query = (text: string, params?: any[]) => pool.query(text, params);

// Init DB
const initDB = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
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

export default initDB;
