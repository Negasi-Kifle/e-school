import { Request, Response, NextFunction } from "express";
import Admin from "../apis/admin/dal";
import AppError from "./app_error";
import verifyToken from "./verify_token";
import User from "../apis/users/dal";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trustRoles = ["Super-admin", "Admin", "Call-center"];
    const clientRoles = [
      "Owner",
      "Director",
      "Teacher",
      "Assistant",
      "Teacher",
    ];

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

    if (trustRoles.includes(decodedData.role)) {
      // Check if the admin exists
      const admin = await Admin.getAdmin(decodedData.id);
      if (!admin) return next(new AppError("Admin does not exists", 400));

      // Check if the default password is true
      if (admin.is_default_password)
        return next(
          new AppError(
            "You are still using the default password. Please update it.",
            400
          )
        );

      // Check account status
      if (admin.account_status === "Inactive")
        return next(
          new AppError(
            "You account is deactivated. Please contact your superior to activate it.",
            401
          )
        );

      // Check if email or phone number is changed
      if (admin.email_phone_number_changed_at)
        return next(
          new AppError(
            "You have changed your email or phone number. Please login again.",
            400
          )
        );

      // Check if admin change his or her password
      if (admin.checkPasswordChangedAt(decodedData.iat as number)) {
        return next(
          new AppError(
            "You have changed your password recently. Please login.",
            400
          )
        );
      }

      // Attach admin on request object
      req.user = admin;
    } else if (clientRoles.includes(decodedData.role)) {
      // Get client
      const user = await User.getUserById(decodedData.id);
      if (!user) return next(new AppError("User does not exist", 400));

      // Check the account status of the user
      if (user.status === "Inactive") {
        return next(
          new AppError(
            "Your account is Inactive. Communicate with the admins to Activate it",
            403
          )
        );
      }

      // If user is trying to change password, skip other validations
      if (req.url === "/changepswd") {
        req.user = user;
        return next();
      }

      if (user.is_credential_changed) {
        // Check if credential is changed
        return next(
          new AppError(
            "You have changed your credential recently. Please login again",
            400
          )
        );
      }

      // Check user is not using the default password
      if (user.is_default_pswd) {
        return next(new AppError("Please change your default password", 400));
      }

      // Attach client on request object
      req.user = user;
    } else {
      return next(new AppError("Unknown user", 403));
    }

    next();
  } catch (error) {
    next(error);
  }
};
