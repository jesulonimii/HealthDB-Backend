import Joi from "joi";

export const signupValidationSchema = Joi.object({
	first_name: Joi.string().required(),
	last_name: Joi.string().required(),
	matric_number: Joi.string().required(),
	password: Joi.string().min(8).required(),
});

export const loginValidationSchema = Joi.object({
	user_id: Joi.string().required(),
	password: Joi.string().required(),
});

export default {signupValidationSchema, loginValidationSchema};
