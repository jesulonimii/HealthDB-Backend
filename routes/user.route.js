//User Routes

import { Router } from "express";
import { EditUser, GetUser, GetUserNotifications } from "#controllers/user.controller";

const router = Router();

router.get("/", GetUser);
router.patch("/edit", EditUser);
router.get("/notifications", GetUserNotifications);

export default router;
