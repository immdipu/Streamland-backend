import { Router } from "express";
import { TokenVerify } from "../middleware/auth-middleware";
import { sendMessage, getAllMessages } from "../controller/messageController";

const router = Router();

router.post("/", TokenVerify, sendMessage);
router.get("/:chatId", TokenVerify, getAllMessages);

export default router;
