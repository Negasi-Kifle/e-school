import Joi, { string } from "joi";

export const createParentValidation = Joi.object({
  first_name: Joi.string().required().messages({
    "any.required": "First name is required",
    "string.empty": "First name is required",
    "string.base": "First name must be string",
  }),
  last_name: Joi.string().required().messages({
    "any.required": "Last name is required",
    "string.empty": "Last name is required",
    "string.base": "Last name must be string",
  }),
  address: Joi.string().required().messages({
    "any.required": "Address is required",
    "string.empty": "Address is required",
    "string.base": "Address must be string",
  }),
  phone_number: Joi.string().required().messages({
    "any.required": "Phone number is required",
    "string.empty": "Phone number is required",
    "string.base": "Phone number must be string",
  }),
});

export const parentLoginValidation = Joi.object({
  phone_number: Joi.string().required(),
  password: Joi.string().required(),
});

export const updateDefaultPasswordValidation = Joi.object({
  default_password: Joi.string().required(),
  password: Joi.string().required(),
  password_confirm: Joi.string().required().equal(Joi.ref("password")),
});

export const updatePhoneNumberValidation = Joi.object({
  phone_number: Joi.string().required(),
});

export const updatePasswordValidation = Joi.object({
  current_password: Joi.string().required(),
  password: Joi.string().required(),
  password_confirm: Joi.string().required().equal(Joi.ref("password")),
});

export const resetParentPasswordValidation = Joi.object({
  id: Joi.string().required(),
});

export const updateParentAccountStatusValidation = Joi.object({
  id: Joi.string().required(),
  account_status: Joi.string().required(),
});

export const deleteAllParentsValidation = Joi.object({
  delete_key: Joi.string().required(),
});

// Validate forgot password
export const validateForgotPswd = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Please provide email address",
  }),
});


// Validate otp verification
export const validateOTPVerifier = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
  }),
  otp: Joi.string().required().messages({
    "any.required": "OTP is required",
  }),
});