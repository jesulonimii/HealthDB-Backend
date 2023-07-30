//Appointments Routes

import { Router } from "express";
import { CreateAppointment, DeletePendingAppointment, GetAppointment } from "#controllers/appointment.controller";

const router = Router();

router.get("/", GetAppointment);
router.post("/:user_id", CreateAppointment);
router.delete("/:user_id", DeletePendingAppointment);

export default router;
