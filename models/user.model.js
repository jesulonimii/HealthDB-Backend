import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    personal_info: {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        profile_image: { type: String, default: "https://static.vecteezy.com/system/resources/previews/004/511/281/original/default-avatar-photo-placeholder-profile-picture-vector.jpg" },
        date_of_birth: { type: Date, default: null },
        gender: { type: String, default: null },
    },
    contact_info: {
        address: { type: String, default: null },
        phone: { type: String, default: null },
        email: { type: String, default: null },
    },
    emergency_contacts: [{ type: Object }], // Array of strings for emergency contacts
    medical_history: {
        last_visit: { type: Date, default: null },
        allergies: [{ type: String }], // Array of strings for allergies
        hospitalizations: [{ type: Object }], // Array of strings for hospitalizations
    },
    notifications: [{ type: Object }], // Array of objects for notifications
    appointments: [{ type: Object }], // Array of objects for appointments
    health_centre_registration: {
        status: { type: Boolean, default: false },
        message: { type: String, default: "Please visit the health centre to complete your registration." },
    },
    pending_appointment: { type: String, default: null },
    completed_app_registration: { type: Boolean, default: false },
});


const UserModel = mongoose.model('User', userSchema)

export default UserModel