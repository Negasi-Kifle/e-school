import Joi from "joi";
import configs from "../../configs";

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
    .unique()
    .min(1)
    .items("KG", "Elementary", "High School", "Preparatory", "All")
    .required()
    .messages({
      "any.required": "Level of students expected to pay is required",
      "array.min": "Please select at leas one level",
      "array.includes":
        "Level must be either of KG, Elementary, High School, Preparatory, All",
      "array.unique": "Level can not be selected more than once",
    }),
  grades: Joi.array()
    .unique()
    .min(1)
    .items(
      "KG 1",
      "KG 2",
      "KG 3",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "All"
    )
    .required()
    .messages({
      "any.required": "Grade of students is required",
      "array.min": "Grade of students is required",
      "array.unique": "Grade can not be selected more than once",
      "array.includes": "Grade must from KG 1 up to 12",
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

// Validate the API that's for creating a PCO
export const validateUpdateAPI = Joi.object({
  pmt_title: Joi.string().max(30).messages({
    "string.empty": "Give title to the payment collection order",
    "string.max":
      "Title of payment collection order should not exceed 30 characters",
  }),
  description: Joi.string().messages({
    "string.empty": "Describe the payment collection order",
  }),
  start_date: Joi.date().min("now").messages({
    "date.min": "Start date can not be in the past",
  }),
  deadline: Joi.date().min(Joi.ref("start_date")).messages({
    "date.min": "Deadline can not be before the start date",
  }),
  amount: Joi.number().min(1).messages({
    "number.min": "Amount of payment must be greater than zero",
  }),
  penality: Joi.number().min(1).messages({
    "number.min": "Penality must be greater than zero",
  }),
  levels: Joi.array()
    .min(1)
    .items("KG", "Elementary", "High School", "Preparatory", "All")
    .messages({
      "array.min": "Please select at leas one level",
      "array.includes":
        "Level must be either of KG, Elementary, High School, Preparatory, All",
    }),
  grades: Joi.array().min(1).messages({
    "array.min": "Grade of students is required",
  }),
  tenant_id: Joi.string().messages({
    "string.empty": "School is required",
  }),
  pmt_package: Joi.string().messages({
    "string.empty": "Payment package can not be empty",
  }),
  pmt_package_deadline: Joi.date().min("now").messages({
    "date.empty": "Deadline for the payment package can not be empty",
    "date.min": "Deadline for the payment package can not be in the past",
  }),
});

// Validate the API that's for deleting all PCOs in DB and tenant
export const validateDeleteAll = Joi.object({
  delete_key: Joi.string().valid(configs.delete_key).required().messages({
    "any.required": "Please provide a valid delete key",
    "string.empty": "Please provide a valid delete key",
    "any.only": "Please provide a valid delete key",
  }),
});
