import { Router } from "express";
import {
  Signup,
  AutoLogin,
  Login,
  googleLogin,
} from "../controller/userController";

const router = Router();

router.post("/signup", Signup);
router.get("/login", AutoLogin);
router.post("/login", Login);
router.post("/googlelogin", googleLogin);

export default router;
