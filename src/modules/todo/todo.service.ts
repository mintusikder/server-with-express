import { query } from "../../config/db";

const createTodo = async (payload: Record<string, unknown>) => {
  const { user_id, title } = payload;
  const result = await query(
    `INSERT INTO todos(user_id,title) VALUES($1,$2) RETURNING *`,
    [user_id, title],
  );
  return result;
};

const getTodo = async () => {
  const result = await query(`SELECT * FROM todos`);
  return result;
};
const getSingleTodo = async (id: string) => {
  const result = await query(`SELECT * FROM todos WHERE id=$1`, [id]);
  return result;
};
const updateTodo = async (title: string, completed: string, id: string) => {
  const result = await query(
    `UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING *`,
    [title, completed, id],
  );
  return result;
};
const deleteTodo = async (id: string) => {
  const result = await query(`DELETE FROM todos WHERE id=$1`, [id]);
  return result;
};
export const todoService = {
  createTodo,
  getTodo,
  getSingleTodo,
  updateTodo,
  deleteTodo,
};
