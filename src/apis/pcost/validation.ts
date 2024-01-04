import Joi from "joi";

export const createPCOSTValidation = Joi.object({
  pco: Joi.string().required().messages({
    "any.required": "Select the related PCO",
  }),
  student: Joi.string().required().messages({
    "any.required": "Select the related student",
  }),
  parent: Joi.string().required().messages({
    "any.required": "Select the related parent",
  }),
  is_paid: Joi.boolean().messages({
    "boolean.base": "The field is_paid must be boolean",
  }),
  is_before_deadline: Joi.boolean().messages({
    "boolean.base": "The field is_before_deadline must be boolean",
  }),
  paid_amount: Joi.number().min(0).messages({
    "number.min": "Paid amount must be greater than or equal to zero",
  }),
});

export const updatePCOSTValidation = Joi.object({
  pco: Joi.string().optional(),
  student: Joi.string().optional(),
  parent: Joi.string().optional(),
  is_paid: Joi.boolean().optional(),
  is_before_deadline: Joi.boolean().optional(),
  paid_amount: Joi.number().optional(),
});

export const deleteAllPCOSTsValidation = Joi.object({
  delete_key: Joi.string().required(),
});
