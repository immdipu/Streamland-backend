import { Router } from "express";
import { Signup, AutoLogin, Login } from "../controller/userController";

const router = Router();

router.post("/signup", Signup);
router.get("/login", AutoLogin);
router.post("/login", Login);

export default router;
