import Joi from "joi";

export const createSchoolValidation = Joi.object({
  school_name: Joi.string().required(),
  school_address: Joi.string().required(),
  license: Joi.string().required(),
  level: Joi.string().required().valid(
    "KG", "Elementary", "High-School", "Preparatory", "All"
  )
});

export const deleteAllSchoolsValidation = Joi.object({
  delete_key: Joi.string().required(),
});
