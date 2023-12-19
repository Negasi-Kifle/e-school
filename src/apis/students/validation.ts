import Joi from "joi";

// Validate the API that's used to create student data
export const validateCreateAPI = Joi.object({
  first_name: Joi.string().required().messages({
    "any.required": "First name is required",
    "string.empty": "First name is required",
  }),
  last_name: Joi.string().required().messages({
    "any.required": "Last name is required",
    "string.empty": "Last name is required",
  }),
  level: Joi.string()
    .valid("KG", "Elementary", "High School", "Preparatory")
    .required()
    .messages({
      "any.required": "Level is required",
      "string.empty": "Level is required",
      "any.only": "Level must one of: KG, Elementary, High School, Preparatory",
    }),
  grade: Joi.string().required().messages({
    "any.required": "What grade is the student in?",
    "string.empty": "What grade is the student in?",
  }),
  sex: Joi.string().valid("Male", "Female").required().messages({
    "any.required": "What is the sex of the student?",
    "string.empty": "What is the sex of the student?",
    "any.only": "Sex must either Male or Female",
  }),
  parent: Joi.string().required().messages({
    "any.required": "Who raises the student?",
    "string.empty": "Who raises the student?",
  }),
  parent_relation: Joi.string().required().messages({
    "any.required":
      "Sepcify the relation b/n the student and his/her care taker. Like Mother, Father, etc.",
    "string.empty":
      "Sepcify the relation b/n the student and his/her care taker. Like Mother, Father, etc.",
  }),
  tenant_id: Joi.string().required().messages({
    "any.required": "Which school does the student go?",
    "string.empty": "Which school does the student go?",
  }),
  prof_img: Joi.object({
    secure_url: Joi.string().required().messages({
      "any.required": "Secure url of profile image is required",
      "string.empty": "Secure url of profile image is required",
    }),
    public_id: Joi.string().required().messages({
      "any.required": "Public id of profile image is required",
      "string.empty": "Public id of profile image is required",
    }),
  }),
});
