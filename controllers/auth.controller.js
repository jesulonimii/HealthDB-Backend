import { loginValidationSchema, signupValidationSchema } from "#helpers/DataValidation";
import bcrypt from "bcryptjs";
import { UserModel } from "#models";

import { ErrorResponse, STATUS_CODE } from "#utils";

const { BAD_REQUEST, UNAUTHORIZED, OK, INTERNAL_SERVER_ERROR } = STATUS_CODE;

export const Signup = async (req, res) => {
	const { error } = signupValidationSchema.validate(req.body);
	if (error) return res.status(STATUS_CODE.BAD_REQUEST).send(ErrorResponse(error.message));

	//check if matric number exists
	const matricExist = await UserModel.findOne({ user_id: req.body?.matric_number.toLowerCase() });
	if (matricExist) {
		return res
			.status(STATUS_CODE.INTERNAL_SERVER_ERROR)
			.send(ErrorResponse(`User SignUp Failed: Matric number already exists!`));
	}


	//hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	try {
		const user = new UserModel({
			user_id: req.body.matric_number.toLowerCase(),
			password: hashedPassword,
			personal_info: {
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				profile_image: "",
				date_of_birth: null,
				gender: null,
			},
			contact_info: {
				email: null,
				address: null,
				phone: null,
			},
			emergency_contacts: [],
			medical_history: {
				last_visit: null,
				allergies: [],
				hospitalizations: [],
			},
			notifications: [],
			appointments: [],
			health_centre_registration: {
				status: false,
				message: "Please visit the health centre to complete your registration.",
			},
			pending_appointment: null,
			completed_app_registration: true,
		});

		user.save()
			.then((result) => {
				console.log("successful", result);
				res.end(result);
			})
			.catch((err) => {
				return new Error(err.message);
			});
	} catch (e) {
		return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send({ error: `User SignUp Failed: ${e.message}` });
	}
};

export const Login = async (req, res) => {
	const { error } = loginValidationSchema.validate(req.body);
	if (error) return res.status(STATUS_CODE.BAD_REQUEST).send(ErrorResponse(error.message));

	//check if matric number exists

	const user = await UserModel.findOne({ user_id: req.body?.user_id.toLowerCase() });
	if (!user) return res.status(UNAUTHORIZED).send(ErrorResponse(`Login Failed: We couldn't find any account matching the details provided.`));


	const validPassword = await bcrypt.compare(req.body.password, user?.password);
	if (!validPassword) return res.status(UNAUTHORIZED).send(ErrorResponse(`Login Failed: We couldn't find any account matching the details provided.`));


	console.log("logged in", user);
	res.status(OK).send(user);

};


export default {
	Signup,
	Login
};