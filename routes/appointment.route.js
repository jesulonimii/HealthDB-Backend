//Appointments Routes

import { Router } from "express";
import { EditUser, GetUser } from "#controllers/user.controller";
import { CreateAppointment, GetAppointment } from "#controllers/appointment.controller";

const router = Router();

router.get("/", GetAppointment);
router.post("/:user_id", CreateAppointment);

export default router;
