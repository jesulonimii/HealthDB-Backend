import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
	appointment_id: { type: String, required: true },
	date_time: { type: Date, required: true },
	student_info: {
		first_name: { type: String, required: true },
		last_name: { type: String, required: true },
		matric_number: { type: String, required: true },
		profile_image: { type: String, required: true },
	},
});


const AppointmentModel = mongoose.model('Appointment', appointmentSchema)

export default AppointmentModel