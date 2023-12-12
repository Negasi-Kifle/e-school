import { RequestHandler } from "express";
import Joi from "joi";
import AppError from "./app_error";

// Validates data on incoming requests
export default (joiSchema: Joi.Schema): RequestHandler => {
  return (req, res, next) => {
    const { value, error } = joiSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.message, 400));
    }
    req.value = value;
    next();
  };
};
