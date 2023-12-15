import Joi from "joi";

// Validate the API that create a user data
export const validateCreateOwnerAPI = Joi.object({
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
    .valid("Owner", "Director", "Teacher", "Assistant", "Teacher")
    .required()
    .messages({
      "any.required": "Role is required",
      "string.empty": "Role is required",
      "any.only":
        "Role must be one of 'Owner', 'Director', 'Assistant', or 'Teacher'",
    }),
  tenant_id: Joi.string().when("role", {
    is: Joi.not("Owner"),
    then: Joi.string().required().messages({
      "any.required": "Tenant ID is required",
      "string.empty": "Tenant ID is required",
    }),
    otherwise: Joi.string().allow("").optional(), // If role is not 'Owner', tenant_id is optional
  }),
  address: Joi.string().required().messages({
    "any.required": "Address is requried",
    "string.empty": "Address is requried",
  }),
  prof_img: Joi.object({
    secure_url: Joi.string().required().messages({
      "any.required": "Secure URL of profile image is requried",
      "string.empty": "Secure URL of profile image is requried",
    }),
    public_id: Joi.string().required().messages({
      "any.required": "Public Id of profile image is requried",
      "string.empty": "Public Id of profile image is requried",
    }),
  }).required(),
});

// Validate that deletes all users
export const validateDeleteAll = Joi.object({
  delete_key: Joi.string().required().messages({
    "any.required": "Please provide a valid delete key",
    "string.empty": "Please provide a valid delete key",
  }),
});
