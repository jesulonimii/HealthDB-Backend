import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
	{
		appointment_id: { type: String, required: true },
		date_time: { type: Date, required: true },
		student_info: {
			user_id: { type: String },
			personal_info: {
				first_name: { type: String, required: true },
				last_name: { type: String, required: true },
				profile_image: {
					type: String,
					default:
						"https://static.vecteezy.com/system/resources/previews/004/511/281/original/default-avatar-photo-placeholder-profile-picture-vector.jpg",
				},
				date_of_birth: { type: Date, default: null },
				gender: { type: String, default: null },
			},
			student: {
				department: { type: String, default: null },
				faculty: { type: String, default: null },
				level: { type: String, default: null },
				matric_number: { type: String, default: null },
			},
			contact_info: {
				address: { type: String, default: null },
				phone: { type: String, default: null },
				email: { type: String, default: null },
			},
			emergency_contacts: [{ type: Object }], // Array of strings for emergency contacts
			medical_history: {
				last_visit: { type: Date, default: null },
				allergies: { type: String }, // Array of strings for allergies
				additional_medical_info: { type: String, default: null }, // String
				previous_medications: [{ type: Object, default: null }], // Array of objects for previous medications
				doctors_notes: [{ type: Object, default: null }], // Array of  doctors notes
				hospitalizations: [{ type: Object }], // Array of strings for hospitalizations
			},
			appointments: [{ type: Object }], // Array of objects for appointments
			health_centre_registration: {
				status: { type: String, default: "pending" },
				message: { type: String, default: "Please visit the health centre to complete your registration." },
			},
		},
	},
	{
		timeseries: {
			timeField: "date_time",
			granularity: "hours",
		},
		autoCreate: false,
		expireAfterSeconds: 86400,
	}
);


const AppointmentModel = mongoose.model('Appointment', appointmentSchema)

export default AppointmentModel