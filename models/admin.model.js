import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, required: true },
		name: { type: String, default: "" },
		phone: { type: String, default: "" },
	},
	{ timestamps: true }
);

// roles => "Doctor" | "Nurse" | "Admin"


const AdminModel = mongoose.model('Admin', adminSchema)

export default AdminModel