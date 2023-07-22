import { Router } from "express";
import {
  Signup,
  AutoLogin,
  Login,
  googleLogin,
} from "../controller/userController";
import cors from "cors";
var corsOptions = {
  origin: "https://cinemaa.vercel.app",
};

const router = Router();

router.post("/signup", cors(corsOptions), Signup);
router.get("/login", cors(corsOptions), AutoLogin);
router.post("/login", Login);
router.post("/googlelogin", googleLogin);

export default router;
