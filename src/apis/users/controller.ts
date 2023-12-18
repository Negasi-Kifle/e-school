import { RequestHandler } from "express";
import AppError from "../../utils/app_error";
import Users from "./dal";
import generate_password from "../../utils/generate_password";
import configs from "../../configs";
import generate_token from "../../utils/generate_token";
import IUsersDoc from "./dto";
import School from "../schools/dal";

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
    const owner = await Users.getUserById(req.params.id);
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

    await Users.deleteAllOwners();

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

// Get all users in DB
export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await Users.getAllUsers(req.query);

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

// Login for users
export const login: RequestHandler = async (req, res, next) => {
  try {
    // Incoming data
    const data = <UserRequests.ILogin>req.value;

    // Find user by phone number
    const user = await Users.getByPhoneNum(data.phone_num);

    // Check user exists and has provided valid credential
    if (!user || !user.comparePassword(data.password, user.password)) {
      return next(new AppError("Invalid credential", 400));
    }

    // Generate token
    const token = generate_token({ id: user.id, role: user.role });

    // Set is_credential_changed field to false
    user.is_credential_changed = false;
    await user.save();

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "Logged in successfully",
      data: { user },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
export const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    const loggedInUser = <IUsersDoc>req.user; // Logged in user

    // Incoming data
    const data = <UserRequests.IUpdateProfile>req.value;

    // Update user
    const user = await Users.updateProfile(loggedInUser.id, data);
    if (!user) return next(new AppError("User does not exist", 404));

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Change password
export const changePswd: RequestHandler = async (req, res, next) => {
  try {
    // Incoming data
    const data = <UserRequests.IChangePswd>req.value;

    // Logged in user
    const loggedInUser = <IUsersDoc>req.user;

    // Check password
    if (!loggedInUser.comparePassword(data.curr_pswd, loggedInUser.password))
      return next(new AppError("Current password is not correct", 400));

    // Update user password
    const user = await Users.changePswd(data.new_pswd, loggedInUser);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "You have successfully changed your password",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Create user in a tenant
export const createUser: RequestHandler = async (req, res, next) => {
  try {
    // Incoming data
    const data = <UserRequests.ICreateUser>req.value;

    const tenantId = req.params.tenantId; // Tenant id from req.params

    // If it is an owner trying to create a user, check he/she owns the school
    const loggedInUser = <IUsersDoc>req.user;
    if (
      loggedInUser.role === "Owner" &&
      (!loggedInUser.tenant_id || loggedInUser.tenant_id !== tenantId)
    ) {
      return next(new AppError("You don't own the school", 400));
    }

    // Check school exists
    const school = await School.getSchool(data.tenant_id);
    if (!school) return next(new AppError("Unknown school selected", 404));
    data.tenant_id = school.id;

    // Generate password
    data.password = generate_password();

    // Create user
    const user = await Users.createUser(data);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "User account created successfully",
      data: { user },
      default_password: data.password,
    });
  } catch (error) {
    next(error);
  }
};

// Delete users in tenant
export const deleteTenantUsers: RequestHandler = async (req, res, next) => {
  try {
    // Check delete key
    const { delete_key } = <UserRequests.IDeleteAll>req.value;
    if (delete_key !== configs.delete_key)
      return next(new AppError("Please provide a valid delete key", 400));

    // If it is an owner trying to delete all users of the tenant, check he/she owns the school
    const loggedInUser = <IUsersDoc>req.user;
    const tenantId = req.params.tenantId; // Tenant id from req.params

    if (
      loggedInUser.role === "Owner" &&
      (!loggedInUser.tenant_id || loggedInUser.tenant_id !== tenantId)
    ) {
      return next(new AppError("You don't own the school", 400));
    }

    // Delete tenant users
    await Users.deleteTenantUsers(req.params.tenantId);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "All users in the selected tenant deleted permanently",
    });
  } catch (error) {
    next(error);
  }
};

// Get all users of a tenant
export const getTenantUsers: RequestHandler = async (req, res, next) => {
  try {
    // If it is an owner trying to delete all users of the tenant, check he/she owns the school
    const loggedInUser = <IUsersDoc>req.user;
    const tenantId = req.params.tenantId; // Tenant id from req.params

    if (
      loggedInUser.role === "Owner" &&
      (!loggedInUser.tenant_id || loggedInUser.tenant_id !== tenantId)
    ) {
      return next(new AppError("You don't own the school", 400));
    }

    const tenantUsers = await Users.getTenantUsers(req.params.tenantId);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      results: tenantUsers.length,
      data: { tenantUsers },
    });
  } catch (error) {
    next(error);
  }
};
