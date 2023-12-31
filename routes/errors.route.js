//Appointments Routes

import { Router } from "express";
import { ErrorResponse, STATUS_CODE } from "#utils";

const router = Router();

router.all("/*", (req, res) => {
	res.status(STATUS_CODE.NOT_FOUND).send(ErrorResponse(`Endpoint for the specified request '${req.method.toUpperCase()}' does not exist.`))
})

export default router;
