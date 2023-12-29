import Joi from "joi";


export const createParentValidation = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  address: Joi.string().required(),
  phone_number: Joi.string().required(),
  password: Joi.string().required(),
  password_confirm: Joi.string().required().equal(Joi.ref('password')),
});

export const parentLoginValidation = Joi.object({
  phone_number: Joi.string().required(),
  password: Joi.string().required(),
});

export const updateDefaultPasswordValidation = Joi.object({
  default_password: Joi.string().required(),
  password: Joi.string().required(),
  password_confirm: Joi.string().required().equal(Joi.ref('password')),
});

export const updatePhoneNumberValidation = Joi.object({
  phone_number: Joi.string().required(),
});

export const updatePasswordValidation = Joi.object({
  current_password: Joi.string().required(),
  password: Joi.string().required(),
  password_confirm: Joi.string().required().equal(Joi.ref('password')),
});

export const resetParentPasswordValidation = Joi.object({
  id: Joi.string().required(),
});

export const updateParentAccountStatusValidation = Joi.object({
  id: Joi.string().required(),
  account_status: Joi.string().required(),
});

export const deleteAllParentsValidation = Joi.object({
  delete_key: Joi.string().required(),
});
