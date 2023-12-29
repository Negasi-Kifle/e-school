import { RequestHandler } from "express";
import AppError from "../../utils/app_error";
import Users from "./dal";
import generate_password from "../../utils/generate_password";
import configs from "../../configs";
import generate_token from "../../utils/generate_token";
import IUsersDoc from "./dto";
import School from "../schools/dal";
import checkOwnership from "../students/utils/check_ownership";
import User from "./model";

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

// Get profile data
export const getProfileData: RequestHandler = async (req, res, next) => {
  try {
    const loggedInUser = <IUsersDoc>req.user; // Data of the logged in user

    // Get user data
    const user = await Users.getUserById(loggedInUser.id);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Get user by id
export const getUserById: RequestHandler = async (req, res, next) => {
  try {
    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check the logged in user has the previlege for this operation
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Fetch user data
    const user = await Users.getUserById(req.params.id, school.id);
    if (!user) return next(new AppError("User not found", 404));

    // Response
    res.status(200).json({
      status: "SUCCESS",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Delete all users in DB
export const deleteAllOwners: RequestHandler = async (req, res, next) => {
  try {
    // Delete all owners
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
    // Delete owner
    const deletedOwner = await Users.deleteOwnerById(req.params.id);
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

// Delete all users in DB - only for trust admins
export const deleteAllUsers: RequestHandler = async (req, res, next) => {
  try {
    // Role from request query
    const { role } = req.query;

    // Delete users
    await Users.deleteAllUsers(role as string);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: `All users with ${role} role deleted permanently`,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a user in a tenant
export const deleteUserById: RequestHandler = async (req, res, next) => {
  try {
    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check the logged in user has the previlege for this operation
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // User can not delete him/herself
    if (loggedInUser.id === req.params.userId)
      return next(new AppError("You can not delete yourself", 400));

    // Delete user
    const user = await Users.deleteUserById(req.params.userId, school.id);
    if (user.deletedCount === 0)
      return next(new AppError("User does not exist", 404));

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "User deleted premanently",
    });
  } catch (error) {
    next(error);
  }
};

// Get all users in DB
export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    // Get all users in DB
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
    if (!user) return next(new AppError("Could not find your account", 404));

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "Your profile has been updated successfully",
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

    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("Unknown school selected", 404));

    // Check the logged in user has the previlege for this operation
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    data.tenant_id = school.id; // Assign school id to tenant_id

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
    // Check school exist
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check the logged in user has the previlege for this operation
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

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
    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("Unknown school selected", 404));

    // Check the logged in user has the previlege for this operation
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

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

// Reset user password - by owner or superadmin
export const resetUserPassword: RequestHandler = async (req, res, next) => {
  try {
    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check the logged in use the previlege for this operation
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Check user exists
    const userInDb = await Users.getUserById(req.params.userId, school.id);
    if (!userInDb) return next(new AppError("User does not exist", 404));

    // Check user is not resetting his/her password
    if (userInDb.id === loggedInUser.id)
      return next(new AppError("You can not reset your own password", 400));

    const password = generate_password(); // Generate random password

    // Reset user password
    const user = await Users.resetPassword(userInDb, password);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: `Password of ${user.first_name} has been reset successfully`,
      data: { user },
      default_password: password,
    });
  } catch (error) {
    next(error);
  }
};

// Reset owner password
export const resetOwnerPasssword: RequestHandler = async (req, res, next) => {
  try {
    // Get user id from request body
    const { user_id } = <UserRequests.IResetPassword>req.value;

    // Check owner exists
    const ownerInDb = await Users.getUserById(user_id);
    if (!ownerInDb) return next(new AppError("Owner does not exist", 404));

    // Check user role
    if (ownerInDb.role !== "Owner")
      return next(
        new AppError(
          "You can not reset password of users other than owner",
          400
        )
      );

    // Generate random password
    const password = generate_password();

    // Reset owner password
    const owner = await Users.resetPassword(ownerInDb, password);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "Owner password has been reset successfully",
      data: { owner },
      default_password: password,
    });
  } catch (error) {
    next(error);
  }
};
