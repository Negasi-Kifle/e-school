import Joi from "joi";

// Validate the API that create a user data
export const validateCreateAPI = Joi.object({
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
  role: Joi.string().required().messages({
    "any.required": "Role is requried",
    "string.empty": "Role is requried",
  }),
  tenant_id: Joi.string().required(),
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
