import Joi from "joi";
import configs from "../../configs";

// Validate the API that create a user data
export const validateCreateUserAPI = Joi.object({
  first_name: Joi.string().required().messages({
    "any.required": "First name is requried",
    "string.empty": "First name is requried",
  }),
  last_name: Joi.string().required().messages({
    "any.required": "Last name is requried",
    "string.empty": "Last name is requried",
  }),
  phone_num: Joi.string().required().messages({
    "any.required": "Phone number is requried",
    "string.empty": "Phone number is requried",
  }),
  role: Joi.string()
    .valid("Owner", "Director", "Teacher", "Assistant", "Teacher", "Registrar")
    .required()
    .messages({
      "any.required": "Role is required",
      "string.empty": "Role is required",
      "any.only":
        "Role must be one of 'Owner', 'Director', 'Assistant', 'Registrar', or 'Teacher'",
    }),
  address: Joi.string().required().messages({
    "any.required": "Address is required",
    "string.empty": "Address is required",
  }),
  prof_img: Joi.object({
    secure_url: Joi.string().required().messages({
      "any.required": "Secure URL of profile image is required",
      "string.empty": "Secure URL of profile image is required",
    }),
    public_id: Joi.string().required().messages({
      "any.required": "Public Id of profile image is required",
      "string.empty": "Public Id of profile image is required",
    }),
  }).required(),
});

// Validate the API that deletes all users
export const validateDeleteAll = Joi.object({
  delete_key: Joi.string().valid(configs.delete_key).required().messages({
    "any.required": "Please provide a valid delete key",
    "string.empty": "Please provide a valid delete key",
    "any.only": "Please provide a valid delete key",
  }),
});

// Validate the login-api
export const validateLogin = Joi.object({
  phone_num: Joi.string().required().messages({
    "any.required": "Phone number is required",
    "string.empty": "Phone number is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password is required",
  }),
});

// Validate ypdate-profile API
export const validateUpdateProfileAPI = Joi.object({
  first_name: Joi.string().messages({
    "string.empty": "First can not be empty",
  }),
  last_name: Joi.string().messages({
    "string.empty": "Last name can not be empty",
  }),
  address: Joi.string().messages({
    "string.empty": "Address can not be empty",
  }),
});

// Validate the change_password API
export const validateChangePswdAPI = Joi.object({
  curr_pswd: Joi.string().required().messages({
    "any.required": "Please enter your current password",
    "string.empty": "Please enter your current password",
  }),
  new_pswd: Joi.string().required().messages({
    "any.required": "Please enter new password",
    "string.empty": "Please enter new password",
  }),
});

// Validate the password-reset API
export const validatePswdResetAPI = Joi.object({
  user_id: Joi.string().required().messages({
    "any.required": "Please provide user id",
    "string.empty": "Please provide user id",
  }),
});

// Validate the API that's for updating user status
export const validateUpdateUserStatusAPI = Joi.object({
  user_id: Joi.string().required().messages({
    "any.required": "User id is required",
    "string.empty": "User id is required",
  }),
  tenant_id: Joi.string().required().messages({
    "any.required": "School id is required",
    "string.empty": "School id is required",
  }),
  status: Joi.string().valid("Active", "Inactive").required().messages({
    "any.required": "Status is required",
    "string.empty": "Status is required",
    "any.only": "Status must be either Active or Inactive",
  }),
});

// Validate the API that's for updating user status
export const validateUpdateOwnerStatusAPI = Joi.object({
  owner_id: Joi.string().required().messages({
    "any.required": "Owner id is required",
    "string.empty": "Owner id is required",
  }),
  status: Joi.string().valid("Active", "Inactive").required().messages({
    "any.required": "Status is required",
    "string.empty": "Status is required",
    "any.only": "Status must be either Active or Inactive",
  }),
});
