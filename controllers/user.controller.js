import { editUserValidationSchema } from "#helpers/DataValidation";
import { UserModel } from "#models";

import { ErrorResponse, STATUS_CODE } from "#utils";

const { BAD_REQUEST, UNAUTHORIZED, OK, INTERNAL_SERVER_ERROR } = STATUS_CODE;

export const GetUser = async (req, res) => {

	console.log("get user", req.query);

	const { id } = req.query;
	if (!id) return res.status(BAD_REQUEST).send(ErrorResponse("User id is required"));

	try {
		const user = await UserModel.findOne({ user_id: id.toLowerCase() })
		if (!user) return res.status(BAD_REQUEST).send(ErrorResponse(`User with id ${id} not found`));
		return res.status(OK).send(user);
	} catch (e) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(e.message));
	}
};

export const EditUser = async (req, res) => {

	const { user_id : id } = req.query;

	console.log("edit user", req.body);

	const { error } = editUserValidationSchema.validate(req.body);
	if (error) return res.status(BAD_REQUEST).send(ErrorResponse(error.message));

	//check if matric number exists
	const matricExist = await UserModel.findOne({ user_id: id.toLowerCase() });
	if (!matricExist) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Edit user failed: User does not exist!`));
	}

	const filter = { user_id: id.toLowerCase() };
	const update = req.body;
	const options = { new: true };

	try {
		UserModel.findOneAndUpdate(filter, update, options).then((data, err) => {
			if (err) {
				return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Something wrong when updating user data: ${err.message}`));
			}
			return res.status(OK).send(data);
		});
	} catch (e) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`User Edit Failed: ${e.message}`));
	}
};

export default {
	EditUser,
	GetUser,
};
