import { appointmentValidationSchema } from "#helpers/DataValidation";
import { AppointmentModel, UserModel } from "#models";

import { ErrorResponse, STATUS_CODE } from "#utils";
import AppointmentController from "#controllers/appointment.controller";

const { BAD_REQUEST, UNAUTHORIZED, OK, INTERNAL_SERVER_ERROR } = STATUS_CODE;

export const CreateAppointment = async (req, res) => {

	const { user_id } = req.params;

	const { error } = appointmentValidationSchema.validate(req.body);
	if (error) return res.status(BAD_REQUEST).send(ErrorResponse(error.message));


	const filter = { user_id: user_id.toLowerCase().trim() };
	const update = {
		pending_appointment: req.body
	};
	const options = { new: true, upsert: true };


	try {

		UserModel.findOneAndUpdate(filter, update, options).then((data, err) => {
			if (err) {
				return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Something wrong when updating User appointment data: ${err.message}`));
			}

			const appointment_filter = { appointment_id : req.body?.appointment_id.toLowerCase() };
			const appointment_update = req.body;
			const appointment_options = { new: true, upsert: true };

			AppointmentModel.findOneAndUpdate(appointment_filter, appointment_update, appointment_options).then((data, err) => {
				if (err) {
					return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Something wrong when setting appointment data: ${err.message}`));
				}
				return res.status(OK).send(data);
			});

		});

	} catch (e) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Appointment Creation Failed: ${e.message}`));
	}
};

export const GetAppointment = async (req, res) => {
	const { id } = req.query;
	if (!id) return res.status(BAD_REQUEST).send(ErrorResponse("Appointment ID is required"));

	try {
		const appointment = await AppointmentModel.findOne({ appointment_id: id.toLowerCase().trim() });
		if (!appointment) return res.status(BAD_REQUEST).send(ErrorResponse("Appointment not found"));

		return res.status(OK).send(appointment);
	} catch (e) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Appointment Retrieval Failed: ${e.message}`));
	}
}

export const DeletePendingAppointment = async (req, res) => {
	const { user_id } = req.params;

	const { error } = appointmentValidationSchema.validate(req.body);
	if (error) return res.status(BAD_REQUEST).send(ErrorResponse(error.message));


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

			return res.status(OK).send(data);

		});

	} catch (e) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`Appointment delete Failed: ${e.message}`));
	}
}

export default {
	CreateAppointment,
	DeletePendingAppointment,
	GetAppointment
};
