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

export const editUserValidationSchema = Joi.object({
	student: Joi.object(),
	personal_info: Joi.object(),
	contact_info: Joi.object(),
	emergency_contacts: Joi.array(),
	medical_history: Joi.object(),
	notifications: Joi.array(),
	appointments: Joi.array(),
	health_centre_registration: Joi.object(),
	pending_appointment: Joi.object(),
	completed_app_registration: Joi.bool(),
});

export const appointmentValidationSchema = Joi.object({
	appointment_id: Joi.string().required(),
	date_time: Joi.date().required(),
});


export const adminLoginValidationSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

export const medicalReportValidationSchema = Joi.object({
	report: Joi.string().required(),
	date: Joi.date().required(),
	doctor: Joi.string().required(),
	appointment_id: Joi.string().required()
})

export const createPrescriptionValidationSchema = Joi.object({
	name: Joi.string().required(),
	details: Joi.string().required(),
	date: Joi.date().required(),
	appointment_id: Joi.string(),
});



export default {signupValidationSchema, loginValidationSchema, editUserValidationSchema, appointmentValidationSchema, adminLoginValidationSchema};
