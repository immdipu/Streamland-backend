import { Router } from "express";
import { AddMedia, RemoveMedia, GetMedia } from "../controller/mediaController";
import { TokenVerify } from "../middleware/auth-middleware";

const router = Router();

router.post("/addmedia", TokenVerify, AddMedia);
router.get("/", TokenVerify, GetMedia);
router.delete("/:id", TokenVerify, RemoveMedia);

export default router;
