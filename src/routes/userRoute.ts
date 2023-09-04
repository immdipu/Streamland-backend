import { Router } from "express";
import {
  Signup,
  AutoLogin,
  Login,
  googleLogin,
  AddRemoveFollower,
  getUser,
  editProfile,
} from "../controller/userController";
import { TokenVerify } from "../middleware/auth-middleware";

const router = Router();

router.post("/signup", Signup);
router.get("/login", AutoLogin);
router.post("/login", Login);
router.get("/:username", TokenVerify, getUser);
router.post("/googlelogin", googleLogin);
router.get("/follow/:id", TokenVerify, AddRemoveFollower);
router.post("/editprofile", TokenVerify, editProfile);

export default router;
