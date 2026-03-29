import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authToken = req.headers.authorization;
      const token = authToken?.trim().split(" ")[1]
      console.log({ authToken: token });
      if (!token) {
        return res.status(500).json({ message: "Yow are na allow" });
      }
      const decoded = jwt.verify(token, config.jwtSecret as string);
      console.log({ decoded });
      req.user = decoded as JwtPayload;
      next();
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Unauthorized: Invalid or expired token",
      });
    }
  };
};

export default auth;
