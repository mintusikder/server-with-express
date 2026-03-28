import { query } from "../../config/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const loginUser = async (email: string, password: string) => {
  const result = await query(`SELECT * FROM users WHERE email=$1`, [email]);
  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return null;
  }
  const secret = " KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";
  const token = jwt.sign({ name: user.name, email: user.email }, secret, {
    expiresIn: "7d",
  });
  console.log({ token });
  return { token, user };
};

export const authServices = {
  loginUser
}