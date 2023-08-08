//Admin Routes

import { Router } from "express";
import { AdminLogin } from "#controllers/admin.controller";

const router = Router();

router.post("/login", AdminLogin);

export default router;
