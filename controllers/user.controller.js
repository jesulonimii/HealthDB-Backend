import { editUserValidationSchema, notifyStudentValidationSchema } from "#helpers/DataValidation";
import { UserModel } from "#models";

import { ErrorResponse, STATUS_CODE, SuccessResponse } from "#utils";
import { createFCMNotificationMessage, sendFCMPushNotification } from "#helpers/FCMPushNotificationTool";

const { BAD_REQUEST, UNAUTHORIZED, OK, INTERNAL_SERVER_ERROR } = STATUS_CODE;

export const GetUser = async (req, res) => {

	console.log("get user", req.query);

	const id = req.query.id ?? req.query.user_id;
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

	const id = req.query.id ?? req.query.user_id;

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

export const GetUserNotifications = async (req, res) => {

	const id = req.query.id ?? req.query.user_id;

	if (!id) return res.status(BAD_REQUEST).send(ErrorResponse("User id is required"));

	try {
		const user = await UserModel.findOne({ user_id: id.toLowerCase() })
		if (!user) return res.status(BAD_REQUEST).send(ErrorResponse(`User with id ${id} not found`));
		return res.status(OK).send(user?.notifications);
	} catch (e) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(e.message));
	}
}

export const NotifyUser = async (req, res) => {


	const { user_id } = req.query;
	if (!user_id) return  res.status(BAD_REQUEST).send(ErrorResponse("User ID is required"))

	const { error } = notifyStudentValidationSchema.validate(req.body);
	if (error) return res.status(BAD_REQUEST).send(ErrorResponse(error.message));

	//check if user exists
	const userExist = await UserModel.findOne({ user_id: user_id.toLowerCase() });
	if (!userExist) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Prescription creation failed: User does not exist!`));
	}



	const filter = { user_id: user_id.toLowerCase() };
	const options = { new: true };

	const notification_title = req.body.title
	const notification_message = req.body?.message

	const update = {
		notifications: [
			...userExist?.notifications,
			{
				title: notification_title,
				date: new Date(),
				message : notification_message,
			}
		]
	};


	try {
		UserModel.findOneAndUpdate(filter, update, options).then((data, err) => {
			if (err) {
				return res
					.status(INTERNAL_SERVER_ERROR)
					.send(ErrorResponse(`Something wrong when creating prescription: ${err.message}`));
			}

			//send push notification
			const pushNotificationToken = userExist?.push_notifications_token
			if (pushNotificationToken){
				sendFCMPushNotification(pushNotificationToken, createFCMNotificationMessage(
					pushNotificationToken,
					notification_title,
					notification_message
				)).then((res) => {
					if (res === "DeviceNotRegistered"){
						UserModel.findOneAndUpdate(filter, { push_notifications_token: null }, options).then((data, err) => {
							if (err) {
								return res
									.status(INTERNAL_SERVER_ERROR)
									.send(ErrorResponse(`Something wrong when updating push notification token for unregistered-device: ${err.message}`));
							}

						})
					}
					else {
						console.log("Notification sent successfully", res)
					}
				})
			}




			return res.status(OK).send(SuccessResponse("Student notified successfully"));
		});
	} catch (e) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Student notification failed: ${e.message}`));
	}



}


export default {
	EditUser,
	GetUser,
	GetUserNotifications
};
