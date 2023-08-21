import { Router } from "express";
import {
  Signup,
  AutoLogin,
  Login,
  googleLogin,
  AddRemoveFollower,
} from "../controller/userController";
import { TokenVerify } from "../middleware/auth-middleware";

const router = Router();

router.post("/signup", Signup);
router.get("/login", AutoLogin);
router.post("/login", Login);
router.post("/googlelogin", googleLogin);
router.get("/follow/:id", TokenVerify, AddRemoveFollower);

export default router;
