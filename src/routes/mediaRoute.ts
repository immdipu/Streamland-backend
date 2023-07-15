import { Router } from "express";
import { AddMedia } from "../controller/mediaController";
import { TokenVerify } from "../middleware/auth-middleware";

const router = Router();

router.post("/addmedia", TokenVerify, AddMedia);

export default router;
