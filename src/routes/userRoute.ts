import { Router } from "express";
import {
  Signup,
  AutoLogin,
  Login,
  googleLogin,
  AddRemoveFollower,
  getUser,
  editProfile,
  getAllUsers,
  getAllFollowers,
  loginAsUser,
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
router.get("/", TokenVerify, getAllUsers);
router.get("/followers/:id", TokenVerify, getAllFollowers);
router.get("/loginas/:id", TokenVerify, loginAsUser);

export default router;
