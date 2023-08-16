//Appointments Routes

import { Router } from "express";
import { GetAllNews, PublishNews } from "#controllers/news.controller";

const router = Router();

router.get("/", GetAllNews)
router.post("/publish", PublishNews)

export default router;
