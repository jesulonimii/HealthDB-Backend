//Appointments Routes

import { Router } from "express";
import { GetAllNews, PublishNews, PushNews } from "#controllers/news.controller";

const router = Router();

router.get("/", GetAllNews)
router.post("/publish", PublishNews)
router.post("/push/array", PushNews)


export default router;
