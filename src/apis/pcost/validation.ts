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
  is_paid: Joi.boolean().required().messages({
    "any.required": "Select the related is paid",
  }),
  is_before_deadline: Joi.boolean().required().messages({
    "any.required": "Select the related is before deadline",
  }),
  paid_amount: Joi.number().required().messages({
    "any.required": "Select the related is paid amount",
  })
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
