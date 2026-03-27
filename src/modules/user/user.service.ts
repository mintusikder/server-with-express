import { query } from "../../config/db";

const createUser = async (name: string, email: string) => {
  const result = await query(
    `INSERT INTO users(name,email) VALUES($1,$2) RETURNING *`,
    [name, email],
  );
  return result;
};

export const userServices = {
  createUser,
};
