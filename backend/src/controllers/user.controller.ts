import { Request, Response } from "express";
import Jwt from "jsonwebtoken";

// ==== Function starts here ==== //

const getUser = async (req: Request, res: Response) => {
  try {
    const token = await req.cookies["userInfo"];

    if (!token) {
      return null;
    }
    const decodedToken = await Jwt.verify(token, process.env.JWT_SECRET!);
    console.log(decodedToken);
    res.status(200).json({ decodedToken });
  } catch (error) {
    return null;
  }
};

export { getUser };
