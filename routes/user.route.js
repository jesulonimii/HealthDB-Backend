//User Routes

import { Router } from "express";
import { EditUser, GetUser } from "#controllers/user.controller";

const router = Router();

router.get("/", GetUser);
router.patch("/:id", EditUser);

export default router;
