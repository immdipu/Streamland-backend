import { Router } from "express";
import { AddMedia, RemoveMedia } from "../controller/mediaController";
import { TokenVerify } from "../middleware/auth-middleware";

const router = Router();

router.post("/addmedia", TokenVerify, AddMedia);
router.delete("/", TokenVerify, RemoveMedia);

export default router;
