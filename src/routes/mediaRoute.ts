import { Router } from "express";
import {
  AddMedia,
  RemoveMedia,
  GetMedia,
  AddMediaToHistory,
  SearchVideos,
} from "../controller/mediaController";
import { TokenVerify } from "../middleware/auth-middleware";
import { AddFeedback } from "../controller/feedbackController";
import {
  sendAllNotification,
  AddNotification,
} from "../controller/notificationController";

const router = Router();

router.post("/addmedia", TokenVerify, AddMedia);
router.get("/", TokenVerify, GetMedia);
router.delete("/:id", TokenVerify, RemoveMedia);
router.post("/feedback", AddFeedback);
router.get("/notification", sendAllNotification);
router.post("/notification", TokenVerify, AddNotification);
router.post("/history", TokenVerify, AddMediaToHistory);
router.post("/trailer", SearchVideos);

export default router;
