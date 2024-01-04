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
      "any.only":
        "Level must be one of: KG, Elementary, High School, Preparatory",
    }),
  grade: Joi.string()
    .when("level", {
      is: "KG",
      then: Joi.string().valid("KG 1", "KG 2", "KG 3").required().messages({
        "any.required": "What grade is the student in?",
        "string.empty": "What grade is the student in?",
        "any.only": "Grade must be one of: KG 1, KG 2, KG 3",
      }),
    })
    .when("level", {
      is: "Elementary",
      then: Joi.string()
        .valid("1", "2", "3", "4", "5", "6", "7", "8")
        .required()
        .messages({
          "any.required": "What grade is the student in?",
          "string.empty": "What grade is the student in?",
          "any.only": "Grade must be from 1 to 8 for Elementary level",
        }),
    })
    .when("level", {
      is: "High School",
      then: Joi.string().valid("9", "10").required().messages({
        "any.required": "What grade is the student in?",
        "string.empty": "What grade is the student in?",
        "any.only": "Grade must be either 9 or 10 for High School level",
      }),
    })
    .when("level", {
      is: "Preparatory",
      then: Joi.string().valid("11", "12").required().messages({
        "any.required": "What grade is the student in?",
        "string.empty": "What grade is the student in?",
        "any.only": "Grade must be either 11 or 12 for Preparatory level",
      }),
    })
    .required()
    .messages({
      "any.required": "Grade is required",
    }),
  sex: Joi.string().valid("Male", "Female").required().messages({
    "any.required": "What is the sex of the student?",
    "string.empty": "What is the sex of the student?",
    "any.only": "Sex must either Male or Female",
  }),
  parent_phone_num: Joi.string().required().messages({
    "any.required": "Phone number of parent is required",
    "string.empty": "Phone number of parent is required",
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

// Validate the API that's used to create student data
export const validateUpdateAPI = Joi.object({
  first_name: Joi.string().messages({
    "string.empty": "First name can not be empty",
  }),
  last_name: Joi.string().messages({
    "string.empty": "Last name can not be empty",
  }),
  level: Joi.string()
    .valid("KG", "Elementary", "High School", "Preparatory")
    .messages({
      "string.empty": "Level can not be empty",
      "any.only": "Level must one of: KG, Elementary, High School, Preparatory",
    }),
  grade: Joi.string().messages({
    "string.empty": "What grade is the student in?",
  }),
  sex: Joi.string().valid("Male", "Female").messages({
    "string.empty": "Sex of a student can not be empty",
    "any.only": "Sex must either Male or Female",
  }),
  parent: Joi.string().messages({
    "string.empty": "Student parent can not be empty",
  }),
  parent_relation: Joi.string().messages({
    "string.empty": "Relation b/n a student and parent can not be empty",
  }),
  tenant_id: Joi.string().messages({
    "string.empty": "School can not be empty",
  }),
  prof_img: Joi.object({
    secure_url: Joi.string().messages({
      "string.empty": "Secure url of profile image can not be empty",
    }),
    public_id: Joi.string().messages({
      "string.empty": "Public id of profile image can not be empty",
    }),
  }),
});

// Validate the API that's for deleting all studnets in DB
export const validateDeleteAllAPI = Joi.object({
  delete_key: Joi.string().required().messages({
    "any.required": "Please provide a valid delete key",
    "string.empty": "Please provide a valid delete key",
  }),
});
