import { Router } from "express";
import { TokenVerify } from "../middleware/auth-middleware";
import {
  accessCreateSingleChat,
  getUserChats,
} from "../controller/chatController";

const router = Router();

router.post("/", TokenVerify, accessCreateSingleChat);
router.get("/allchats", TokenVerify, getUserChats);

export default router;
