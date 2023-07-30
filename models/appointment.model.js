import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    appointment_id: { type: String, required: true },
    date_time: { type: Date, required: true },

});


const AppointmentModel = mongoose.model('Appointment', appointmentSchema)

export default AppointmentModel