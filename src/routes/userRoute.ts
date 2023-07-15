import { Router } from "express";
import { Signup } from "../controller/userController";

const router = Router();

router.post("/signup", Signup);

export default router;
