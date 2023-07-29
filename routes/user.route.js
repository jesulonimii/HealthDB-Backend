//User Routes

import { Router } from "express";
import { EditUser } from "#controllers/user.controller";

const router = Router();

router.post("/:id", EditUser);

export default router;
