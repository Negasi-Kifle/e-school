import Joi from "joi";

export const createFirstAdminValidation = Joi.object({
  first_name: Joi.string().required().messages({
    "any.required": "First name is required",
    "string.empty": "FIrst name is required",
    "string.base": "First name must of type string",
  }),
  last_name: Joi.string().required().messages({
    "any.required": "Last name is required",
    "string.empty": "Last name is required",
    "string.base": "Last name must of type string",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
  }),
  phone_number: Joi.string().required().messages({
    "any.required": "Phone number is required",
    "string.empty": "Phone number is required",
    "strin.base": "Phone number must be in string format",
  }),
  first_account: Joi.boolean().valid(true).required().messages({
    "any.required": "First account flag is required",
    "boolean.base": "First account flag must be boolean",
    "any.only": "First account must be true",
  }),
});

export const createAdminValidation = Joi.object({
  first_name: Joi.string().required().messages({
    "any.required": "First name is required",
    "string.empty": "FIrst name is required",
    "string.base": "First name must of type string",
  }),
  last_name: Joi.string().required().messages({
    "any.required": "Last name is required",
    "string.empty": "Last name is required",
    "string.base": "Last name must of type string",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
  }),
  phone_number: Joi.string().required().messages({
    "any.required": "Phone number is required",
    "string.empty": "Phone number is required",
    "strin.base": "Phone number must be in string format",
  }),
  role: Joi.string().required().valid("Super-admin", "Admin").messages({
    "any.required": "Role is required",
    "string.base": "Role must of string type",
    "string.empty": "Role is required",
    "any.only": "Role must either Super-admin or Admin",
  }),
});

export const adminLoginValidation = Joi.object({
  email_or_phone: Joi.string().required().messages({
    "any.required": "Email or phone number is required",
    "string.empty": "Email or phone number is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password is required",
  }),
});

export const updateDefaultPasswordValidation = Joi.object({
  default_password: Joi.string().required().messages({
    "any.required": "Default password is required",
    "string.empty": "Default password is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "New password is required",
    "string.empty": "New password is required",
    "string.base": "New password must be string",
  }),
  password_confirm: Joi.string()
    .required()
    .equal(Joi.ref("password"))
    .messages({
      "any.required": "Please confirm your new password",
      "string.empty": "Please confirm your new password",
      "string.base": "Password confirmation must be string",
    }),
});

export const updateEmailOrPhoneNumberValidation = Joi.object({
  phone_number: Joi.string().required().messages({
    "any.required": "Phone number is required",
    "string.empty": "Phone number is required",
    "string.base": "Phone number must be of string type",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.empty": "Email is required",
  }),
});

export const updateAdminRoleValidation = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "Admin id is required",
    "string.empty": "Admin id is required",
  }),
  role: Joi.string().required().valid("Super-admin", "Admin").messages({
    "any.required": "Role is required",
    "string.empty": "Role is required",
    "any.only": "Role must either Super-admin or Admin",
  }),
});

export const updateAdminPasswordValidation = Joi.object({
  current_password: Joi.string().required().messages({
    "any.required": "Current passwod is required",
    "string.empty": "Current passwod is required",
    "string.base": "Current password must be of string type",
  }),
  password: Joi.string().required().messages({
    "any.required": "New passwod is required",
    "string.empty": "New passwod is required",
    "string.base": "New password must be of string type",
  }),
  password_confirm: Joi.string()
    .required()
    .equal(Joi.ref("password"))
    .messages({
      "any.required": "Please confirm your new password",
      "string.empty": "Please confirm your new password",
      "string.base": "Password confirmation must be of string type",
      "any.only": "Password and password confirm must match",
    }),
});

export const resetAdminPasswordValidation = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "Admin id is required",
    "string.empty": "Admin id is required",
    "string.base": "Admin id must be of string type",
  }),
});

export const updateAdminAccountStatusValidation = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "Admin id is required",
    "string.empty": "Admin id is required",
    "string.base": "Admin id must be of string type",
  }),
  account_status: Joi.string().valid("Active", "Inactive").required().messages({
    "any.required": "Account status is required",
    "string.empty": "Account status is required",
    "any.only": "Account status must be either Active or Inactive",
  }),
});

export const deleteAllAdminsValidation = Joi.object({
  delete_key: Joi.string().required().messages({
    "any.required": "Delete key is required",
    "string.empty": "Delete key is required",
    "string.base": "Delete key must be of string type",
  }),
});
