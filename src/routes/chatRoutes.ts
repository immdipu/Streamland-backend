import { Router } from "express";
import { TokenVerify } from "../middleware/auth-middleware";
import {
  accessCreateSingleChat,
  getUserChats,
  createGroupChat,
  getAllGroupChats,
  addToGroupChat,
  getGroupDetails,
  removeFromGroupChat,
} from "../controller/chatController";

const router = Router();

router.post("/", TokenVerify, accessCreateSingleChat);
router.get("/allchats", TokenVerify, getUserChats);
router.post("/group", TokenVerify, createGroupChat);
router.get("/group", TokenVerify, getAllGroupChats);
router.put("/group", TokenVerify, addToGroupChat);
router.post("/group/details", TokenVerify, getGroupDetails);
router.delete("/group", TokenVerify, removeFromGroupChat);

export default router;
