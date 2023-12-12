import { Request, Response, NextFunction } from "express";
import AppError from "./app_error";
import configs from "../configs";

/**
 * Validates API key
 * @param req Resquest object
 * @param res Response object
 * @param next Next function
 * @returns
 */
export default function checkAPIKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers["x-api-key"]) {
    return next(new AppError("Please provide valid API key", 403));
  }

  if (req.headers["x-api-key"] !== configs.api_key) {
    return next(new AppError("Please provide valid API key", 403));
  }
  next();
}
