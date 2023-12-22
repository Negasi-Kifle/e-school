import Joi, { string } from "joi";

// Validate the create API
export const validateCreateAPI = Joi.object({
  pack_name: Joi.string().required().messages({
    "any.required": "Package name is required",
    "string.empty": "Package name is required",
  }),
  num_of_months: Joi.number().min(1).max(12).required().messages({
    "any.required": "Number of months is required",
    "string.empty": "Number of months is required",
    "number.min": "Number of months must be greater than or equal to 1",
    "number.max": "Number of months must be less than or equal to 12",
  }),
  discount: Joi.number().min(0).max(100).messages({
    "number.min": "Discount must be greater than or equal to zero",
    "number.max": "Discount must be less than or equal to 100",
  }),
});

// Validate the API that's for updating a package
export const validateUpdateAPI = Joi.object({
  pack_name: Joi.string().messages({
    "string.empty": "Package name is required",
  }),
  num_of_months: Joi.number().min(1).max(12).messages({
    "number.min": "Number of months must be greater than or equal to 1",
    "number.max": "Number of months must be less than or equal to 12",
  }),
  discount: Joi.number().min(0).max(100).messages({
    "number.min": "Discount must be greater than or equal to zero",
    "number.max": "Discount must be less than or equal to 100",
  }),
});
