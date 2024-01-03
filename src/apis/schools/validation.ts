import Joi from "joi";

// Validate the API that's for creating a school by admins of trust
export const createSchoolValidation = Joi.object({
  school_name: Joi.string().required().messages({
    "any.required": "What is the name of the school?",
    "string.empty": "What is the name of the school?",
  }),
  school_address: Joi.string().required(),
  license: Joi.string().required(),
  owner: Joi.string().required().messages({
    "any.required": "Who owns the school?",
    "string.empty": "Who owns the school?",
  }),
  level: Joi.string()
    .required()
    .valid("KG", "Elementary", "High-School", "Preparatory", "All"),
});

// Validate the API that's for creating school by owner
export const createSchoolByOwnerValidation = Joi.object({
  school_name: Joi.string().required().messages({
    "any.required": "What is the name of the school?",
    "string.empty": "What is the name of the school?",
  }),
  school_address: Joi.string().required(),
  license: Joi.string().required(),
  level: Joi.array()
    .items("KG", "Elementary", "High-School", "Preparatory", "All")
    .min(1)
    .required()
    .messages({
      "any.required": "Please select at least one level",
      "array.includes":
        "Level must be either of KG, Elementary, High School, Preparatory, All",
    }),
});

export const updateSchoolValidation = Joi.object({
  school_name: Joi.string().optional(),
  school_address: Joi.string().optional(),
  license: Joi.string().optional(),
  level: Joi.string()
    .optional()
    .valid("KG", "Elementary", "High-School", "Preparatory", "All"),
});

export const changeSchoolStatus = Joi.object({
  status: Joi.string().required(),
});

export const deleteAllSchoolsValidation = Joi.object({
  delete_key: Joi.string().required(),
});
