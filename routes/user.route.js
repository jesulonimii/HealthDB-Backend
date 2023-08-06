//User Routes

import { Router } from "express";
import { EditUser, GetUser } from "#controllers/user.controller";

const router = Router();

router.get("/", GetUser);
router.patch("/edit", EditUser);

export default router;
