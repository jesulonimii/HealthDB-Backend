//User Routes

import { Router } from "express";
import { EditUser, GetUser, GetUserNotifications, NotifyUser } from "#controllers/user.controller";

const router = Router();

router.get("/", GetUser);
router.patch("/edit", EditUser);
router.post("/notify", NotifyUser);
router.get("/notifications", GetUserNotifications);

export default router;
