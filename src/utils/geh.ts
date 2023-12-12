import configs from "../configs";
import AppError from "./app_error";
import { Request, Response, NextFunction } from "express";

// Error for development environment
const sendDevError = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    errorStack: err.stack,
  });
};

// Error for production enviroment
const sendProdError = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "ERROR",
      message: "Opps, somthing went wrong. Please try again",
    });
  }
};

/**
 * Error handler middleware
 */
export default (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "ERROR";

  if (err.message.includes("E11000")) {
    if (err.message.includes("phone_number")) {
      err = new AppError("Phone number already used", 400);
    } else if (err.message.includes("email")) {
      err = new AppError("Email already used", 400);
    } else {
      err = new AppError("Duplicate data found", 400);
    }
  }

  if (configs.env === "development" || configs.env === "local") {
    // Send error for different scenarios
    sendDevError(err, res);
  } else if (configs.env === "production" || configs.env === "qa") {
    sendProdError(err, res);
  }
};
