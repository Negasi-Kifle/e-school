import { RequestHandler } from "express";
import AppError from "../../utils/app_error";
import Users from "./dal";
import generate_password from "../../utils/generate_password";

// Create user doc
export const createUser: RequestHandler = async (req, res, next) => {
  try {
    // Incoming data
    const data = <UserRequests.ICreateInput>req.value;

    // Generate password and add it to the password field
    data.password = generate_password();

    // Create user
    const user = await Users.createUser(data);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "New user created successfully",
      data: { user },
      default_password: data.password,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await Users.getAllUsers();

    // Response
    res.status(200).json({
      status: "SUCCESS",
      results: users.length,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};
