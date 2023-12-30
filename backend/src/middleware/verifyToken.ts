import Jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["userInfo"];
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }
  try {
    const verified = Jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};
