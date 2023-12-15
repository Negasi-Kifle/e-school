import { RequestHandler } from "express";
import AppError from "../../utils/app_error";
import Users from "./dal";
import generate_password from "../../utils/generate_password";
import configs from "../../configs";

// Create user doc
export const createOwner: RequestHandler = async (req, res, next) => {
  try {
    // Incoming data
    const data = <UserRequests.ICreateOwnerInput>req.value;

    // Generate password and add it to the password field
    data.password = generate_password();

    // Create user
    const owner = await Users.createUser(data);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "New owner created successfully",
      data: { owner },
      default_password: data.password,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
export const getAllOwners: RequestHandler = async (req, res, next) => {
  try {
    const owners = await Users.getAllOwners(req.query);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      results: owners.length,
      data: { owners },
    });
  } catch (error) {
    next(error);
  }
};

// Get user by id
export const getOwnerById: RequestHandler = async (req, res, next) => {
  try {
    const owner = await Users.getOwnerById(req.params.id);
    if (!owner) return next(new AppError("Owner not found", 404));

    // Response
    res.status(200).json({
      status: "SUCCESS",
      data: { owner },
    });
  } catch (error) {
    next(error);
  }
};

// Delete all users in DB
export const deleteAllOwners: RequestHandler = async (req, res, next) => {
  try {
    const { delete_key } = <UserRequests.IDeleteAll>req.value;
    // Check delete key
    if (delete_key !== configs.delete_key) {
      return next(new AppError("Please provide a valid delete key", 400));
    }

    await Users.deleteAll();

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "All owners in DB deleted permanently",
    });
  } catch (error) {
    next(error);
  }
};

// Delete by id
export const deleteOwnerById: RequestHandler = async (req, res, next) => {
  try {
    const deletedOwner = await Users.deleteById(req.params.id);

    if (!deletedOwner) return next(new AppError("Owner does not exist", 404));

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "Owner deleted permanently",
    });
  } catch (error) {
    next(error);
  }
};
