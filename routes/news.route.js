//Appointments Routes

import { Router } from "express";
import { GetAllNews } from "#controllers/news.controller";

const router = Router();

router.get("/", GetAllNews)

export default router;
