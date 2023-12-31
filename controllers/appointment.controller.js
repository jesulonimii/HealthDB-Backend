import {
	appointmentValidationSchema,
	createPrescriptionValidationSchema,
	medicalReportValidationSchema,
} from "#helpers/DataValidation";
import { AppointmentModel, UserModel } from "#models";

import { ErrorResponse, SOCKET_EVENT_KEYS, STATUS_CODE, SuccessResponse } from "#utils";
import { createFCMNotificationMessage, sendFCMPushNotification } from "#helpers/FCMPushNotificationTool";

const { BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, OK, INTERNAL_SERVER_ERROR } = STATUS_CODE;

export const CreateAppointment = async (req, res) => {

	const { user_id } = req.query;

	const { error } = appointmentValidationSchema.validate(req.body);
	if (error) return res.status(BAD_REQUEST).send(ErrorResponse(error.message));


	const filter = { user_id: user_id.toLowerCase().trim() };
	const update = {
		pending_appointment: req.body
	};
	const options = { new: true, upsert: true };


	//check that user exists before creating appointment
	const userExist = await UserModel.findOne(filter);
	if (!userExist) {
		return res
			.status(NOT_FOUND)
			.send(ErrorResponse(`Appointment Creation Failed: User specified for appointment creation does not exists!`));
	}


	try {

		UserModel.findOneAndUpdate(filter, update, options).then((data, err) => {
			if (err) {
				return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Something wrong when updating User appointment data: ${err.message}`));
			}

			const appointment_filter = { appointment_id : req.body?.appointment_id };
			const appointment_update = {
				...req.body,
				student_info : data
			};
			const appointment_options = { new: true, upsert: true };

			AppointmentModel.findOneAndUpdate(appointment_filter, appointment_update, appointment_options).then((data, err) => {
				if (err) {
					return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Something wrong when setting appointment data: ${err.message}`));
				}
				//send live alert to dashboard
				try {
					const socket = req.app.get('socket')
					socket.emit(SOCKET_EVENT_KEYS.appointments_update, data)
				}
				catch (e) {
					console.log("Socket Error", e)
				}

				return res.status(OK).send(data);
			});

		});

	} catch (e) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Appointment Creation Failed: ${e.message}`));
	}
};

export const GetAllAppointments = async (req, res) => {

	try {
		const appointments = await AppointmentModel.find();
		if (!appointments) return res.status(BAD_REQUEST).send(ErrorResponse("No Appointments found"));

		return res.status(OK).send(appointments);
	} catch (e) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Appointments Retrieval Failed: ${e.message}`));
	}
}

export const GetAppointment = async (req, res) => {
	const { id } = req.query;
	if (!id) return res.status(BAD_REQUEST).send(ErrorResponse("Appointment ID is required"));

	try {
		const appointment = await AppointmentModel.findOne({ appointment_id: id.trim() });
		if (!appointment) return res.status(BAD_REQUEST).send(ErrorResponse("Appointment not found"));

		return res.status(OK).send(appointment);
	} catch (e) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Appointment Retrieval Failed: ${e.message}`));
	}
}

export const DeletePendingAppointment = async (req, res) => {
	const { user_id } = req.query;


	//const { error } = appointmentValidationSchema.validate(req.body);
	//if (error) return res.status(BAD_REQUEST).send(ErrorResponse(error.message));


	const filter = { user_id: user_id.toLowerCase().trim() };
	const update = {
		pending_appointment: null
	};
	const options = { new: true};

	try {

		UserModel.findOneAndUpdate(filter, update, options).then((data, err) => {
			if (err) {
				return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Something wrong when updating User appointment data: ${err.message}`));
			}

			AppointmentModel.deleteOne({ appointment_id : req.body.appointment_id }).then((data, err) => {
				//send update alert to dashboard
				try {
					const socket = req.app.get('socket')
					socket.emit(SOCKET_EVENT_KEYS.appointments_update, data)
				}
				catch (e) {
					console.log("Socket Error", e)
				}


			})

			return res.status(OK).send(data);
		});

	} catch (e) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Appointment delete Failed: ${e.message}`));
	}
}

export const CreateMedicalReport = async (req, res) => {

	console.log("CreateMedicalReport", req.body);

	const { user_id } = req.query;
	if (!user_id) return  res.status(BAD_REQUEST).send(ErrorResponse("User ID is required"))

	const { error } = medicalReportValidationSchema.validate(req.body);
	if (error) return res.status(BAD_REQUEST).send(ErrorResponse(error.message));

	//check if matric number exists
	const userExist = await UserModel.findOne({ user_id: user_id.toLowerCase() });
	if (!userExist) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Medical report creation for user failed: User does not exist!`));
	}

	const filter = { user_id: user_id.toLowerCase() };
	const options = { new: true };

	const update = {
		medical_history: {
			...userExist?.medical_history,
			doctors_notes: [
				...userExist?.medical_history?.doctors_notes,
				req.body
			]
		}
	};


	try {
		UserModel.findOneAndUpdate(filter, update, options).then((data, err) => {
			if (err) {
				return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Something wrong when creating medical report: ${err.message}`));
			}
			return res.status(OK).send(SuccessResponse("Medical report created successfully"));
		});
	} catch (e) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Medical report creation failed: ${e.message}`));
	}




}

export const CreatePrescription = async (req, res) => {


	const { user_id } = req.query;
	if (!user_id) return  res.status(BAD_REQUEST).send(ErrorResponse("User ID is required"))

	const { error } = createPrescriptionValidationSchema.validate(req.body);
	if (error) return res.status(BAD_REQUEST).send(ErrorResponse(error.message));

	//check if user exists
	const userExist = await UserModel.findOne({ user_id: user_id.toLowerCase() });
	if (!userExist) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Prescription creation failed: User does not exist!`));
	}



	const filter = { user_id: user_id.toLowerCase() };
	const options = { new: true };

	const notification_title = "You have a new prescription! 💊"
	const notification_message = `You have a new prescription to be picked up for your latest appointment at the health center:
	\nAppointment ID: ${req.body?.appointment_id}	 
	\n\nShow this notification to the attendant at the pharmacy to pick up your prescription.
	\nYou are to receive: ${req.body?.name}
	\nDetails: ${req.body?.details}
	\nAny other additional information would be given to you by the attendant at the pharmacy.
	\n\nPlease not that this prescription is only valid for 5 days from the date of issue.
	\nThank you for visiting, Wishing you speeding recovery! 🤗
	`

	const update = {
		notifications: [
			...userExist?.notifications,
			{
				title: notification_title,
				date: new Date(),
				message : notification_message,
			}
		],
		medical_history: {
			...userExist?.medical_history,
			previous_medications: [
				...userExist?.medical_history?.previous_medications,
				req.body
			]
		}
	};


	try {
		UserModel.findOneAndUpdate(filter, update, options).then((data, err) => {
			if (err) {
				return res
					.status(INTERNAL_SERVER_ERROR)
					.send(ErrorResponse(`Something wrong when creating prescription: ${err.message}`));
			}

			//send live alert to dashboard
			try {

				const alertInfo = {
					...req.body,
					student_info : data
				}

				const socket = req.app.get('socket')
				socket.emit(SOCKET_EVENT_KEYS.prescription_update, alertInfo)
			}
			catch (e) {
				//console.log("Socket Error", e)
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




			return res.status(OK).send(SuccessResponse("Prescription created successfully"));
		});
	} catch (e) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Prescription creation failed: ${e.message}`));
	}



}

export const FinishAppointment = async (req, res) => {

	console.log("FinishAppointment", req.body);

	const { user_id } = req.query;
	if (!user_id) return  res.status(BAD_REQUEST).send(ErrorResponse("User ID is required"))

	const { error } = appointmentValidationSchema.validate(req.body);
	if (error) return res.status(BAD_REQUEST).send(ErrorResponse(error.message));


	//check if matric number exists
	const userExist = await UserModel.findOne({ user_id: user_id.toLowerCase() });
	if (!userExist) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Appointment finish failed: User does not exist!`));
	}




	const filter = { user_id: user_id.toLowerCase() };
	const options = { new: true };

	const update = {
		pending_appointment: null,
		appointments: [
			...userExist?.appointments,
			req.body,
		],
};

	//send push notification
	const notification_title = "Your appointment was successfully completed! 🎉"
	const notification_message = `Your appointment at the health center with id
	\nAppointment ID: ${req.body?.appointment_id}	 
	\nwas successfully completed. Thank you for visiting! 🤗
	`


	try {
		UserModel.findOneAndUpdate(filter, update, options).then((data, err) => {
			if (err) {
				return res
					.status(INTERNAL_SERVER_ERROR)
					.send(ErrorResponse(`Something wrong when ending Appointment: ${err.message}`));
			}

			console.log("reachysss");


			AppointmentModel.deleteOne({ appointment_id : req.body.appointment_id }).then((data, err) => {

				if (err) {
					return res
						.status(INTERNAL_SERVER_ERROR)
						.send(ErrorResponse(`Something wrong when deleting Appointment: ${err.message}`));
				}

				//send live alert to dashboard
				try {

					const socket = req.app.get('socket')
					socket.emit(SOCKET_EVENT_KEYS.appointments_update, {})
				}
				catch (e) {
					//console.log("Socket Error", e)
				}

			})
			console.log("reachysbbbb");


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
						console.log("Notification status:", res)
					}
				})
			}


			return res.status(OK).send(SuccessResponse("Appointment ended successfully"));
		});
	} catch (e) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Appointment end failed: ${e.message}`));
	}

}


export default {
	CreateAppointment,
	DeletePendingAppointment,
	GetAppointment,
	CreateMedicalReport,
	CreatePrescription,
	FinishAppointment,
};
