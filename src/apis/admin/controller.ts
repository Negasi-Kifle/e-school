import { RequestHandler } from "express";
import AppError from "../../utils/app_error";
import Admin from "./dal";
import IAdminDoc from "./dto";
import generateToken from "../../utils/generate_token";
import configs from "../../configs";
import generate_password from "../../utils/generate_password";

export const createAdminFirstAccount: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    // Get body
    const { first_name, last_name, email, phone_number, first_account } = <
      AdminRequest.ICreateFirstAdminInput
    >req.value;

    // Default password
    const default_password = generate_password();

    // Make sure to include first_account if there are no admins in the DB
    const admins = await Admin.getAllAdmins();
    if (admins.length === 0) {
      if (!first_account) {
        return next(
          new AppError(
            "First account field can not be empty or false since you are the first admin in the system.",
            401
          )
        );
      }
    } else if (admins.length > 0) {
      if (first_account) {
        return next(
          new AppError(
            "You can not use the first account field since there is an admin already in the system with the flag",
            401
          )
        );
      }
    }

    // Create an admin
    const newAdmin: IAdminDoc = await Admin.createFirstAdmin({
      first_name,
      last_name,
      email,
      phone_number,
      first_account,
      default_password,
    });

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "New admin account is successfully created",
      data: {
        admin: newAdmin,
      },
      default_password,
    });
  } catch (error) {
    next(error);
  }
};

// Create an admin
export const createAdmin: RequestHandler = async (req, res, next) => {
  try {
    // Get body
    const { first_name, last_name, phone_number, email, role } = <
      AdminRequest.ICreateAdminInput
    >req.value;

    // Default password
    const default_password = generate_password();

    // Create an admin
    const newAdmin = await Admin.createAdmin({
      first_name,
      last_name,
      phone_number,
      email,
      role,
      default_password,
    });

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: `${newAdmin.first_name}'s account is successfully created with ${role} role`,
      data: {
        admin: newAdmin,
      },
      default_password,
    });
  } catch (error) {
    next(error);
  }
};

// Admin login
export const adminLogin: RequestHandler = async (req, res, next) => {
  try {
    // Get body
    const { email_or_phone, password } = <AdminRequest.IAdminLogin>req.value;

    // Check if there is an admin
    const admin = await Admin.getAdminByEmailOrPhoneNumber(email_or_phone);
    if (!admin || !admin.comparePassword(password, admin.password))
      return next(
        new AppError("Invalid email / phone number or password", 401)
      );

    // Update email phone number changed at to false if it is true
    if (admin.email_phone_number_changed_at) {
      await Admin.updateEmailOrPhoneNumberChangedAt(admin.id);
    }

    // Generate token
    const token = generateToken({ id: admin._id, role: admin.role });

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "You have successfully logged in",
      data: {
        admin,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Get all admins
export const getAllAdmins: RequestHandler = async (req, res, next) => {
  try {
    const admins = await Admin.getAllAdmins(<RequestQuery>req.query);

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      results: admins.length,
      data: {
        admins,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single admin
export const getAdmin: RequestHandler = async (req, res, next) => {
  try {
    const admin = await Admin.getAdmin(req.params.id);
    if (!admin)
      return next(new AppError("There is no Admin with the specified ID", 404));

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      data: {
        admin,
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
    const { default_password, password, password_confirm } = <
      AdminRequest.IUpdateDefaultPassword
    >req.value;

    // Check password
    const getAdmin = <IAdminDoc>req.user;
    if (!getAdmin.comparePassword(default_password, getAdmin.password))
      return next(new AppError("Incorrect default password", 401));

    // Update password
    const admin = await Admin.updateDefaultPassword(
      getAdmin,
      password,
      password_confirm
    );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message:
        "You have successfully updated your default password. Please login.",
      data: {
        admin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update admin profile
export const updateAdminProfile: RequestHandler = async (req, res, next) => {
  try {
    // Get body
    const { first_name, last_name } = <AdminRequest.IUpdateAdminProfile>(
      req.body
    );

    // User
    const user = <IAdminDoc>req.user;

    // Update
    const admin = await Admin.updateAdminProfile(user.id, {
      first_name,
      last_name,
    });

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "You have updated your profile successfully",
      data: {
        admin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update phone or email
export const updateEmailOrPhoneNumber: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    // Get body
    const { phone_number, email } = <AdminRequest.IUpdateEmailOrPhoneNumber>(
      req.value
    );

    // user
    const user = <IAdminDoc>req.user;

    // Check if the phone number or email is changed
    let email_phone_number_changed_at: boolean = false;
    let message: string = "You have updated your profile successfully.";
    if (user.email !== email || user.phone_number !== phone_number) {
      email_phone_number_changed_at = true;
      message =
        "You have updated your profile successfully. Please login again.";
    }

    // Update
    const admin = await Admin.updateEmailOrPhoneNumber(
      user.id,
      email_phone_number_changed_at,
      {
        phone_number,
        email,
      }
    );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message,
      data: {
        admin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update admin role
export const updateAdminRole: RequestHandler = async (req, res, next) => {
  try {
    // Get body
    const { role, id } = <AdminRequest.IUpdateAdminRole>req.value;

    // check if the admins exists
    const getAdmin = await Admin.getAdmin(id);
    if (!getAdmin)
      return next(new AppError("There is no Admin with the specified ID", 404));

    // Check if the user is the first account
    if (getAdmin.first_account)
      return next(
        new AppError(
          "Your default role is Super-admin. It can not be changed",
          400
        )
      );

    // Check if the user is trying to change its own role
    const user = <IAdminDoc>req.user;
    if (user.id === id)
      return next(new AppError("You can not change your own role.", 401));

    // Update
    const admin = await Admin.updateAdminRole(getAdmin.id, role);

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: `${getAdmin.first_name} ${getAdmin.last_name}'s role is updated from ${getAdmin.role} to ${admin?.role}`,
      data: {
        admin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update admin password
export const updateAdminPassword: RequestHandler = async (req, res, next) => {
  try {
    // Get body
    const { current_password, password, password_confirm } = <
      AdminRequest.IUpdateAdminPassword
    >req.value;

    // user
    const user = <IAdminDoc>req.user;

    // Check the current password
    if (!user.comparePassword(current_password, user.password))
      return next(new AppError("Invalid current password.", 401));

    // Update
    const admin = await Admin.updateAdminPassword(
      user,
      password,
      password_confirm
    );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message:
        "You have successfully updated your password. Please login again",
      data: {
        admin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Reset admin password
export const resetAdminPassword: RequestHandler = async (req, res, next) => {
  try {
    // Get body
    const { id } = <AdminRequest.IResetAdminPassword>req.value;

    // check if the admins exists
    const getAdmin = await Admin.getAdmin(id);
    if (!getAdmin)
      return next(new AppError("There is no Admin with the specified ID", 404));

    // Check if the admin id and the admin resetting id are similar
    const user = <IAdminDoc>req.user;
    if (id === user.id)
      return next(new AppError("You can not reset your own password", 401));

    // Default password
    const default_password = generate_password();

    // Reset
    const admin = await Admin.resetAdminPassword(getAdmin, default_password);

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "You have successfully resetted your password",
      data: {
        admin,
      },
      default_password,
    });
  } catch (error) {
    next(error);
  }
};

// Update admin account status
export const updateAdminAccountStatus: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    // Get body
    const { id, account_status } = <AdminRequest.IUpdateAccountStatus>req.value;

    // check if the admins exists
    const getAdmin = await Admin.getAdmin(id);
    if (!getAdmin)
      return next(new AppError("There is no Admin with the specified ID", 404));

    // Message
    let message: string = `Unknown status`;
    if (account_status === "Active") {
      message = `${getAdmin.first_name} ${getAdmin.last_name}'s account is successfully activated`;
    } else if (account_status === "Inactive") {
      message = `${getAdmin.first_name} ${getAdmin.last_name}'s account is successfully deactivated`;
    } else {
      return next(new AppError(`Unknown account status`, 400));
    }

    // Check if the admin id and the admin resetting id are similar
    const user = <IAdminDoc>req.user;
    if (id === user.id)
      return next(
        new AppError("You can not change the status of your own account", 401)
      );

    // Check if the admin account is first account
    if (getAdmin.first_account)
      return next(
        new AppError(
          "The default account status for the first account is Active. You can not change it.",
          401
        )
      );

    // Update
    const admin = await Admin.updateAdminAccountStatus(
      getAdmin.id,
      account_status
    );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message,
      data: {
        admin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete an admin permanently
export const deleteAdmin: RequestHandler = async (req, res, next) => {
  try {
    const currentAdmin = <IAdminDoc>req.user;

    const admin = await Admin.deleteAdmin(req.params.id);
    if (!admin)
      return next(new AppError("There is no admin with the specified ID", 404));

    if (admin._id === currentAdmin.id) {
      return next(new AppError("You can not delete your self.", 400));
    }

    if (admin.first_account) {
      return next(
        new AppError(
          "You can not delete an admin who holds the first account",
          403
        )
      );
    }

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "Admin account is successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};

// Delete all admins except for the first account
export const deleteAllAdmins: RequestHandler = async (req, res, next) => {
  try {
    // Get delete key
    const { delete_key } = <AdminRequest.IDeleteAllAdmins>req.value;

    // Check the validity of the delete key
    if (configs.delete_key !== delete_key)
      return next(new AppError("Invalid delete key", 401));

    // Check if the admin is first account holder
    const user = <IAdminDoc>req.user;
    if (!user.first_account)
      return next(
        new AppError(
          "The administrator with the first account on the system can only delete admins",
          401
        )
      );

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message:
        "All admin accounts are deleted except for the first account created on the system",
    });
  } catch (error) {
    next(error);
  }
};
