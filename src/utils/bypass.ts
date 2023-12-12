import { Request, Response, NextFunction } from "express";
import Admin from "../apis/admin/dal";
import AppError from "./app_error";
import verifyToken from "./verify_token";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Token
    let token: string = "";

    // Get the authorizatoin from request header
    const authorization: string = req.headers.authorization as string;

    // Get the token
    if (authorization && authorization.split(" ")[0] === "Bearer") {
      token = authorization.split(" ")[1];
    }

    // Check token
    if (!token) return next(new AppError("Please login.", 400));

    // Verify token
    const decodedData = verifyToken(token);

    if (decodedData.user === "admin") {
      // Check if the admin exists
      const admin = await Admin.getAdmin(decodedData.id);
      if (!admin) return next(new AppError("Admin does not exists", 400));

      req.user = admin;
    }

    next();
  } catch (error) {
    next(error);
  }
};
