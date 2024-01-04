import { RequestHandler } from "express";
import AppError from "../../utils/app_error";
import Parent from "./dal";
import IParentDoc from "./dto";
import generateToken from "../../utils/generate_token";
import configs from "../../configs";

import generate_password from "../../utils/generate_password";
import cloudinary from "../../utils/cloudinary";

// Create parent
export const createParent: RequestHandler = async (req, res, next) => {
  try {
    // Get body
    const input = <ParentRequest.ICreateParentInput>req.value;

    // Make sure to include first_account if there are no parents in the DB
    const parent = await Parent.getParentByPhoneNumber(input.phone_number);

    if (parent)
      return next(
        new AppError("There is a Parent with the specified Phone number", 404)
      );

    if (!req.file) {
      return next(new AppError("Please upload an image.", 400));
    }

    if (req.file) {
      const response = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "E_School/parents",
      });
      input.profile_img = {
        secure_url: response.secure_url,
        public_id: response.public_id,
      };
    }

    // Default password
    const default_password = generate_password();
    input.password = default_password;

    // Create an parent
    const newParent: IParentDoc = await Parent.createParent(input);

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "Parent account is successfully created.",
      data: {
        parent: newParent,
      },
      default_password,
    });
  } catch (error) {
    next(error);
  }
};

// Parent login
export const parentLogin: RequestHandler = async (req, res, next) => {
  try {
    // Get body
    const { phone_number, password } = <ParentRequest.IParentLogin>req.value;

    // Check if there is an parent
    const parent = await Parent.getParentByPhoneNumber(phone_number);

    if (parent?.account_status === "Inactive") {
      return next(
        new AppError(
          "Your account has be deactivated please contact admin center.",
          401
        )
      );
    }

    if (!parent || !parent.comparePassword(password, parent.password))
      return next(new AppError("Invalid phone number or password", 401));

    // Update phone number changed at to false if it is true
    if (parent.phone_number_changed_at) {
      await Parent.updatePhoneNumberChangedAt(parent.id);
    }

    // Generate token
    const token = generateToken({
      id: parent._id,
      full_name: parent.first_name + " " + parent.last_name,
      role: "Parent",
    });

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "You have successfully logged in",
      data: {
        parent,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Get parent by phone number
export const getByPhoneNumber: RequestHandler = async (req, res, next) => {
  try {
    const { phone_num } = req.query; // Phone number from request query

    // Get parent by phone number
    const parent = await Parent.getParentByPhoneNumber(phone_num as string);
    if (!parent) return next(new AppError("Parent not found", 404));

    // Response
    res.status(200).json({
      status: "SUCCESS",
      data: { parent },
    });
  } catch (error) {
    next(error);
  }
};

// Get all parents
export const getAllParents: RequestHandler = async (req, res, next) => {
  try {
    const parents = await Parent.getAllParents(<RequestQuery>req.query);

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      results: parents.length,
      data: {
        parents,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single parent
export const getParent: RequestHandler = async (req, res, next) => {
  try {
    const parent = await Parent.getParent(req.params.id);
    if (!parent)
      return next(
        new AppError("There is no Parent with the specified ID", 404)
      );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        parent,
      },
    });
  } catch (error) {
    next(error);
  }
};

// update default password
export const updateDefaultPassword: RequestHandler = async (req, res, next) => {
  try {
    // Get body
    const { default_password, password } = <
      ParentRequest.IUpdateParentPassword
    >req.value;

    // check password
    const getParent = <IParentDoc>req.user;

    if (!(await Parent.comparePassword(default_password, getParent.password)))
      return next(new AppError("Incorrect default password", 401));

    // Update password
    const parent = await Parent.updateDefaultPassword(getParent, password);

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message:
        "You have successfully updated your default password. Please login.",
      data: {
        parent,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update phone or email
export const updatePhoneNumber: RequestHandler = async (req, res, next) => {
  try {
    // Get body
    const { phone_number } = <ParentRequest.IUpdatePhoneNumber>req.value;

    // user
    const user = <IParentDoc>req.user;

    // Check if the phone number is changed
    let phone_number_changed_at: boolean = false;
    let message: string = "You have updated your phone number successfully.";
    if (user.phone_number !== phone_number) {
      phone_number_changed_at = true;
      message =
        "You have updated your phone number successfully. Please login again.";
    }

    // Update
    const parent = await Parent.updatePhoneNumber(
      user.id,
      phone_number_changed_at,
      phone_number
    );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message,
      data: {
        parent,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update parent password
export const updateParentPassword: RequestHandler = async (req, res, next) => {
  try {
    // Get body
    const { current_password, password } = <ParentRequest.IUpdatePassword>(
      req.value
    );

    // user
    const user = <IParentDoc>req.user;

    // Check the current password
    if (!user.comparePassword(current_password, user.password))
      return next(new AppError("Invalid current password.", 401));

    // Update
    const parent = await Parent.updateParentPassword(user, password);

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message:
        "You have successfully updated your password. Please login again",
      data: {
        parent,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Reset parent password
export const resetParentPassword: RequestHandler = async (req, res, next) => {
  try {
    // Get body
    const { id } = <ParentRequest.IResetParentPassword>req.value;

    // check if the parents exists
    const getParent = await Parent.getParent(id);
    if (!getParent)
      return next(
        new AppError("There is no Parent with the specified ID", 404)
      );

    // Check if the parent id and the parent resetting id are similar
    const user = <IParentDoc>req.user;
    if (id === user.id)
      return next(new AppError("You can not reset your own password", 401));

    // Default password
    const default_password = generate_password();

    // Reset
    const parent = await Parent.resetParentPassword(
      getParent,
      default_password
    );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "You have successfully resetted your password",
      data: {
        parent,
      },
      default_password,
    });
  } catch (error) {
    next(error);
  }
};

// Update parent account status
export const updateParentAccountStatus: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    // Get body
    const { id, account_status } = <ParentRequest.IUpdateAccountStatus>(
      req.value
    );

    // check if the parents exists
    const getParent = await Parent.getParent(id);
    if (!getParent)
      return next(
        new AppError("There is no Parent with the specified ID", 404)
      );

    // Message
    let message: string = `Unknown status`;
    if (account_status === "Active") {
      message = `${getParent.first_name} ${getParent.last_name}'s account is successfully activated`;
    } else if (account_status === "Inactive") {
      message = `${getParent.first_name} ${getParent.last_name}'s account is successfully deactivated`;
    } else {
      return next(new AppError(`Unknown account status`, 400));
    }

    // Check if the parent id and the parent resetting id are similar
    const user = <IParentDoc>req.user;
    if (id === user.id)
      return next(
        new AppError("You can not change the status of your own account", 401)
      );

    // Update
    const parent = await Parent.updateParentAccountStatus(
      getParent.id,
      account_status
    );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message,
      data: {
        parent,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete an parent permanently
export const deleteParent: RequestHandler = async (req, res, next) => {
  try {
    const parent = await Parent.deleteParent(req.params.id);
    console.log(parent);
    if (!parent)
      return next(
        new AppError("There is no parent with the specified ID", 404)
      );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "Parent account is successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};

// Delete all parents except for the first account
export const deleteAllParents: RequestHandler = async (req, res, next) => {
  try {
    // Get delete key
    const { delete_key } = <ParentRequest.IDeleteAllParents>req.value;

    // Check the validity of the delete key
    if (configs.delete_key !== delete_key)
      return next(new AppError("Invalid delete key", 401));

    await Parent.deleteAllParents();

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "All parent accounts are deleted successfuly.",
    });
  } catch (error) {
    next(error);
  }
};

// Get students/children of a parent
export const getParentChildren: RequestHandler = async (req, res, next) => {
  try {
    // Get children of a parent
    const children = await Parent.getStudentsOfParent(req.params.parentId);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      results: children.length,
      data: { children },
    });
  } catch (error) {
    next(error);
  }
};
