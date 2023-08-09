//Appointments Routes

import { Router } from "express";
import {
	CreateAppointment,
	CreateMedicalReport,
	CreatePrescription,
	DeletePendingAppointment,
	GetAllAppointments,
	GetAppointment,
} from "#controllers/appointment.controller";

const router = Router();

router.get("/", GetAllAppointments);
router.get("/fetch", GetAppointment);
router.post("/create", CreateAppointment);
router.delete("/delete", DeletePendingAppointment);

//doctors
router.post("/medical-reports/create", CreateMedicalReport);
router.post("/prescriptions/create", CreatePrescription);


export default router;
