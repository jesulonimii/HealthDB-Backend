//Appointments Routes

import { Router } from "express";
import { CreateAppointment, DeletePendingAppointment, GetAllAppointments } from "#controllers/appointment.controller";

const router = Router();

router.get("/", GetAllAppointments);
router.post("/create", CreateAppointment);
router.delete("/delete", DeletePendingAppointment);

export default router;
