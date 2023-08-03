//Appointments Routes

import { Router } from "express";
import { ErrorResponse, STATUS_CODE } from "#utils";
import app from "../app.js";

const router = Router();

app.all("/", (req, res) => {
	res.end("Welcome to HealthDB Api");
})

router.all("/*", (req, res) => {
	res.status(STATUS_CODE.NOT_FOUND).send(ErrorResponse("Endpoint does not exist."))
})

export default router;
