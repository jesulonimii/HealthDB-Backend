import { adminLoginValidationSchema } from "#helpers/DataValidation";
import bcrypt from "bcryptjs";
import { AdminModel } from "#models";

import { ErrorResponse, STATUS_CODE } from "#utils";

const { BAD_REQUEST, CONFLICT, UNAUTHORIZED, OK, INTERNAL_SERVER_ERROR } = STATUS_CODE;

export const AdminLogin = async (req, res) => {


	const { error } = adminLoginValidationSchema.validate(req.body);
	if (error) return res.status(BAD_REQUEST).send(ErrorResponse(error.message));

	//check if staff email exists

	const admin = await AdminModel.findOne({ email: req.body?.email.toLowerCase() });
	if (!admin) return res.status(UNAUTHORIZED).send(ErrorResponse(`Staff Login Failed: We couldn't find any account matching the details provided.`));


	const validPassword = await bcrypt.compare(req.body.password, admin?.password);
	if (!validPassword) return res.status(UNAUTHORIZED).send(ErrorResponse(`Staff Login Failed: We couldn't find any account matching the details provided.`));


	console.log("staff logged in", admin);
	res.status(OK).send(admin);

};


export default {
	AdminLogin
};