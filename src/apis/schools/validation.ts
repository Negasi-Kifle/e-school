import Joi from "joi";

export const createSchoolValidation = Joi.object({
  school_name: Joi.string().required(),
  school_address: Joi.string().required(),
  license: Joi.string().required(),
  owner: Joi.string().required(),
  level: Joi.string().required().valid(
    "KG", "Elementary", "High-School", "Preparatory", "All"
  )
});

export const updateSchoolValidation = Joi.object({
  school_name: Joi.string().optional(),
  school_address: Joi.string().optional(),
  license: Joi.string().optional(),
  level: Joi.string().optional().valid(
    "KG", "Elementary", "High-School", "Preparatory", "All"
  )
});

export const changeSchoolStatus = Joi.object({
  status: Joi.string().required()
});

export const deleteAllSchoolsValidation = Joi.object({
  delete_key: Joi.string().required(),
});
