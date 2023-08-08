//Appointments Routes

import { Router } from "express";
import {
	CreateAppointment,
	DeletePendingAppointment,
	GetAllAppointments,
	GetAppointment,
} from "#controllers/appointment.controller";

const router = Router();

router.get("/", GetAllAppointments);
router.get("/fetch", GetAppointment);
router.post("/create", CreateAppointment);
router.delete("/delete", DeletePendingAppointment);

export default router;
