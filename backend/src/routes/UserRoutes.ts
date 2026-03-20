import { Router } from "express";
import userController from "../controllers/UserController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/me", authMiddleware, userController.me);

export default router;