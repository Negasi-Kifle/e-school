import Joi from "joi";

// Validate the API that's for creating a PCO
export const validateCreateAPI = Joi.object({
  pmt_title: Joi.string().max(30).required().messages({
    "any.required": "Give title to the payment collection order",
    "string.empty": "Give title to the payment collection order",
    "string.max":
      "Title of payment collection order should not exceed 30 characters",
  }),
  description: Joi.string().required().messages({
    "any.required": "Describe the payment collection order",
    "string.empty": "Describe the payment collection order",
  }),
  start_date: Joi.date().min("now").required().messages({
    "any.required": "Start date of the payment collection order is required",
    "date.min": "Start date can not be in the past",
  }),
  deadline: Joi.date().min(Joi.ref("start_date")).required().messages({
    "any.required": "Deadline of the payment collection order is required",
    "date.min": "Deadline can not be before the start date",
  }),
  amount: Joi.number().min(1).required().messages({
    "any.required": "Amount of payment is required",
    "number.min": "Amount of payment must be greater than zero",
  }),
  penality: Joi.number().min(1).messages({
    "number.min": "Penality must be greater than zero",
  }),
  levels: Joi.array()
    .min(1)
    .items("KG", "Elementary", "High School", "Preparatory", "All")
    .required()
    .messages({
      "any.required": "Level of students expected to pay is required",
      "array.min": "Please select at leas one level",
      "array.includes":
        "Level must be either of KG, Elementary, High School, Preparatory, All",
    }),
  grades: Joi.array().required().min(1).messages({
    "any.required": "Grade of students is required",
    "array.min": "Grade of students is required",
  }),
  tenant_id: Joi.string().required().messages({
    "any.required": "School is required",
    "string.empty": "School is required",
  }),
  pmt_package: Joi.string().messages({
    "string.empty": "Payment package can not be empty",
  }),
  pmt_package_deadline: Joi.date().min("now").messages({
    "date.empty": "Deadline for the payment package can not be empty",
  }),
});
